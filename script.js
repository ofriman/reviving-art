/* reviving. — falling golden leaves canvas, menu, lightbox */
(function () {
  "use strict";

  /* ---------- falling leaves canvas ---------- */
  var canvas = document.querySelector("[data-leaves]");
  if (canvas) {
    var ctx = canvas.getContext("2d");
    var rafId = 0;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    var leaves = [];
    for (var i = 0; i < 20; i++) {
      leaves.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        s: Math.random() * 9 + 13,
        vy: Math.random() * 0.35 + 0.15,
        phase: Math.random() * Math.PI * 2,
        swaySpeed: Math.random() * 0.008 + 0.004,
        swayAmp: Math.random() * 30 + 15,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.01,
        a: Math.random() * 0.2 + 0.75,
        hue: Math.random()
      });
    }

    function drawLeaf(x, y, size, rot, alpha) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      var half = size * 0.34;

      ctx.shadowColor = "rgba(255, 196, 88, " + alpha * 0.85 + ")";
      ctx.shadowBlur = size * 1.15;
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.bezierCurveTo(half, -size * 0.5, half, size * 0.45, 0, size);
      ctx.bezierCurveTo(-half, size * 0.45, -half, -size * 0.5, 0, -size);
      ctx.closePath();

      var grad = ctx.createLinearGradient(-half, -size, half, size);
      grad.addColorStop(0, "rgba(168, 116, 24, " + alpha + ")");
      grad.addColorStop(0.3, "rgba(232, 178, 64, " + alpha + ")");
      grad.addColorStop(0.55, "rgba(255, 224, 138, " + alpha + ")");
      grad.addColorStop(0.8, "rgba(226, 176, 58, " + alpha + ")");
      grad.addColorStop(1, "rgba(158, 106, 20, " + alpha + ")");
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.fill();

      ctx.shadowBlur = 0;
      ctx.strokeStyle = "rgba(140, 98, 24, " + alpha * 0.6 + ")";
      ctx.lineWidth = 0.7;
      ctx.stroke();

      // center vein
      ctx.beginPath();
      ctx.moveTo(0, -size * 0.95);
      ctx.lineTo(0, size * 0.95);
      ctx.strokeStyle = "rgba(255, 236, 180, " + alpha * 0.85 + ")";
      ctx.lineWidth = Math.max(0.8, size * 0.045);
      ctx.stroke();

      // side veins
      ctx.strokeStyle = "rgba(255, 226, 150, " + alpha * 0.65 + ")";
      ctx.lineWidth = 0.6;
      var veins = 12;
      for (var v = 1; v < veins; v++) {
        var u = v / veins;
        var d = -size * 0.85 + u * size * 1.7;
        var b = Math.sin(Math.PI * u) * half * 0.92;
        ctx.beginPath();
        ctx.moveTo(0, d - size * 0.06);
        ctx.lineTo(b, d + size * 0.06);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, d - size * 0.06);
        ctx.lineTo(-b, d + size * 0.06);
        ctx.stroke();
      }

      // stem
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.quadraticCurveTo(size * 0.03, -size * 1.12, 0, -size * 1.22);
      ctx.strokeStyle = "rgba(146, 106, 34, " + alpha + ")";
      ctx.lineWidth = Math.max(1, size * 0.05);
      ctx.stroke();

      ctx.restore();
    }

    function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var i = 0; i < leaves.length; i++) {
        var leaf = leaves[i];
        leaf.phase += leaf.swaySpeed;
        leaf.x += Math.cos(leaf.phase) * 0.4;
        leaf.y += leaf.vy;
        leaf.rot += leaf.rotSpeed;
        if (leaf.y > canvas.height + 15) {
          leaf.y = -15;
          leaf.x = Math.random() * canvas.width;
        }
        if (leaf.x < -15) leaf.x = canvas.width + 15;
        if (leaf.x > canvas.width + 15) leaf.x = -15;
        drawLeaf(leaf.x, leaf.y, leaf.s, leaf.rot + Math.sin(leaf.phase) * 0.3, leaf.a);
      }
      rafId = requestAnimationFrame(tick);
    }
    tick();
  }

  /* ---------- menu ---------- */
  var menu = document.querySelector("[data-menu]");
  var openBtn = document.querySelector("[data-menu-open]");
  if (menu && openBtn) {
    openBtn.addEventListener("click", function () { menu.hidden = false; });
    menu.querySelectorAll("[data-menu-close]").forEach(function (el) {
      el.addEventListener("click", function () { menu.hidden = true; });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") menu.hidden = true;
    });
  }

  /* ---------- gallery lightbox ---------- */
  var lightbox = document.querySelector("[data-lightbox]");
  if (lightbox) {
    var lbImg = lightbox.querySelector("img");
    var lbName = lightbox.querySelector("[data-lightbox-name]");
    var lbYear = lightbox.querySelector("[data-lightbox-year]");

    function closeLightbox() { lightbox.hidden = true; }

    document.querySelectorAll("[data-work]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var img = btn.querySelector("img");
        lbImg.src = img.src;
        lbImg.alt = img.alt;
        lbName.textContent = btn.getAttribute("data-work");
        lbYear.textContent = btn.getAttribute("data-year") || "";
        lightbox.hidden = false;
      });
    });

    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox || e.target.closest("[data-lightbox-close]")) closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeLightbox();
    });
  }
})();
