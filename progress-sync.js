// 进度同步：两种方式。
// 1) 导出/导入进度码——纯本地，把localStorage打包成一段文字，手动复制粘贴。
// 2) 账号同步——用户名随便起、密码随便设（不需要真实邮箱/姓名），登录后自动同步到云端。
//    用的是 Supabase（开源后台服务），账号信息只有"用户名+密码"，密码由Supabase安全托管，
//    我们不会存储、也看不到明文密码。

const PROGRESS_SYNC_PREFIXES = ["codecourse_", "aigames_"];
const SUPABASE_URL = "https://gitdlqnkwtblhplrphsv.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpdGRscW5rd3RibGhwbHJwaHN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM0NzIwNTIsImV4cCI6MjA5OTA0ODA1Mn0.Hv-Q5geUc5-f-UvEtigAl2684JrLMdxrYCPs_MRnfc8";
const FAKE_EMAIL_DOMAIN = "mayaa-users.app";

const supabaseClient = window.supabase
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

// ---------- 本地导出/导入进度码 ----------

function exportProgressCode() {
  const data = {};
  Object.keys(localStorage).forEach((k) => {
    if (PROGRESS_SYNC_PREFIXES.some((p) => k.startsWith(p))) {
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
    if (PROGRESS_SYNC_PREFIXES.some((p) => k.startsWith(p))) {
      localStorage.setItem(k, data[k]);
    }
  });
  return keys.length;
}

// ---------- 账号同步 ----------

function usernameToEmail(username) {
  return `${username.trim().toLowerCase()}@${FAKE_EMAIL_DOMAIN}`;
}

function gatherLocalData() {
  const data = {};
  Object.keys(localStorage).forEach((k) => {
    if (PROGRESS_SYNC_PREFIXES.some((p) => k.startsWith(p))) {
      data[k] = localStorage.getItem(k);
    }
  });
  return data;
}

function restoreLocalData(data) {
  Object.keys(data).forEach((k) => {
    if (PROGRESS_SYNC_PREFIXES.some((p) => k.startsWith(p))) {
      localStorage.setItem(k, data[k]);
    }
  });
}

async function pushProgressToCloud(userId) {
  const local = gatherLocalData();
  const { data: existing } = await supabaseClient
    .from("progress")
    .select("data")
    .eq("user_id", userId)
    .maybeSingle();
  const merged = Object.assign({}, (existing && existing.data) || {}, local);
  await supabaseClient
    .from("progress")
    .upsert({ user_id: userId, data: merged, updated_at: new Date().toISOString() });
}

async function pullProgressFromCloud(userId) {
  const { data: existing } = await supabaseClient
    .from("progress")
    .select("data")
    .eq("user_id", userId)
    .maybeSingle();
  if (existing && existing.data) {
    restoreLocalData(existing.data);
  }
}

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
  document.getElementById("account-status").textContent =
    "已登录：" + email.replace("@" + FAKE_EMAIL_DOMAIN, "");
}

function showLoggedOutUI() {
  const out = document.getElementById("account-logged-out");
  const inn = document.getElementById("account-logged-in");
  if (!out || !inn) return;
  out.classList.remove("hidden");
  inn.classList.add("hidden");
}

async function refreshAccountUI() {
  if (!supabaseClient || !document.getElementById("account-logged-out")) return;
  const { data } = await supabaseClient.auth.getUser();
  if (data && data.user) {
    showLoggedInUI(data.user.email);
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

  document.getElementById("account-signup-btn").addEventListener("click", async () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    if (!username || password.length < 6) {
      setAccountMessage("用户名不能为空，密码至少6位。", true);
      return;
    }
    setAccountMessage("注册中...");
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
  });

  document.getElementById("account-login-btn").addEventListener("click", async () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    if (!username || !password) {
      setAccountMessage("请输入用户名和密码。", true);
      return;
    }
    setAccountMessage("登录中...");
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: usernameToEmail(username),
      password,
    });
    if (error) {
      setAccountMessage("登录失败：用户名或密码不对。", true);
      return;
    }
    await pullProgressFromCloud(data.user.id);
    setAccountMessage("登录成功，进度已经恢复！点确定后会刷新页面。");
    alert("登录成功！点确定刷新页面查看恢复的进度。");
    location.reload();
  });

  document.getElementById("account-sync-btn").addEventListener("click", async () => {
    const { data } = await supabaseClient.auth.getUser();
    if (!data || !data.user) return;
    setAccountMessage("同步中...");
    await pushProgressToCloud(data.user.id);
    setAccountMessage("已同步到云端。");
  });

  document.getElementById("account-logout-btn").addEventListener("click", async () => {
    await supabaseClient.auth.signOut();
    showLoggedOutUI();
    setAccountMessage("");
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
