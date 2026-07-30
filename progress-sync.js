// 进度同步：两种方式。
// 1) 导出/导入进度码——纯本地，把localStorage打包成一段文字，手动复制粘贴。
// 2) 账号同步——用户名随便起、密码随便设（不需要真实邮箱/姓名），登录后自动同步到云端。
//    用的是 Supabase（开源后台服务），账号信息只有"用户名+密码"，密码由Supabase安全托管，
//    我们不会存储、也看不到明文密码。

const PROGRESS_SYNC_PREFIXES = ["codecourse_", "aigames_"];
const isProgressKey = (k) => PROGRESS_SYNC_PREFIXES.some((p) => k.startsWith(p));
const SUPABASE_URL = "https://gitdlqnkwtblhplrphsv.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpdGRscW5rd3RibGhwbHJwaHN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM0NzIwNTIsImV4cCI6MjA5OTA0ODA1Mn0.Hv-Q5geUc5-f-UvEtigAl2684JrLMdxrYCPs_MRnfc8";
const FAKE_EMAIL_DOMAIN = "mayaa-users.app";

const supabaseClient = window.supabase
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

// 每天一条访问记录，纯粹为了在后台看"今天有多少人来过"这一个数字。游客
// （没登录）插入的是一个空行（只有数据库自动生成的时间戳），不记录IP、
// User-Agent、页面路径或者任何能定位到具体是谁的信息。已登录的用户会
// 附带自己的user_id——这不算新增隐私信息，用户名本来注册的时候就收集过了，
// 只是让站长能在后台看到"这个已注册用户名今天来过"，不涉及游客。用
// localStorage记"今天是否已经记过一次"来去重——不然同一个人在几个学习
// 页面之间跳来跳去，会被算成好几次访问。跟reportStuck()一样是纯写入、
// 不开放查询权限的表，读取只能通过admin_stats()/admin_user_list()这些
// 只对站长开放的函数。
//
// 放在文件最下面调用（而不是定义完立刻调用）是因为要用到 window.cloudProgressReady，
// 这个全局Promise要等这个文件后面的代码跑到才会赋值。
const VISIT_LOGGED_KEY = "codecourse_visit_logged_day";

async function logVisitOncePerDay() {
  if (!supabaseClient) return;
  const today = new Date().toDateString();
  if (localStorage.getItem(VISIT_LOGGED_KEY) === today) return;
  try {
    const user = window.cloudProgressReady ? await window.cloudProgressReady : null;
    const row = user ? { user_id: user.id } : {};
    const { error } = await supabaseClient.from("page_visits").insert(row);
    if (error) return;
    localStorage.setItem(VISIT_LOGGED_KEY, today);
  } catch (e) {
    // 表还没建、网络问题等——静默失败，不影响主流程。
  }
}

// ---------- 本地导出/导入进度码 ----------

function exportProgressCode() {
  const data = {};
  Object.keys(localStorage).forEach((k) => {
    if (isProgressKey(k)) {
      data[k] = localStorage.getItem(k);
    }
  });
  const json = JSON.stringify(data);
  return btoa(unescape(encodeURIComponent(json)));
}

function importProgressCode(code) {
  const json = decodeURIComponent(escape(atob(code.trim())));
  const data = JSON.parse(json);
  const keys = Object.keys(data);
  if (keys.length === 0) throw new Error("empty");
  keys.forEach((k) => {
    if (isProgressKey(k)) {
      localStorage.setItem(k, data[k]);
    }
  });
  return keys.length;
}

// 只解码、不写入本地——给"跟朋友比一比进度"用，看一眼朋友的进度码里有什么，
// 不能真的导入（导入会覆盖掉自己的进度）。
function decodeProgressCode(code) {
  const json = decodeURIComponent(escape(atob(code.trim())));
  const data = JSON.parse(json);
  if (Object.keys(data).length === 0) throw new Error("empty");
  return data;
}

// ---------- 账号同步 ----------

function usernameToEmail(username) {
  return `${username.trim().toLowerCase()}@${FAKE_EMAIL_DOMAIN}`;
}

function gatherLocalData() {
  const data = {};
  Object.keys(localStorage).forEach((k) => {
    if (isProgressKey(k)) {
      data[k] = localStorage.getItem(k);
    }
  });
  return data;
}

function restoreLocalData(data) {
  Object.keys(data).forEach((k) => {
    if (isProgressKey(k)) {
      localStorage.setItem(k, data[k]);
    }
  });
}

// 清掉本机所有跟进度相关的本地存档（不动 daily_review_date 之外的其他本地设置）。
// 只在"确定要切换成另一个身份"的时候调用——明确登录一个账号之前，先把本机可能
// 属于上一个账号（或者匿名试用留下）的旧进度清干净，不然两边的key会混在一起：
// 比如共享电脑上A做了初级到第6关，退出后B登录，B从没做过初级，但本机还留着
// "初级解锁到第6关"这条数据，B一旦触发自动同步，就会把A的进度当成自己的推上云端。
function clearLocalProgressData() {
  Object.keys(localStorage).forEach((k) => {
    if (isProgressKey(k)) {
      localStorage.removeItem(k);
    }
  });
  // "今天复习过了没"这个标记不走 codecourse_/aigames_ 前缀（定义在 quiz-app.js 里），
  // 但它也是跟身份绑定的本地状态，同一个道理，换账号时也得跟着清掉，不然会出现
  // "A今天复习过了，B登录同一台设备当天就不会再被提示复习"这种串号。
  localStorage.removeItem("daily_review_date");
}

// 记一下"本机现在这份本地数据，上一次是跟哪个账号同步过的"——登录时用来区分
// "真的换了个人"和"还是自己，只是session不知道为什么过期了、重新登录一次"，
// 这两种情况该不该清本地是不一样的（见下面 pullProgressFromCloud 的注释）。
const SYNCED_USER_ID_KEY = "codecourse_synced_user_id";
// 之前"已同步到云端"只在account-message那行提示文字里一闪而过，账号面板
// 本身（account-status那一行）从来没显示过"到底同步没同步、上次是什么时候"，
// 面板收起来之后这个信息就彻底没了，容易让人怀疑"到底存上没有"。这次把
// 上次同步时间记下来，跟"已登录：xxx"一起常驻显示，不再只靠一条会消失的提示。
const LAST_SYNCED_AT_KEY = "codecourse_last_synced_at";

function formatSyncedTime(ts) {
  if (!ts) return null;
  const d = new Date(Number(ts));
  if (Number.isNaN(d.getTime())) return null;
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

// username不用重新查——account-avatar-label这个头像标签已经是登录状态下的
// 用户名了（showLoggedInUI设置的），复用它，不用为了刷新一下同步时间
// 就多打一次Supabase的API请求。
function updateAccountStatusText() {
  const el = document.getElementById("account-status");
  const label = document.getElementById("account-avatar-label");
  if (!el || !label || !label.textContent) return;
  const synced = formatSyncedTime(localStorage.getItem(LAST_SYNCED_AT_KEY));
  el.textContent = synced ? `已登录：${label.textContent} · 上次同步 ${synced}` : `已登录：${label.textContent} · 还没同步过`;
}

async function pushProgressToCloud(userId) {
  const local = gatherLocalData();
  const { data: existing, error: selectError } = await supabaseClient
    .from("progress")
    .select("data")
    .eq("user_id", userId)
    .maybeSingle();
  if (selectError) throw selectError;
  const merged = Object.assign({}, (existing && existing.data) || {}, local);
  const { error: upsertError } = await supabaseClient
    .from("progress")
    .upsert({ user_id: userId, data: merged, updated_at: new Date().toISOString() });
  // 之前这两次请求的error都没检查——upsert失败（网络问题/RLS配置问题等）时
  // 代码会假装推送成功一样往下走，照样把SYNCED_USER_ID_KEY标记成"已同步"。
  // 这个函数被pullProgressFromCloud用来"先把本地兜底推一次，再放心用云端数据
  // 覆盖本地"，如果这次推送其实失败了却被当成成功，紧接着的覆盖操作就会用
  // （不包含刚才这次推送内容的）旧云端数据，把本地这些永远没推成功的改动
  // 直接冲掉——所以这里必须让错误真的抛出去，调用方才能知道不能贸然覆盖本地。
  if (upsertError) throw upsertError;
  localStorage.setItem(SYNCED_USER_ID_KEY, userId);
  localStorage.setItem(LAST_SYNCED_AT_KEY, Date.now().toString());
  updateAccountStatusText();
  // 顺带把排行榜分数也更新一下——不额外新增同步时机，复用这个已有的"进度推上云端"
  // 节点（每过一关自动同步、退出登录前兜底同步、手动点立即同步、注册时同步，
  // 都会走到这里）。排行榜表是独立的、只读公开的一张表，跟这里的 progress
  // 私有表分开，见 pushLeaderboardScore 的注释。
  await pushLeaderboardScore(userId);
}

// 排行榜用的表（leaderboard）是新建的，跟存完整进度的 progress 表分开——
// progress 里存的是每一关写的代码原文，不适合整体公开；排行榜只暴露"用户名 +
// 总通关数"这一点点必要信息。这张表可能还没建（要用户自己去Supabase后台跑一次
// SQL），所以这里全程 try/catch，写失败/表不存在都只是静默跳过，不能因为
// 排行榜这个附加功能失败就把主流程的进度同步也搞挂了。
const LEADERBOARD_TRACKS = [
  { id: "course", count: 12 },
  { id: "assessment", count: 6 },
  { id: "advanced", count: 6 },
  { id: "debug", count: 8 },
];

function computeTotalLevelsPassed() {
  let total = 0;
  LEADERBOARD_TRACKS.forEach((t) => {
    const raw = localStorage.getItem(`codecourse_${t.id}_v2_unlocked`);
    const unlocked = raw ? parseInt(raw, 10) : 1;
    total += Math.min(Math.max(unlocked - 1, 0), t.count);
  });
  return total;
}

async function pushLeaderboardScore(userId) {
  try {
    const { data: userData } = await supabaseClient.auth.getUser();
    if (!userData || !userData.user) return;
    const username = userData.user.email.replace("@" + FAKE_EMAIL_DOMAIN, "");
    const totalLevels = computeTotalLevelsPassed();
    await supabaseClient.from("leaderboard").upsert({
      user_id: userId,
      username,
      total_levels: totalLevels,
      updated_at: new Date().toISOString(),
    });
  } catch (e) {
    // 表还没建、网络问题等——排行榜是附加功能，静默失败，不影响主流程。
  }
}

// "这道题我还是不懂"反馈——跟排行榜同样的道理，独立的一张表(stuck_reports)，
// 不需要登录也能提交（不登录的访客卡住了这个信号一样有价值，不能只收集
// 登录用户的）。写失败/表还没建都静默跳过，不能因为这个附加功能拖累主流程。
// 返回true/false给调用方决定要不要展示"已收到反馈"之类的提示。
async function reportStuck(track, levelId, variantIndex) {
  if (!supabaseClient) return false;
  try {
    const { error } = await supabaseClient.from("stuck_reports").insert({
      track,
      level_id: levelId,
      variant_index: variantIndex === undefined || variantIndex === null || Number.isNaN(variantIndex) ? null : variantIndex,
    });
    if (error) return false;
    return true;
  } catch (e) {
    return false;
  }
}

// clearFirst=true 表示这是一次"登录"操作，理论上可能是切换身份，要避免跟上一个
// 账号/匿名试用留下的本地数据混在一起。但登录表单弹出来，不代表一定是"换了个人"——
// 也可能就是同一个人，只是session过期了、重新输一遍自己的密码而已。这两种情况
// 不能一视同仁地"清本地"：真换人的话必须清，不然会把上一个人的数据当成自己的
// 推上云端；但如果就是自己，本地可能还有没来得及同步的改动（比如正在写、还没
// 通关的代码），直接清空就永久丢了——这正是之前"退出登录再登录代码丢了"那个bug
// 的另一个入口，只是这次不是从"退出登录"进来的，是从"session自己过期"进来的。
//
// 区分方法：看本机记的"上一次跟谁同步过"（SYNCED_USER_ID_KEY）是不是就是这次
// 登录的这个账号——是的话，大概率就是同一个人，先把本地兜底推一次再覆盖，不
// 做破坏性清空；不是（或者从来没记录过，比如这台设备第一次用）才真的清空。
//
// 留空/false 是页面打开时被动检测已登录状态的例行拉取（cloudProgressReady），
// 这种情况不清本地也不用做身份判断——如果这台设备上一次的关卡完成还没来得及
// 异步推上云端（autoSaveToCloud没await，有极小概率的race），例行拉取时先清本地
// 再等云端数据，反而可能把刚拿到的进度清没了。
async function pullProgressFromCloud(userId, clearFirst) {
  let shouldClearStaleIdentity = false;
  if (clearFirst) {
    const lastSyncedUserId = localStorage.getItem(SYNCED_USER_ID_KEY);
    if (lastSyncedUserId === userId) {
      await pushProgressToCloud(userId);
    } else {
      // 之前这里是直接调用clearLocalProgressData()，也就是先清本地、再去
      // 拉云端数据。如果紧接着这次拉取失败（网络问题），本地已经被清空、
      // 云端数据又没能拉回来，用户会两头落空——比登录之前还惨。现在把"清"
      // 这个动作挪到拉取成功、确认拿到数据之后再做（见下面），这里只记一下
      // "待会儿要清"，真正清空推迟到网络请求已经成功返回之后。
      shouldClearStaleIdentity = true;
    }
  }

  const { data: existing, error } = await supabaseClient
    .from("progress")
    .select("data")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  if (shouldClearStaleIdentity) {
    clearLocalProgressData();
  }
  if (existing && existing.data) {
    restoreLocalData(existing.data);
  }
  localStorage.setItem(SYNCED_USER_ID_KEY, userId);
}

// 页面一打开就检查是不是已经登录过（Supabase的登录状态本身是持久化在浏览器里的），
// 是的话把云端的真实进度拉下来覆盖到localStorage，这样已经登录过的设备/浏览器换一个
// 学习页面直接打开，看到的也是最新进度，不用非得先去首页或者重新点一次登录才会同步。
// 存成一个全局Promise，好让 app.js / quiz-app.js 在真正要用进度数据之前 await 它；
// resolve出来的是当前登录用户对象（没登录是null），首页用它判断要不要跳过测试，
// refreshAccountUI() 也直接复用这个结果，不用自己再查一次登录状态。
window.cloudProgressReady = (async () => {
  if (!supabaseClient) return null;
  try {
    const { data } = await supabaseClient.auth.getUser();
    if (data && data.user) {
      await pullProgressFromCloud(data.user.id);
      return data.user;
    }
  } catch (e) {
    // 拉取失败就用本地缓存，不阻塞页面
  }
  return null;
})();

function setAccountMessage(text, isError) {
  const box = document.getElementById("account-message");
  if (!box) return;
  box.textContent = text;
  box.className = "account-message" + (isError ? " error" : "");
}

// 侧栏的账号面板不是每个页面都有（比如首页的水平测试页就没有），
// 这些函数在对应元素不存在时安全地什么都不做。
function showLoggedInUI(email) {
  const out = document.getElementById("account-logged-out");
  const inn = document.getElementById("account-logged-in");
  if (!out || !inn) return;
  out.classList.add("hidden");
  inn.classList.remove("hidden");
  const username = email.replace("@" + FAKE_EMAIL_DOMAIN, "");

  const avatar = document.getElementById("account-avatar");
  const label = document.getElementById("account-avatar-label");
  if (avatar) {
    avatar.textContent = username.slice(0, 1).toUpperCase();
    avatar.classList.add("logged-in");
  }
  if (label) label.textContent = username;
  // 头像标签(label)必须先设置好，updateAccountStatusText()是从这里读用户名的。
  updateAccountStatusText();
}

function showLoggedOutUI() {
  const out = document.getElementById("account-logged-out");
  const inn = document.getElementById("account-logged-in");
  if (!out || !inn) return;
  out.classList.remove("hidden");
  inn.classList.add("hidden");

  // 退出登录之后头像和面板都退回未登录状态，登录表单还开着，
  // 可以直接输入另一个账号的用户名密码登录——这就是"换个账号"的路径。
  const avatar = document.getElementById("account-avatar");
  const label = document.getElementById("account-avatar-label");
  if (avatar) {
    avatar.textContent = "👤";
    avatar.classList.remove("logged-in");
  }
  if (label) label.textContent = "登录 / 注册";
}

async function refreshAccountUI() {
  if (!document.getElementById("account-logged-out")) return;
  // 头像标签默认是空的（避免一进页面先闪一下"登录/注册"，等真的确认没登录
  // 才显示，见showLoggedOutUI()）——所以这里即使supabaseClient不可用
  // （比如Supabase的CDN没加载成功），也必须兜底调一次showLoggedOutUI()，
  // 不然标签会一直空着，用户搞不清这个按钮是干什么的。
  if (!supabaseClient) {
    showLoggedOutUI();
    return;
  }
  // 复用 cloudProgressReady 已经查过的登录状态，不用自己再调一次 auth.getUser()。
  const user = window.cloudProgressReady ? await window.cloudProgressReady : null;
  if (user) {
    showLoggedInUI(user.email);
  } else {
    showLoggedOutUI();
  }
}

function setupAccountUI() {
  const toggleBtn = document.getElementById("account-toggle-btn");
  const panel = document.getElementById("account-panel");
  if (toggleBtn && panel) {
    toggleBtn.addEventListener("click", () => panel.classList.toggle("hidden"));
  }
  if (!supabaseClient || !document.getElementById("account-signup-btn")) return;

  const usernameInput = document.getElementById("account-username");
  const passwordInput = document.getElementById("account-password");

  // 注册/登录按钮点了之后先禁用，等这次请求真正结束（不管成功失败）才恢复能点——
  // 不禁用的话，网络慢的时候手抖多点几下，会同时发出好几个signUp/signInWithPassword
  // 请求，谁先谁后回来不确定，容易出奇怪的状态。
  document.getElementById("account-signup-btn").addEventListener("click", async () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    if (!username || password.length < 6) {
      setAccountMessage("用户名不能为空，密码至少6位。", true);
      return;
    }
    const btn = document.getElementById("account-signup-btn");
    btn.disabled = true;
    setAccountMessage("注册中...");
    try {
      const { data, error } = await supabaseClient.auth.signUp({
        email: usernameToEmail(username),
        password,
      });
      if (error) {
        setAccountMessage("注册失败：" + (error.message.includes("already") ? "这个用户名已经被用过了，换一个或者直接登录。" : error.message), true);
        return;
      }
      await pushProgressToCloud(data.user.id);
      setAccountMessage("注册成功，已经把当前进度同步上去了！");
      showLoggedInUI(data.user.email);
    } catch (e) {
      // pushProgressToCloud现在网络/写入失败会真的抛出异常（之前是静默忽略、
      // 假装成功）——账号本身已经注册成功了，只是进度同步没推上去，如实告知，
      // 不能让用户以为进度已经保住了。
      setAccountMessage("账号注册成功，但进度同步失败（可能是网络问题），稍后可以点'立即同步'再试一次。", true);
    } finally {
      btn.disabled = false;
    }
  });

  document.getElementById("account-login-btn").addEventListener("click", async () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    if (!username || !password) {
      setAccountMessage("请输入用户名和密码。", true);
      return;
    }
    const btn = document.getElementById("account-login-btn");
    btn.disabled = true;
    setAccountMessage("登录中...");
    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: usernameToEmail(username),
        password,
      });
      if (error) {
        setAccountMessage("登录失败：用户名或密码不对。", true);
        return;
      }
      await pullProgressFromCloud(data.user.id, true);
      // 登录会把本地进度换成云端的，页面上正在显示的关卡/题目状态可能已经跟
      // 换过的数据对不上了，最简单可靠的办法就是刷新整个页面重新走一遍初始化。
      // 这里不再额外弹alert()——inline的提示文字已经说清楚了，弹窗只是多此一举，
      // 而且刷新前用户根本来不及看，之前那个alert反而挡住了下面这行文字。
      setAccountMessage("登录成功，进度已经恢复，页面即将刷新...");
      setTimeout(() => location.reload(), 600);
    } catch (e) {
      // pullProgressFromCloud内部"先补推本地、再拉云端覆盖本地"这一步失败时
      // 现在会真的抛出异常（保护措施：宁可不覆盖本地，也不能用可能不完整的
      // 云端数据冲掉本地还没推上去的改动）。这里必须如实告知，不能刷新页面——
      // 刷新会用本地当前（其实没被覆盖成功）的数据重新渲染，跟提示语对不上。
      setAccountMessage("登录成功，但进度同步失败（可能是网络问题），本地进度先保留，请检查网络后点'立即同步'重试。", true);
    } finally {
      btn.disabled = false;
    }
  });

  document.getElementById("account-sync-btn").addEventListener("click", async () => {
    const { data } = await supabaseClient.auth.getUser();
    if (!data || !data.user) return;
    const btn = document.getElementById("account-sync-btn");
    btn.disabled = true;
    setAccountMessage("同步中...");
    try {
      await pushProgressToCloud(data.user.id);
      setAccountMessage("已同步到云端。");
    } catch (e) {
      // pushProgressToCloud现在失败会真的抛出异常，这里之前完全没有
      // try/catch，失败时按钮会一直停在"同步中..."，还留下一个未处理的
      // promise rejection，用户看不出到底发生了什么。
      setAccountMessage("同步失败，可能是网络问题，稍后再试一次。", true);
    } finally {
      btn.disabled = false;
    }
  });

  document.getElementById("account-logout-btn").addEventListener("click", async () => {
    // 退出登录前先补一次同步——自动同步只在"通关某一关"那一刻触发，
    // 还没通关、正在写的代码，或者刚通关但那次自动同步还没跑完，都只存在本地。
    // 下次重新登录会先清本地再拉云端数据，这次没同步上去的东西就再也找不回来了，
    // 所以退出前得先补一次推送，把本地当前的状态兜底存一遍。
    setAccountMessage("退出中...");
    try {
      const { data } = await supabaseClient.auth.getUser();
      if (data && data.user) await pushProgressToCloud(data.user.id);
    } catch (e) {
      // 同步失败（比如网络问题）也不能卡住退出登录，只能接受这次退出可能丢失
      // 未同步的本地改动——跟直接断网关闭浏览器的效果一样，不是这次改动能解决的。
    }
    await supabaseClient.auth.signOut();
    // 退出登录不该只是界面上显示"未登录"——本地localStorage里还留着刚才这个账号
    // 的关卡进度，不清掉的话，共享电脑上退出登录之后随便一个人不登录直接玩，
    // 看到的还是上一个人的进度，等于退出登录形同虚设。云端数据不会丢
    // （前面已经补推过一次），下次重新登录同一个账号会再从云端拉回来。
    clearLocalProgressData();
    localStorage.removeItem(SYNCED_USER_ID_KEY);
    showLoggedOutUI();
    setAccountMessage("");
    // 首页把"是否显示复习/继续学选择页"跟登录状态绑在一起，退出登录之后光改头像
    // 不够，得让首页重新判断一次该显示哪个screen（退回水平测试）。学习页面
    // （course.html等）没有定义这个钩子，退出登录不影响关卡内容，什么都不做。
    if (typeof window.onAccountLoggedOut === "function") window.onAccountLoggedOut();
  });

  refreshAccountUI();
}

function setupProgressSyncButtons() {
  const exportBtn = document.getElementById("export-progress-btn");
  const importBtn = document.getElementById("import-progress-btn");

  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      const code = exportProgressCode();
      prompt("复制这段码，到其他设备/浏览器上点'导入进度码'粘贴，就能恢复你的学习进度：", code);
    });
  }

  if (importBtn) {
    importBtn.addEventListener("click", () => {
      const code = prompt("把之前导出的进度码完整粘贴到这里：");
      if (!code) return;
      try {
        const count = importProgressCode(code);
        alert(`导入成功！恢复了 ${count} 项记录，点确定后会刷新页面。`);
        location.reload();
      } catch (e) {
        alert("导入失败：这段码看起来不完整或者不对，检查一下有没有复制全。");
      }
    });
  }

  setupAccountUI();
}

setupProgressSyncButtons();

// ---------- 连续学习天数 ----------
// 每天第一次打开网站（任意页面都算，不要求真的通关一关）就记一次"打卡"。
// 存"当天本地零点"的时间戳而不是格式化字符串，是为了后面能直接做数字减法算
// 天数差，不用再把字符串解析回Date对象（不同浏览器解析非标准日期字符串的
// 行为不完全一致，容易出隐藏bug）。

const STREAK_COUNT_KEY = "codecourse_streak_count";
const STREAK_LAST_KEY = "codecourse_streak_last_midnight";

function localMidnight(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

async function bumpStreakAndRender() {
  // 这两个key带 codecourse_ 前缀，会被登录同步/云端拉取一起打包处理（这样换设备
  // 也能接着连续记录，账号切换时也会正确清掉换成新账号自己的）。但也正因为这样，
  // 必须先等 cloudProgressReady 拉完云端数据，再读本地、算今天要不要+1——不然
  // 这里先同步地把本地存档改了，云端数据晚一步拉下来时会把刚改的这次悄悄覆盖掉，
  // 不仅今天白打卡，连带明天算"是否连续"用的时间戳也变成了旧的，可能把真实的
  // 连续记录也错误地打断。
  // 顺带拿到登录状态：打卡计数不管有没有登录都照常记（这样哪天真的注册了，
  // 之前本地攒的连续天数不会归零），但徽章展示只给登录用户看——没有账号的
  // 访客看到"连续学习"没有意义，这条记录只存在这台设备上，换个人打开也会
  // 看到同样的数字，容易让人误以为这是"网站认出了你"，其实不是。
  const user = window.cloudProgressReady ? await window.cloudProgressReady : null;

  const todayMidnight = localMidnight(new Date());
  const lastMidnight = parseInt(localStorage.getItem(STREAK_LAST_KEY) || "0", 10);

  if (lastMidnight !== todayMidnight) {
    const lastCount = parseInt(localStorage.getItem(STREAK_COUNT_KEY) || "0", 10);
    const gapDays = lastMidnight ? Math.round((todayMidnight - lastMidnight) / 86400000) : null;
    const newCount = gapDays === 1 ? lastCount + 1 : 1; // 隔了不止一天，连续记录断了，重新从1开始
    localStorage.setItem(STREAK_COUNT_KEY, String(newCount));
    localStorage.setItem(STREAK_LAST_KEY, String(todayMidnight));
  }

  if (!user) return;

  const count = parseInt(localStorage.getItem(STREAK_COUNT_KEY) || "0", 10);
  const badge = document.getElementById("streak-badge");
  // count>1才显示——第一次打开网站，什么都还没做，就弹出"连续学习1天"，
  // 这个"连续"没有意义（谁都是从1开始），显得像是白送的虚假成就感。
  // 真的连续两天以上才值得亮出来。
  if (badge && count > 1) {
    badge.textContent = `🔥 连续学习 ${count} 天`;
    badge.classList.remove("hidden");
  }
}

bumpStreakAndRender();
logVisitOncePerDay();
