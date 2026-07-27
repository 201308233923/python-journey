// 几个track页面（初级/进阶/高级/调试挑战/AI小游戏/证书/排行榜/管理后台/水平测试）
// 各自都写了一份完全一样的escapeHtml和celebrate，这里合并成一份，各页面在自己的
// 主脚本之前引入这一份即可。

function escapeHtml(s) {
  const div = document.createElement("div");
  div.textContent = s;
  return div.innerHTML;
}

// 通关时撒一把彩纸庆祝一下。尊重"减少动态效果"的系统设置，那种情况下就不放了。
function celebrate() {
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const canvas = document.createElement("canvas");
  canvas.className = "confetti-canvas";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  const colors = ["#4f6df5", "#1a7f4b", "#f5b942", "#e0554f", "#7b93ff", "#6fdf9d"];
  const particles = Array.from({ length: 90 }, () => ({
    x: Math.random() * canvas.width,
    y: -20 - Math.random() * canvas.height * 0.4,
    w: 5 + Math.random() * 5,
    color: colors[Math.floor(Math.random() * colors.length)],
    vx: -2.5 + Math.random() * 5,
    vy: 2.5 + Math.random() * 2.5,
    rotation: Math.random() * 360,
    vr: -8 + Math.random() * 16,
  }));

  const start = performance.now();
  const duration = 1600;

  function frame(now) {
    const elapsed = now - start;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.05;
      p.rotation += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.w / 2, p.w, p.w * 0.6);
      ctx.restore();
    });
    if (elapsed < duration) {
      requestAnimationFrame(frame);
    } else {
      canvas.remove();
    }
  }
  requestAnimationFrame(frame);
}
