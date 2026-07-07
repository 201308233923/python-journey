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

// 只读一下有没有"真正解锁到第1关以后"的存档，不需要加载 course/assessment 的关卡数据。
function getResumePoint(track, totalLevels) {
  const raw = localStorage.getItem(`codecourse_${track}_v2_unlocked`);
  const unlocked = raw ? parseInt(raw, 10) : 1;
  if (!unlocked || unlocked <= 1) return null;
  return Math.min(unlocked, totalLevels);
}

function renderIntro() {
  const courseResume = getResumePoint("course", COURSE_LEVEL_COUNT);
  const assessmentResume = getResumePoint("assessment", ASSESSMENT_LEVEL_COUNT);

  let continueHtml = "";
  if (courseResume || assessmentResume) {
    const cards = [];
    if (courseResume) {
      cards.push(`
        <a class="continue-card" href="course.html?resume=${courseResume}">
          <span class="continue-label">🌱 新手课程</span>
          <span class="continue-detail">继续第${courseResume}关 →</span>
        </a>`);
    }
    if (assessmentResume) {
      cards.push(`
        <a class="continue-card" href="assessment.html?resume=${assessmentResume}">
          <span class="continue-label">⚡ 进阶测试</span>
          <span class="continue-detail">继续第${assessmentResume}题 →</span>
        </a>`);
    }
    continueHtml = `
      <div class="continue-banner">
        <div class="landing-eyebrow">欢迎回来</div>
        <div class="continue-row">${cards.join("")}</div>
      </div>
      <p class="quiz-divider">或者重新测一次水平：</p>
    `;
  }

  root.innerHTML = `
    ${continueHtml}
    <div class="landing-eyebrow">水平测试</div>
    <h1>先做几道小题，看看你现在的水平</h1>
    <p class="landing-lede">题库里有${QUIZ.length}道题，每次随机抽${QUESTIONS_PER_QUIZ}道，大概2分钟，题目和选项顺序每次都不一样。做完之后，会帮你推荐一个正好适合你的起点。</p>
    <button class="quiz-btn-primary" id="start-quiz-btn">开始测试</button>
    <p class="quiz-skip">不想测？<a href="course.html">直接当新手学</a> · <a href="assessment.html">直接做进阶测试</a></p>
  `;
  document.getElementById("start-quiz-btn").addEventListener("click", () => {
    sessionQuiz = shuffle(QUIZ).slice(0, QUESTIONS_PER_QUIZ).map(shuffleQuestion);
    currentQ = 0;
    wrongTargets = [];
    renderQuestion();
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

function renderResult() {
  if (wrongTargets.length === 0) {
    root.innerHTML = `
      <div class="landing-eyebrow">测试结果</div>
      <h1>你的基础已经很扎实了</h1>
      <p class="landing-lede">全部答对！建议跳过新手课程，直接挑战进阶测试题。</p>
      <a class="quiz-btn-primary" href="assessment.html">去做进阶测试 →</a>
    `;
  } else {
    // 取所有答错题目里，对应关卡最靠前的一个——不管题目出现的顺序是什么，
    // 都能定位到"最早不会的概念"。
    const level = Math.min(...wrongTargets);
    root.innerHTML = `
      <div class="landing-eyebrow">测试结果</div>
      <h1>建议你从第${level}关开始</h1>
      <p class="landing-lede">前面的内容你已经掌握了，从这一关开始正好是你需要巩固的地方。左边的关卡列表里，之前的关卡也会帮你标记好。</p>
      <a class="quiz-btn-primary" href="course.html?start=${level}">开始学习 →</a>
    `;
  }
}

renderIntro();
