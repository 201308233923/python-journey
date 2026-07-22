// 站长专用的数据统计页——不在任何侧栏里放入口，真正的保护也不是靠"链接藏起来"，
// 而是数据库那边几个 admin_* 函数都只认站长自己的账号（见 progress-sync.js 里
// SUPABASE_URL 对应项目的 SQL：函数内部校验 auth.uid() 是不是站长的 user_id，
// 不是的话直接报错，不返回任何数据）。这个页面只是把这几个 RPC 返回的数据画出来，
// 不直接读任何一张原始数据表（包括 admin_user_list() 返回的用户名单，也是走
// 这同一套server端owner校验，不是前端自己拼查询）。

function escapeHtml(s) {
  const div = document.createElement("div");
  div.textContent = s;
  return div.innerHTML;
}

function renderChart(signupsByDay) {
  if (!signupsByDay || signupsByDay.length === 0) {
    return `<p class="admin-chart-empty">最近30天还没有新注册。</p>`;
  }
  const max = Math.max(...signupsByDay.map((d) => d.count));
  const bars = signupsByDay
    .map((d) => {
      const pct = max > 0 ? Math.max((d.count / max) * 100, 4) : 4;
      return `<div class="admin-chart-bar" style="height:${pct}%" title="${escapeHtml(d.day)}：${d.count} 人">
        <span class="admin-chart-bar-value">${d.count}</span>
      </div>`;
    })
    .join("");
  const firstDay = escapeHtml(signupsByDay[0].day);
  const lastDay = escapeHtml(signupsByDay[signupsByDay.length - 1].day);
  return `
    <div class="admin-chart-bars">${bars}</div>
    <div class="admin-chart-axis"><span>${firstDay}</span><span>${lastDay}</span></div>
  `;
}

function renderStats(stats) {
  return `
    <div class="admin-stats-grid">
      <div class="admin-stat-card">
        <div class="admin-stat-value">${stats.total_users}</div>
        <div class="admin-stat-label">总注册人数</div>
      </div>
      <div class="admin-stat-card">
        <div class="admin-stat-value">${stats.total_synced_users}</div>
        <div class="admin-stat-label">同步过进度的人数</div>
      </div>
      <div class="admin-stat-card">
        <div class="admin-stat-value">${stats.total_levels_completed}</div>
        <div class="admin-stat-label">全站累计通关关卡数</div>
      </div>
      <div class="admin-stat-card">
        <div class="admin-stat-value">${stats.avg_levels_per_user}</div>
        <div class="admin-stat-label">人均通关关卡数</div>
      </div>
    </div>
    <h2 class="admin-chart-title">最近30天每日新增注册</h2>
    <div class="admin-chart">${renderChart(stats.signups_by_day)}</div>
  `;
}

const STUCK_TRACK_LABEL = { course: "初级", assessment: "进阶", advanced: "高级", debug: "调试挑战" };

// 流失漏斗：每条赛道分别画一个柱状图，第N关的柱子高度是"至少走到第N关"的
// 人数——理论上应该是一路不涨的阶梯（越往后人越少），哪一关掉得特别多，
// 就是那一关卡住人最多，比"平均通关关卡数"这种单一数字有用得多。
// admin_track_funnel()返回的是[{track, level_num, users_reached}, ...]
// 摊平的数组，这里先按track分组再各画各的。
function renderFunnel(rows) {
  if (!rows || rows.length === 0) {
    return `<p class="admin-chart-empty">还没有数据。</p>`;
  }
  const byTrack = {};
  rows.forEach((r) => {
    (byTrack[r.track] = byTrack[r.track] || []).push(r);
  });
  return Object.keys(byTrack)
    .map((track) => {
      const levels = byTrack[track].slice().sort((a, b) => a.level_num - b.level_num);
      const max = Math.max(...levels.map((l) => l.users_reached), 1);
      const bars = levels
        .map((l) => {
          const pct = max > 0 ? Math.max((l.users_reached / max) * 100, 4) : 4;
          return `<div class="admin-chart-bar" style="height:${pct}%" title="第${l.level_num}关：${l.users_reached} 人走到过这一关">
            <span class="admin-chart-bar-value">${l.users_reached}</span>
          </div>`;
        })
        .join("");
      const trackLabel = STUCK_TRACK_LABEL[track] || escapeHtml(track);
      return `
        <p class="completion-row-title" style="margin:16px 0 6px;">${trackLabel}</p>
        <div class="admin-chart">
          <div class="admin-chart-bars">${bars}</div>
          <div class="admin-chart-axis"><span>第1关</span><span>第${levels[levels.length - 1].level_num}关</span></div>
        </div>
      `;
    })
    .join("");
}

function renderStuckPoints(rows) {
  if (!rows || rows.length === 0) {
    return `<p class="admin-chart-empty">还没有人反馈卡住——点关卡页里"🤔 这道题我还是不懂"会记一条到这里。</p>`;
  }
  const items = rows
    .map((r) => {
      const trackLabel = STUCK_TRACK_LABEL[r.track] || escapeHtml(r.track);
      const variantLabel = r.variant_index !== null && r.variant_index !== undefined ? `（变体${r.variant_index}）` : "";
      return `<li><span class="completion-row-title">${trackLabel} 第${r.level_id}关${variantLabel}</span><span class="completion-row-count">${r.report_count} 次</span></li>`;
    })
    .join("");
  return `<ul class="completion-summary-list">${items}</ul>`;
}

function renderUserList(rows) {
  if (!rows || rows.length === 0) {
    return `<p class="admin-chart-empty">还没有人注册。</p>`;
  }
  const items = rows
    .map((r) => {
      const date = r.created_at ? new Date(r.created_at).toLocaleDateString("zh-CN") : "";
      return `<li><span class="completion-row-title">${escapeHtml(r.username)}</span><span class="completion-row-count">${date}</span></li>`;
    })
    .join("");
  return `<ul class="completion-summary-list admin-user-list">${items}</ul>`;
}

async function render() {
  const root = document.getElementById("admin-root");
  root.innerHTML = `
    <div class="landing-eyebrow">数据后台</div>
    <h1>📊 网站数据</h1>
    <div id="admin-content">加载中...</div>
  `;
  const contentBox = document.getElementById("admin-content");

  if (!supabaseClient) {
    contentBox.innerHTML = `<p class="cert-compare-error">账号功能暂时加载不出来，刷新页面再试试。</p>`;
    return;
  }

  const user = window.cloudProgressReady ? await window.cloudProgressReady : null;
  if (!user) {
    contentBox.innerHTML = `<p class="landing-lede">请先登录你自己的账号——去侧栏（比如"初级"页面）登录之后再回到这个页面。</p>`;
    return;
  }

  try {
    const { data, error } = await supabaseClient.rpc("admin_stats");
    if (error) throw error;
    contentBox.innerHTML = renderStats(data);
  } catch (e) {
    // 统一文案，不区分"函数还没建"和"这个账号不是站长"——避免让非站长账号
    // 通过报错信息的差异反推出"我是不是站长"这种信息。
    contentBox.innerHTML = `<p class="cert-compare-error">看不到数据——要么数据库脚本还没执行，要么这个账号看不了这个页面。</p>`;
    return;
  }

  // 卡点排行是独立的一张表+一个RPC，跟上面的admin_stats完全分开——这张表/函数
  // 可能还没建（需要额外跑一次SQL），这里单独try/catch，失败了不影响上面
  // 已经显示出来的核心数据。
  try {
    const { data: stuckRows, error: stuckError } = await supabaseClient.rpc("admin_stuck_points");
    if (stuckError) throw stuckError;
    contentBox.innerHTML += `
      <h2 class="admin-chart-title">卡点排行（"这道题我还是不懂"反馈）</h2>
      <div class="admin-chart">${renderStuckPoints(stuckRows)}</div>
    `;
  } catch (e) {
    // 静默跳过——大概率是 admin_stuck_points() 这个函数还没建。
  }

  // 留存/流失漏斗，同样独立try/catch——函数可能还没建。
  try {
    const { data: funnelRows, error: funnelError } = await supabaseClient.rpc("admin_track_funnel");
    if (funnelError) throw funnelError;
    contentBox.innerHTML += `
      <h2 class="admin-chart-title">各赛道流失漏斗（每一关还有多少人走到过）</h2>
      ${renderFunnel(funnelRows)}
    `;
  } catch (e) {
    // 静默跳过——大概率是 admin_track_funnel() 这个函数还没建。
  }

  // 全部注册用户名单，同样独立try/catch——这个函数读的是auth.users，
  // 一样只有站长自己能调用，跟admin_stats()的user_id校验是同一套。
  try {
    const { data: userRows, error: userListError } = await supabaseClient.rpc("admin_user_list");
    if (userListError) throw userListError;
    contentBox.innerHTML += `
      <h2 class="admin-chart-title">全部注册用户（${userRows.length}）</h2>
      <div class="admin-chart">${renderUserList(userRows)}</div>
    `;
  } catch (e) {
    // 静默跳过——大概率是 admin_user_list() 这个函数还没建。
  }
}

render();
