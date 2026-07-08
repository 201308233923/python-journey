// 导出/导入进度码：把浏览器localStorage里跟这个网站有关的记录打包成一段文字，
// 换设备/换浏览器的时候粘贴这段码就能恢复。不涉及任何账号、不发送到任何服务器。

const PROGRESS_SYNC_PREFIXES = ["codecourse_", "aigames_"];

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
}

setupProgressSyncButtons();
