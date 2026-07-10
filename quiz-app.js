const root = document.getElementById("quiz-root");
let currentQ = 0;
let sessionQuiz = [];
let wrongTargets = [];

function escapeHtml(s) {
  const div = document.createElement("div");
  div.textContent = s;
  return div.innerHTML;
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// 打乱题目顺序，也打乱每道题里选项的顺序（同时把正确答案的下标也跟着重新对应上）。
function shuffleQuestion(q) {
  const order = shuffle(q.options.map((_, i) => i));
  return {
    q: q.q,
    targetLevel: q.targetLevel,
    options: order.map((i) => q.options[i]),
    answer: order.indexOf(q.answer),
  };
}

const QUESTIONS_PER_QUIZ = 10;
const COURSE_LEVEL_COUNT = 12;
const ASSESSMENT_LEVEL_COUNT = 6;
const ADVANCED_LEVEL_COUNT = 6;
const DEBUG_LEVEL_COUNT = 8;

// 只读一下有没有"真正解锁到第1关以后"的存档，不需要加载 course/assessment/advanced 的关卡数据。
function getResumePoint(track, totalLevels) {
  const raw = localStorage.getItem(`codecourse_${track}_v2_unlocked`);
  const unlocked = raw ? parseInt(raw, 10) : 1;
  if (!unlocked || unlocked <= 1) return null;
  return Math.min(unlocked, totalLevels);
}

function goToResumePoint() {
  const courseResume = getResumePoint("course", COURSE_LEVEL_COUNT);
  const assessmentResume = getResumePoint("assessment", ASSESSMENT_LEVEL_COUNT);
  const advancedResume = getResumePoint("advanced", ADVANCED_LEVEL_COUNT);
  const debugResume = getResumePoint("debug", DEBUG_LEVEL_COUNT);
  if (courseResume) {
    location.href = `course.html?resume=${courseResume}`;
  } else if (assessmentResume) {
    location.href = `assessment.html?resume=${assessmentResume}`;
  } else if (advancedResume) {
    location.href = `advanced.html?resume=${advancedResume}`;
  } else if (debugResume) {
    location.href = `debug.html?resume=${debugResume}`;
  } else {
    location.reload();
  }
}

function renderIntro() {
  root.innerHTML = `
    <div class="landing-eyebrow">水平测试</div>
    <h1>先做几道小题，看看你现在的水平</h1>
    <p class="landing-lede">题库里有${QUIZ.length}道题，每次随机抽${QUESTIONS_PER_QUIZ}道，大概2分钟，题目和选项顺序每次都不一样。做完之后，会帮你推荐一个正好适合你的起点。</p>
    <button class="quiz-btn-primary" id="start-quiz-btn">开始测试</button>
    <p class="quiz-skip">不想测？<a href="course.html">直接当初级学</a> · <a href="assessment.html">直接做进阶</a> · <a href="advanced.html">直接做高级</a> · <a href="debug.html">直接做调试挑战</a></p>
    <p class="quiz-skip">已经注册过账号？<a href="#" id="intro-login-toggle">登录恢复进度</a></p>
    <div id="intro-login-box" class="account-gate hidden">
      <input id="intro-username" type="text" placeholder="用户名" autocomplete="off" />
      <input id="intro-password" type="password" placeholder="密码" autocomplete="off" />
      <div class="account-btn-row">
        <button id="intro-login-btn" class="quiz-btn-primary">登录</button>
      </div>
      <p class="account-gate-message" id="intro-login-message"></p>
    </div>
  `;
  document.getElementById("start-quiz-btn").addEventListener("click", () => {
    sessionQuiz = shuffle(QUIZ).slice(0, QUESTIONS_PER_QUIZ).map(shuffleQuestion);
    currentQ = 0;
    wrongTargets = [];
    renderQuestion();
  });

  document.getElementById("intro-login-toggle").addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("intro-login-box").classList.toggle("hidden");
  });

  document.getElementById("intro-login-btn").addEventListener("click", async () => {
    const username = document.getElementById("intro-username").value.trim();
    const password = document.getElementById("intro-password").value;
    const msgBox = document.getElementById("intro-login-message");
    const setMsg = (text, isError) => {
      msgBox.textContent = text;
      msgBox.className = "account-gate-message" + (isError ? " error" : "");
    };

    if (!username || !password) {
      setMsg("请输入用户名和密码。", true);
      return;
    }
    if (!supabaseClient) {
      setMsg("账号功能暂时加载不出来，刷新页面再试试。", true);
      return;
    }
    setMsg("登录中...");
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: usernameToEmail(username),
      password,
    });
    if (error) {
      setMsg("登录失败：用户名或密码不对。", true);
      return;
    }
    await pullProgressFromCloud(data.user.id);
    goToResumePoint();
  });
}

function renderQuestion() {
  const item = sessionQuiz[currentQ];
  root.innerHTML = `
    <div class="quiz-progress">第 ${currentQ + 1} / ${sessionQuiz.length} 题</div>
    <h2 class="quiz-question">${escapeHtml(item.q).replace(/\n/g, "<br>")}</h2>
    <div class="quiz-options">
      ${item.options
        .map((opt, i) => `<button class="quiz-option" data-i="${i}">${escapeHtml(opt)}</button>`)
        .join("")}
    </div>
  `;
  root.querySelectorAll(".quiz-option").forEach((btn) => {
    btn.addEventListener("click", () => {
      const i = parseInt(btn.dataset.i, 10);
      const correct = i === item.answer;
      if (!correct) {
        wrongTargets.push(item.targetLevel);
        btn.classList.add("wrong");
        const correctBtn = root.querySelector(`.quiz-option[data-i="${item.answer}"]`);
        if (correctBtn) correctBtn.classList.add("correct");
      } else {
        btn.classList.add("correct");
      }
      root.querySelectorAll(".quiz-option").forEach((b) => (b.disabled = true));
      setTimeout(() => {
        currentQ += 1;
        if (currentQ < sessionQuiz.length) renderQuestion();
        else renderResult();
      }, 700);
    });
  });
}

function renderAccountGate(destinationUrl) {
  return `
    <div class="account-gate">
      <p class="account-gate-label">注册一个账号，换设备/换浏览器也能接着学（用户名密码随便起，可以跳过）</p>
      <input id="gate-username" type="text" placeholder="用户名（随便起）" autocomplete="off" />
      <input id="gate-password" type="password" placeholder="密码（至少6位）" autocomplete="off" />
      <div class="account-btn-row">
        <button id="gate-signup-btn" class="quiz-btn-primary">注册并开始 →</button>
        <button id="gate-login-btn" class="secondary">已有账号，登录</button>
      </div>
      <p class="account-gate-message" id="gate-message"></p>
      <p class="quiz-skip"><a href="${destinationUrl}" id="gate-skip-link">暂不登录，直接开始 →</a></p>
    </div>
  `;
}

function wireAccountGate(destinationUrl) {
  const usernameInput = document.getElementById("gate-username");
  const passwordInput = document.getElementById("gate-password");
  const messageBox = document.getElementById("gate-message");

  function setGateMessage(text, isError) {
    messageBox.textContent = text;
    messageBox.className = "account-gate-message" + (isError ? " error" : "");
  }

  if (!supabaseClient) {
    setGateMessage("账号功能暂时加载不出来，先用下面的链接直接开始学习吧。", true);
    return;
  }

  document.getElementById("gate-signup-btn").addEventListener("click", async () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    if (!username || password.length < 6) {
      setGateMessage("用户名不能为空，密码至少6位。", true);
      return;
    }
    setGateMessage("注册中...");
    const { data, error } = await supabaseClient.auth.signUp({
      email: usernameToEmail(username),
      password,
    });
    if (error) {
      setGateMessage("注册失败：" + (error.message.includes("already") ? "这个用户名已经被用过了，换一个或者点'已有账号，登录'。" : error.message), true);
      return;
    }
    await pushProgressToCloud(data.user.id);
    location.href = destinationUrl;
  });

  document.getElementById("gate-login-btn").addEventListener("click", async () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    if (!username || !password) {
      setGateMessage("请输入用户名和密码。", true);
      return;
    }
    setGateMessage("登录中...");
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: usernameToEmail(username),
      password,
    });
    if (error) {
      setGateMessage("登录失败：用户名或密码不对。", true);
      return;
    }
    await pullProgressFromCloud(data.user.id);
    location.href = destinationUrl;
  });
}

// ---------- 每日复习：从已经学过的关卡对应的题目里随机抽几道，帮你巩固记忆 ----------
// 题源横跨三个难度题库（初级QUIZ / 中级QUIZ_INTERMEDIATE / 高级QUIZ_ADVANCED），
// 只有对应赛道的进度真的到了那一关，那一关的题目才会进入候选池——
// 这样"今天抽到的10题"既是随机的，又始终贴合当前的真实水平，不会抽到还没学过的内容。

const DAILY_REVIEW_KEY = "daily_review_date";
const DAILY_REVIEW_COUNT = 10;
let dailyReviewQuiz = [];
let dailyReviewIndex = 0;
let dailyReviewCorrect = 0;

function getTodayString() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function getCourseUnlocked() {
  const raw = localStorage.getItem("codecourse_course_v2_unlocked");
  return raw ? parseInt(raw, 10) : 1;
}

function getAssessmentUnlocked() {
  const raw = localStorage.getItem("codecourse_assessment_v2_unlocked");
  return raw ? parseInt(raw, 10) : 1;
}

function getAdvancedUnlocked() {
  const raw = localStorage.getItem("codecourse_advanced_v2_unlocked");
  return raw ? parseInt(raw, 10) : 1;
}

function getEligibleReviewPool() {
  const courseUnlocked = getCourseUnlocked();
  const assessmentUnlocked = getAssessmentUnlocked();
  const advancedUnlocked = getAdvancedUnlocked();
  let pool = [];
  if (courseUnlocked > 1) {
    pool = pool.concat(QUIZ.filter((q) => q.targetLevel < courseUnlocked));
  }
  if (assessmentUnlocked > 1 && typeof QUIZ_INTERMEDIATE !== "undefined") {
    pool = pool.concat(QUIZ_INTERMEDIATE.filter((q) => q.targetLevel < assessmentUnlocked));
  }
  if (advancedUnlocked > 1 && typeof QUIZ_ADVANCED !== "undefined") {
    pool = pool.concat(QUIZ_ADVANCED.filter((q) => q.targetLevel < advancedUnlocked));
  }
  return pool;
}

function shouldShowDailyReview() {
  if (getEligibleReviewPool().length === 0) return false; // 还没通过任何一关，没什么可复习的
  return localStorage.getItem(DAILY_REVIEW_KEY) !== getTodayString();
}

function markDailyReviewDone() {
  localStorage.setItem(DAILY_REVIEW_KEY, getTodayString());
}

function buildDailyReviewQuiz() {
  const eligible = getEligibleReviewPool();
  dailyReviewQuiz = shuffle(eligible).slice(0, Math.min(DAILY_REVIEW_COUNT, eligible.length)).map(shuffleQuestion);
  dailyReviewIndex = 0;
  dailyReviewCorrect = 0;
}

function renderDailyReview() {
  buildDailyReviewQuiz();

  root.innerHTML = `
    <div class="landing-eyebrow">今日复习</div>
    <h1>要不要先复习${dailyReviewQuiz.length}道题？</h1>
    <p class="landing-lede">从你已经学过的内容里抽的小题，帮你记得更牢，大概1分钟。</p>
    <div class="quiz-choice-row">
      <button class="quiz-btn-primary" id="start-daily-review-btn">📝 复习</button>
      <button class="quiz-btn-primary secondary" id="continue-learning-btn">📚 继续学</button>
    </div>
  `;
  document.getElementById("start-daily-review-btn").addEventListener("click", renderDailyReviewQuestion);
  document.getElementById("continue-learning-btn").addEventListener("click", () => {
    markDailyReviewDone();
    goToResumePoint();
  });
}

function renderDailyReviewQuestion() {
  const item = dailyReviewQuiz[dailyReviewIndex];
  root.innerHTML = `
    <div class="quiz-progress">今日复习 · 第 ${dailyReviewIndex + 1} / ${dailyReviewQuiz.length} 题</div>
    <h2 class="quiz-question">${escapeHtml(item.q).replace(/\n/g, "<br>")}</h2>
    <div class="quiz-options">
      ${item.options
        .map((opt, i) => `<button class="quiz-option" data-i="${i}">${escapeHtml(opt)}</button>`)
        .join("")}
    </div>
  `;
  root.querySelectorAll(".quiz-option").forEach((btn) => {
    btn.addEventListener("click", () => {
      const i = parseInt(btn.dataset.i, 10);
      const correct = i === item.answer;
      if (correct) {
        dailyReviewCorrect += 1;
        btn.classList.add("correct");
      } else {
        btn.classList.add("wrong");
        const correctBtn = root.querySelector(`.quiz-option[data-i="${item.answer}"]`);
        if (correctBtn) correctBtn.classList.add("correct");
      }
      root.querySelectorAll(".quiz-option").forEach((b) => (b.disabled = true));
      setTimeout(() => {
        dailyReviewIndex += 1;
        if (dailyReviewIndex < dailyReviewQuiz.length) renderDailyReviewQuestion();
        else renderDailyReviewResult();
      }, 700);
    });
  });
}

function renderDailyReviewResult() {
  markDailyReviewDone();
  root.innerHTML = `
    <div class="landing-eyebrow">今日复习</div>
    <p class="quiz-score">答对 ${dailyReviewCorrect} / ${dailyReviewQuiz.length} 题</p>
    <h1>复习完成！</h1>
    <p class="landing-lede">明天再来看看能不能保持连续复习。</p>
    <button class="quiz-btn-primary" id="continue-after-review-btn">继续学习 →</button>
  `;
  document.getElementById("continue-after-review-btn").addEventListener("click", goToResumePoint);
}

function renderResult() {
  const total = sessionQuiz.length;
  const correctCount = total - wrongTargets.length;
  const scoreHtml = `<p class="quiz-score">答对 ${correctCount} / ${total} 题</p>`;

  let destinationUrl;
  if (wrongTargets.length === 0) {
    destinationUrl = "assessment.html";
    root.innerHTML = `
      <div class="landing-eyebrow">测试结果</div>
      ${scoreHtml}
      <h1>你的基础已经很扎实了</h1>
      <p class="landing-lede">全部答对！建议跳过初级，直接挑战进阶题目。</p>
      ${renderAccountGate(destinationUrl)}
    `;
  } else {
    // 取所有答错题目里，对应关卡最靠前的一个——不管题目出现的顺序是什么，
    // 都能定位到"最早不会的概念"。
    const level = Math.min(...wrongTargets);
    destinationUrl = `course.html?start=${level}`;
    root.innerHTML = `
      <div class="landing-eyebrow">测试结果</div>
      ${scoreHtml}
      <h1>建议你从第${level}关开始</h1>
      <p class="landing-lede">前面的内容你已经掌握了，从这一关开始正好是你需要巩固的地方。左边的关卡列表里，之前的关卡也会帮你标记好。</p>
      ${renderAccountGate(destinationUrl)}
    `;
  }
  wireAccountGate(destinationUrl);
}

async function initQuizPage() {
  // 如果之前登录过账号，先把云端的真实进度拉下来，这样"今日复习"看的是账号里的进度，
  // 而不是这台设备本地可能是空的/过时的缓存（progress-sync.js 里定义的共享逻辑）。
  // isLoggedIn 记录这次是不是真的检测到了登录状态——只有真登录了，才允许首页自动跳过
  // 水平测试；单纯本地有进度（没登录，比如用导入进度码恢复的）不算，得让用户自己点
  // "直接当初级学"之类的链接，不做静默跳转。
  const isLoggedIn = window.cloudProgressReady ? await window.cloudProgressReady : false;

  // 侧栏"📝 复习"是用户主动点的，即使今天已经复习过、或者本来还没到弹出的时候，
  // 只要还有可复习的内容就直接进题，不用再经过"复习/继续学"这一步选择。
  const wantsReview = new URLSearchParams(location.search).get("review") === "1";
  if (wantsReview && getEligibleReviewPool().length > 0) {
    buildDailyReviewQuiz();
    renderDailyReviewQuestion();
  } else if (isLoggedIn && shouldShowDailyReview()) {
    renderDailyReview();
  } else {
    renderIntro();
  }
}

initQuizPage();
