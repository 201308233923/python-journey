// 结业证书：完整通关某条赛道之后，生成一张可打印/可分享的证书。
// 判断"是否通关"只看本地存档的解锁数量（跟侧栏"已完成 X/N 关"用的是同一套数据），
// 不需要额外的完成状态字段——除了完成时间，那个存不下来就没法显示日期。

const TRACKS = [
  { id: "course", emoji: "🌱", label: "初级", count: 12 },
  { id: "assessment", emoji: "⚡", label: "进阶", count: 6 },
  { id: "advanced", emoji: "🚀", label: "高级", count: 6 },
  { id: "debug", emoji: "🐛", label: "调试挑战", count: 8 },
];

const NAME_KEY = "codecourse_certificate_name";

function getUnlocked(trackId) {
  const raw = localStorage.getItem(`codecourse_${trackId}_v2_unlocked`);
  return raw ? parseInt(raw, 10) : 1;
}

function getCompletedAt(trackId) {
  return localStorage.getItem(`codecourse_${trackId}_v2_completed_at`);
}

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

function escapeHtml(s) {
  const div = document.createElement("div");
  div.textContent = s;
  return div.innerHTML;
}

function passedCount(unlocked, count) {
  return Math.min(Math.max(unlocked - 1, 0), count);
}

// 复用各赛道关卡页已经在记的"每一关错了几次"（app.js 的 failKey），跨四条赛道汇总一遍，
// 挑出错得最多的几关——不用等通关一整条赛道才看得到，只要真的卡过就会出现在这里。
// 只用关卡编号而不是关卡标题，是因为证书页刻意没有加载四条赛道的关卡数据
// （levels/ 目录、assessment-levels.js等）来省页面体积，标题得从那些文件里查，
// 而编号从本地存档的key名就能直接读出来。
function getWeakPoints() {
  const points = [];
  TRACKS.forEach((t) => {
    for (let id = 1; id <= t.count; id++) {
      const fails = parseInt(localStorage.getItem(`codecourse_${t.id}_v2_fails_${id}`) || "0", 10);
      if (fails > 0) points.push({ track: t, levelId: id, fails });
    }
  });
  points.sort((a, b) => b.fails - a.fails);
  return points.slice(0, 5);
}

function renderWeakPointsSection() {
  const points = getWeakPoints();
  if (points.length === 0) return "";
  const rows = points
    .map((p) => `<li>${p.track.emoji} ${p.track.label} 第${p.levelId}关：错了 ${p.fails} 次</li>`)
    .join("");
  return `
    <div class="cert-weak-points no-print">
      <h2 class="cert-compare-title">🎯 你比较容易卡壳的地方</h2>
      <p class="cert-compare-desc">按错误次数从多到少排的前几个，可以回去再看看是不是同一类知识点。</p>
      <ul class="cert-track-list">${rows}</ul>
    </div>
  `;
}

function renderCertificateSection(completed) {
  if (completed.length === 0) {
    return `
      <div class="landing-eyebrow">结业证书</div>
      <h1>还没有完成任何一条赛道</h1>
      <p class="landing-lede">通关初级、进阶、高级或调试挑战任意一条赛道的全部关卡，就能在这里生成你的证书。</p>
      <a class="quiz-btn-primary" href="course.html">去继续学 →</a>
    `;
  }

  const savedName = localStorage.getItem(NAME_KEY) || "";
  const latestDate = completed
    .map((t) => getCompletedAt(t.id))
    .filter(Boolean)
    .sort()
    .pop();

  return `
    <div class="cert-card" id="cert-card">
      <div class="cert-brand">🌱 码芽</div>
      <div class="cert-title">结业证书</div>
      <div class="cert-name" id="cert-name-display">${escapeHtml(savedName) || "编程学习者"}</div>
      <p class="cert-desc">在码芽完成了以下学习内容：</p>
      <ul class="cert-track-list">
        ${completed.map((t) => `<li>${t.emoji} ${t.label}（全部${t.count}关）</li>`).join("")}
      </ul>
      <div class="cert-date">${latestDate ? formatDate(latestDate) : ""}</div>
    </div>
    <div class="cert-controls no-print">
      <label class="cert-name-label">证书上显示的名字：
        <input id="cert-name-input" type="text" placeholder="编程学习者" value="${escapeHtml(savedName)}" maxlength="20" />
      </label>
      <div class="cert-btn-row">
        <button class="quiz-btn-primary" id="cert-print-btn">🖨 打印 / 保存为PDF</button>
        <button class="quiz-btn-primary secondary" id="cert-share-btn">📋 复制分享文案</button>
        <button class="quiz-btn-primary secondary" id="cert-shareimg-btn">📸 生成分享图</button>
      </div>
      <div id="share-card-preview" class="share-card-preview hidden no-print"></div>
    </div>
  `;
}

// 手写一个圆角矩形路径——不用 ctx.roundRect()，避免依赖太新的浏览器API。
function drawRoundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// 分享图用固定的浅色配色（不跟随访客系统的深色/浅色模式）——分享出去给别人看的
// 图片，画面得自己保持一致好看，不能因为生成图片那一刻用户的系统是深色模式，
// 分享出去之后别人看到的却是另一种配色。
function buildShareCardCanvas(completed, name) {
  const W = 750;
  const H = 1000;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  const fontFamily = "-apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif";
  const centerX = W / 2;

  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#4f6df5");
  bg.addColorStop(1, "#7b93ff");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "#ffffff";
  drawRoundedRect(ctx, 40, 40, W - 80, H - 80, 28);
  ctx.fill();

  ctx.textAlign = "center";

  ctx.fillStyle = "#4f6df5";
  ctx.font = `700 22px ${fontFamily}`;
  ctx.fillText("🌱 码芽", centerX, 140);

  ctx.fillStyle = "#22262e";
  ctx.font = `800 40px ${fontFamily}`;
  ctx.fillText("结业证书", centerX, 195);

  ctx.strokeStyle = "#e3e6ec";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(centerX - 60, 225);
  ctx.lineTo(centerX + 60, 225);
  ctx.stroke();

  ctx.fillStyle = "#22262e";
  ctx.font = `700 34px ${fontFamily}`;
  ctx.fillText(name || "编程学习者", centerX, 285);

  ctx.fillStyle = "#6b7280";
  ctx.font = `400 18px ${fontFamily}`;
  ctx.fillText("在码芽完成了以下学习内容：", centerX, 325);

  let y = 380;
  ctx.fillStyle = "#22262e";
  ctx.font = `600 24px ${fontFamily}`;
  completed.forEach((t) => {
    ctx.fillText(`${t.emoji} ${t.label}（全部${t.count}关）`, centerX, y);
    y += 46;
  });

  const streakCount = parseInt(localStorage.getItem("codecourse_streak_count") || "0", 10);
  if (streakCount > 0) {
    y += 16;
    ctx.fillStyle = "#e8590c";
    ctx.font = `600 22px ${fontFamily}`;
    ctx.fillText(`🔥 连续学习 ${streakCount} 天`, centerX, y);
  }

  ctx.fillStyle = "#6b7280";
  ctx.font = `400 16px ${fontFamily}`;
  ctx.fillText(
    new Date().toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" }),
    centerX,
    900
  );

  const url = `${location.origin}${location.pathname.replace(/certificate\.html$/, "index.html")}`;
  ctx.fillStyle = "#9aa0ac";
  ctx.font = `400 15px ${fontFamily}`;
  ctx.fillText(`🌱 码芽 · 免费学Python · ${url}`, centerX, 935);

  return canvas;
}

function wireCertificateSection(completed) {
  if (completed.length === 0) return;

  document.getElementById("cert-name-input").addEventListener("input", (e) => {
    const name = e.target.value.trim();
    localStorage.setItem(NAME_KEY, name);
    document.getElementById("cert-name-display").textContent = name || "编程学习者";
  });

  document.getElementById("cert-print-btn").addEventListener("click", () => window.print());

  document.getElementById("cert-share-btn").addEventListener("click", async () => {
    const names = completed.map((t) => t.label).join("、");
    const url = `${location.origin}${location.pathname.replace(/certificate\.html$/, "index.html")}`;
    const text = `我在码芽完成了${names}的全部关卡，一起来学Python吧！${url}`;
    const btn = document.getElementById("cert-share-btn");
    const originalText = btn.textContent;
    try {
      await navigator.clipboard.writeText(text);
      btn.textContent = "✅ 已复制";
    } catch (e) {
      btn.textContent = "复制失败，手动选中文字复制吧";
    }
    setTimeout(() => {
      btn.textContent = originalText;
    }, 1800);
  });

  document.getElementById("cert-shareimg-btn").addEventListener("click", () => {
    const name = localStorage.getItem(NAME_KEY) || "";
    const canvas = buildShareCardCanvas(completed, name);
    const dataUrl = canvas.toDataURL("image/png");
    const previewBox = document.getElementById("share-card-preview");
    previewBox.innerHTML = `
      <img src="${dataUrl}" alt="码芽结业证书分享图" class="share-card-img" />
      <p class="landing-lede share-card-hint">手机上长按图片保存到相册，就能发朋友圈/小红书了；电脑上点下面按钮下载。</p>
      <a class="quiz-btn-primary secondary" href="${dataUrl}" download="码芽结业证书.png">⬇️ 下载图片</a>
    `;
    previewBox.classList.remove("hidden");
    previewBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
}

// 跟朋友的进度码对比一下学到哪了——只解码读取，不会碰自己的本地存档
// （跟"导入进度码"是两码事，那个是拿别人的码覆盖自己的进度，这里只是看一眼）。
function renderCompareSection() {
  return `
    <div class="cert-compare no-print">
      <h2 class="cert-compare-title">👥 跟朋友比一比</h2>
      <p class="cert-compare-desc">让朋友在任意学习页侧栏点"📤 导出进度码"，把那段码粘贴到下面——不会动你自己的进度。</p>
      <textarea id="compare-input" class="cert-compare-input" placeholder="粘贴朋友的进度码"></textarea>
      <button class="quiz-btn-primary secondary" id="compare-btn">对比进度</button>
      <div id="compare-result"></div>
    </div>
  `;
}

function wireCompareSection() {
  document.getElementById("compare-btn").addEventListener("click", () => {
    const code = document.getElementById("compare-input").value.trim();
    const resultBox = document.getElementById("compare-result");
    if (!code) return;
    try {
      const friendData = decodeProgressCode(code);
      const rows = TRACKS.map((t) => {
        const mine = passedCount(getUnlocked(t.id), t.count);
        const theirsRaw = friendData[`codecourse_${t.id}_v2_unlocked`];
        // parseInt 解析不出数字（码被手动改坏了之类）就当1处理，而不是让 NaN
        // 一路传下去，最后在页面上显示"TA NaN/12关"这种东西。
        const theirsUnlocked = theirsRaw ? parseInt(theirsRaw, 10) || 1 : 1;
        const theirs = passedCount(theirsUnlocked, t.count);
        return `<li>${t.emoji} ${t.label}：你 ${mine}/${t.count} 关　·　TA ${theirs}/${t.count} 关</li>`;
      });
      resultBox.innerHTML = `<ul class="cert-track-list">${rows.join("")}</ul>`;
    } catch (e) {
      resultBox.innerHTML = `<p class="cert-compare-error">这段码看起来不完整或者不对，检查一下有没有复制全。</p>`;
    }
  });
}

function render() {
  const root = document.getElementById("cert-root");
  const completed = TRACKS.filter((t) => getUnlocked(t.id) > t.count);

  root.innerHTML = renderCertificateSection(completed) + renderWeakPointsSection() + renderCompareSection();

  wireCertificateSection(completed);
  wireCompareSection();
}

async function init() {
  // 登录过账号的话，先把云端进度拉下来——这样在另一台设备上学完的赛道，
  // 回到这台设备打开证书页也能看到，不用非得在完成的那台设备上才能生成。
  if (window.cloudProgressReady) await window.cloudProgressReady;
  render();
}

init();
