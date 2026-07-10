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

function render() {
  const root = document.getElementById("cert-root");
  const completed = TRACKS.filter((t) => getUnlocked(t.id) > t.count);

  if (completed.length === 0) {
    root.innerHTML = `
      <div class="landing-eyebrow">结业证书</div>
      <h1>还没有完成任何一条赛道</h1>
      <p class="landing-lede">通关初级、进阶、高级或调试挑战任意一条赛道的全部关卡，就能在这里生成你的证书。</p>
      <a class="quiz-btn-primary" href="course.html">去继续学 →</a>
    `;
    return;
  }

  const savedName = localStorage.getItem(NAME_KEY) || "";
  const latestDate = completed
    .map((t) => getCompletedAt(t.id))
    .filter(Boolean)
    .sort()
    .pop();

  root.innerHTML = `
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
      </div>
    </div>
  `;

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
}

async function init() {
  // 登录过账号的话，先把云端进度拉下来——这样在另一台设备上学完的赛道，
  // 回到这台设备打开证书页也能看到，不用非得在完成的那台设备上才能生成。
  if (window.cloudProgressReady) await window.cloudProgressReady;
  render();
}

init();
