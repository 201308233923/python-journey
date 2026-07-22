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
    _bank: q._bank,
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
    <div class="landing-eyebrow">🌱 码芽 · 免费学Python</div>
    <h1>先做几道小题，看看你现在的水平</h1>
    <p class="landing-lede">题库里有${QUIZ.length}道题，每次随机抽${QUESTIONS_PER_QUIZ}道，大概2分钟，题目和选项顺序每次都不一样。做完之后，会帮你推荐一个正好适合你的起点。全程免费，不用注册也能用。</p>
    <div class="quiz-choice-row">
      <button class="quiz-btn-primary" id="start-quiz-btn">开始测试</button>
      <button class="quiz-btn-primary secondary" id="skip-to-beginner-btn">🌱 我是新手，直接开始</button>
    </div>
    <p class="quiz-skip">已经有基础？<a href="assessment.html">直接做进阶</a> · <a href="advanced.html">直接做高级</a> · <a href="debug.html">直接做调试挑战</a></p>
  `;
  document.getElementById("start-quiz-btn").addEventListener("click", () => {
    sessionQuiz = shuffle(QUIZ).slice(0, QUESTIONS_PER_QUIZ).map(shuffleQuestion);
    currentQ = 0;
    wrongTargets = [];
    renderQuestion();
  });
  document.getElementById("skip-to-beginner-btn").addEventListener("click", () => {
    location.href = "course.html";
  });
}

// 老用户回访：有过真实进度（不管是不是登录状态——本地存的档、导入过进度码，
// 都算），但又不是"今天该复习"的那个时机（今天复习过了，或者压根没有可复习的
// 内容），这种情况下不该再把人拖回"先做水平测试"这个新手流程——之前就是这样
// 处理的，等于每次回来都要再看一遍测试首页，对已经有进度的人来说很不合理。
function renderWelcomeBack() {
  root.innerHTML = `
    <div class="landing-eyebrow">欢迎回来</div>
    <h1>要继续上次的学习吗？</h1>
    <p class="landing-lede">检测到你之前学过一些内容，点"继续学"直接回到上次的进度，或者重新测一次水平。</p>
    <div class="quiz-choice-row">
      <button class="quiz-btn-primary" id="welcome-continue-btn">📚 继续学</button>
      <button class="quiz-btn-primary secondary" id="welcome-retest-btn">🔄 重新测试</button>
    </div>
  `;
  document.getElementById("welcome-continue-btn").addEventListener("click", goToResumePoint);
  document.getElementById("welcome-retest-btn").addEventListener("click", renderIntro);
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
    await pullProgressFromCloud(data.user.id, true);
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
// 答错的题不是扣完分就算了——这一轮问完之后，答错的题会自动组成"下一轮"
// 重新问一遍，一直循环到全部答对为止，确保复习真的巩固到了，不是蒙混过关。
let dailyReviewWrongQueue = [];
let dailyReviewRound = 1;
let dailyReviewTotalQuestions = 0;

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

// QUIZ_BANKS_BY_NAME：给答错重做换变体用的——targetLevel这个数字在三个题库里
// 各自独立编号（QUIZ里的3和QUIZ_INTERMEDIATE里的3是完全不同的知识点），
// 光凭targetLevel搜不知道该去哪个题库里找同类题，所以每道题池子里的题都会
// 标一个_bank字段记住自己是从哪个题库来的（见下面.map里的Object.assign）。
const QUIZ_BANKS_BY_NAME = {
  course: () => QUIZ,
  assessment: () => (typeof QUIZ_INTERMEDIATE !== "undefined" ? QUIZ_INTERMEDIATE : []),
  advanced: () => (typeof QUIZ_ADVANCED !== "undefined" ? QUIZ_ADVANCED : []),
};

function getEligibleReviewPool() {
  const courseUnlocked = getCourseUnlocked();
  const assessmentUnlocked = getAssessmentUnlocked();
  const advancedUnlocked = getAdvancedUnlocked();
  let pool = [];
  if (courseUnlocked > 1) {
    pool = pool.concat(QUIZ.filter((q) => q.targetLevel < courseUnlocked).map((q) => Object.assign({ _bank: "course" }, q)));
  }
  if (assessmentUnlocked > 1 && typeof QUIZ_INTERMEDIATE !== "undefined") {
    pool = pool.concat(
      QUIZ_INTERMEDIATE.filter((q) => q.targetLevel < assessmentUnlocked).map((q) => Object.assign({ _bank: "assessment" }, q))
    );
  }
  if (advancedUnlocked > 1 && typeof QUIZ_ADVANCED !== "undefined") {
    pool = pool.concat(
      QUIZ_ADVANCED.filter((q) => q.targetLevel < advancedUnlocked).map((q) => Object.assign({ _bank: "advanced" }, q))
    );
  }
  return pool;
}

// 答错一道题，订正轮不想还是问一模一样那道题（选项顺序打乱了，但题干和正确
// 答案没变，其实就是"背下正确答案"而不是真的懂）。同一个targetLevel（同一个
// 知识点）在题库里通常还有好几道别的题，优先换一道没问过的来考同一个知识点；
// 实在没有别的题（比如这个知识点题库里就只有一道）才退回问原题。
function pickRetryVariant(item) {
  const bank = QUIZ_BANKS_BY_NAME[item._bank] ? QUIZ_BANKS_BY_NAME[item._bank]() : [];
  const alternatives = bank.filter((q) => q.targetLevel === item.targetLevel && q.q !== item.q);
  if (alternatives.length === 0) return item;
  const pick = alternatives[Math.floor(Math.random() * alternatives.length)];
  return Object.assign({ _bank: item._bank }, pick);
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
  dailyReviewWrongQueue = [];
  dailyReviewRound = 1;
  dailyReviewTotalQuestions = dailyReviewQuiz.length;
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
  const roundLabel = dailyReviewRound > 1 ? `（第${dailyReviewRound}轮·订正错题）` : "";
  root.innerHTML = `
    <div class="quiz-progress">今日复习${roundLabel} · 第 ${dailyReviewIndex + 1} / ${dailyReviewQuiz.length} 题</div>
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
        // 只有第一轮的"答对"才计入最终分数——重新订正轮答对了是"补救"，
        // 不算"一次就会"，这样最后显示的分数才反映真实的第一次掌握情况。
        if (dailyReviewRound === 1) dailyReviewCorrect += 1;
        btn.classList.add("correct");
      } else {
        btn.classList.add("wrong");
        const correctBtn = root.querySelector(`.quiz-option[data-i="${item.answer}"]`);
        if (correctBtn) correctBtn.classList.add("correct");
        dailyReviewWrongQueue.push(pickRetryVariant(item));
      }
      root.querySelectorAll(".quiz-option").forEach((b) => (b.disabled = true));
      setTimeout(() => {
        dailyReviewIndex += 1;
        if (dailyReviewIndex < dailyReviewQuiz.length) {
          renderDailyReviewQuestion();
        } else if (dailyReviewWrongQueue.length > 0) {
          // 这一轮问完了，但还有答错的——把这些题重新组成下一轮，打乱顺序
          // 再问一遍，一直循环到某一轮全部答对为止。
          dailyReviewQuiz = shuffle(dailyReviewWrongQueue).map(shuffleQuestion);
          dailyReviewWrongQueue = [];
          dailyReviewIndex = 0;
          dailyReviewRound += 1;
          renderDailyReviewQuestion();
        } else {
          renderDailyReviewResult();
        }
      }, 700);
    });
  });
}

function renderDailyReviewResult() {
  markDailyReviewDone();
  const scoreText =
    dailyReviewCorrect === dailyReviewTotalQuestions
      ? `一次就全部答对！(${dailyReviewCorrect} / ${dailyReviewTotalQuestions} 题)`
      : `首次答对 ${dailyReviewCorrect} / ${dailyReviewTotalQuestions} 题，订正后全部掌握了`;
  root.innerHTML = `
    <div class="landing-eyebrow">今日复习</div>
    <p class="quiz-score">${scoreText}</p>
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
  const loggedInUser = window.cloudProgressReady ? await window.cloudProgressReady : null;
  const isLoggedIn = !!loggedInUser;

  // 侧栏"📝 复习"是用户主动点的，即使今天已经复习过、或者本来还没到弹出的时候，
  // 只要还有可复习的内容就直接进题，不用再经过"复习/继续学"这一步选择。
  const wantsReview = new URLSearchParams(location.search).get("review") === "1";
  // 这四条赛道只要有任意一条真的解锁到第1关以后，就说明是老用户——不管登没登录
  // （没登录也可能是本地存档、或者用导入进度码恢复的）。之前的逻辑只给"登录+今天
  // 该复习"这一种情况开快速通道，老用户如果今天已经复习过、或者压根没有可复习的
  // 内容（比如刚导入进度码，还没登录去同步），就会被扔回"先做水平测试"的新手
  // 流程——对一个已经有进度的人来说很不合理。这里改成主动检测"有没有真实进度"，
  // 有就给一个"继续学/重新测试"的选择页（不是静默跳转，还是要用户自己点）。
  const hasResumableProgress = !!(
    getResumePoint("course", COURSE_LEVEL_COUNT) ||
    getResumePoint("assessment", ASSESSMENT_LEVEL_COUNT) ||
    getResumePoint("advanced", ADVANCED_LEVEL_COUNT) ||
    getResumePoint("debug", DEBUG_LEVEL_COUNT)
  );

  if (wantsReview && getEligibleReviewPool().length > 0) {
    buildDailyReviewQuiz();
    renderDailyReviewQuestion();
  } else if (isLoggedIn && shouldShowDailyReview()) {
    renderDailyReview();
  } else if (hasResumableProgress) {
    renderWelcomeBack();
  } else {
    renderIntro();
  }
}

// progress-sync.js 点"退出登录"之后会调用这个钩子。首页把"复习/继续学"选择页
// 跟登录状态绑在一起，退出登录了就该退回水平测试，不能让选择页停在原地不动。
// 直接跳 renderIntro()，不重新走 initQuizPage()——window.cloudProgressReady 是
// 页面一开始就算好、缓存住的Promise，重新await只会拿到登录前的旧结果。
window.onAccountLoggedOut = () => {
  renderIntro();
};

initQuizPage();
