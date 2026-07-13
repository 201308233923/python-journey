// 全站排行榜：按四条赛道（初级+进阶+高级+调试挑战，满分32关）实际通关的关卡数排名。
// 数据存在一张独立的公开表 leaderboard 里（跟私有的 progress 表分开，那张存的是
// 完整进度含代码原文，不适合整体公开），谁登录过账号、同步过一次进度，就会自动
// 出现在这里——不需要额外勾选参加。

const TOTAL_LEVELS_MAX = 12 + 6 + 6 + 8; // 初级+进阶+高级+调试挑战

function escapeHtml(s) {
  const div = document.createElement("div");
  div.textContent = s;
  return div.innerHTML;
}

function medalFor(rank) {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return `${rank}.`;
}

function renderRows(rows, currentUserId) {
  if (rows.length === 0) {
    return `<p class="landing-lede">还没有人上榜——登录账号、过几关之后自动同步进度，你就会是第一个。</p>`;
  }
  const items = rows
    .map((row, idx) => {
      const rank = idx + 1;
      const isMe = currentUserId && row.user_id === currentUserId;
      return `<li class="${isMe ? "leaderboard-row-me" : ""}">
        <span class="leaderboard-rank">${medalFor(rank)}</span>
        <span class="leaderboard-name">${escapeHtml(row.username)}${isMe ? "（你）" : ""}</span>
        <span class="leaderboard-score">${row.total_levels} / ${TOTAL_LEVELS_MAX} 关</span>
      </li>`;
    })
    .join("");
  return `<ol class="leaderboard-list">${items}</ol>`;
}

async function render() {
  const root = document.getElementById("leaderboard-root");
  root.innerHTML = `
    <div class="landing-eyebrow">排行榜</div>
    <h1>🏆 谁通关的关卡最多？</h1>
    <p class="landing-lede">按四条赛道（初级+进阶+高级+调试挑战，满分${TOTAL_LEVELS_MAX}关）实际通关的关卡数排名，
    登录账号、同步过进度就会自动出现在这里。</p>
    <div id="leaderboard-content">加载中...</div>
  `;

  const contentBox = document.getElementById("leaderboard-content");

  if (!supabaseClient) {
    contentBox.innerHTML = `<p class="cert-compare-error">账号功能暂时加载不出来，刷新页面再试试。</p>`;
    return;
  }

  const user = window.cloudProgressReady ? await window.cloudProgressReady : null;
  const currentUserId = user ? user.id : null;

  try {
    const { data, error } = await supabaseClient
      .from("leaderboard")
      .select("user_id, username, total_levels")
      .order("total_levels", { ascending: false })
      .limit(50);
    if (error) throw error;
    contentBox.innerHTML = renderRows(data || [], currentUserId);
  } catch (e) {
    // 最常见的原因：leaderboard 这张表还没建（需要先在Supabase后台跑一次建表的SQL）。
    contentBox.innerHTML = `<p class="cert-compare-error">排行榜暂时加载不出来（可能还没准备好），过一会再来看看。</p>`;
  }

  if (!currentUserId) {
    contentBox.innerHTML += `<p class="landing-lede leaderboard-hint">还没登录账号？登录后过几关就会自动出现在榜单上。</p>`;
  }
}

render();
