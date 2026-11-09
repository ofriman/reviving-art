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

  /* ---------- custom creation studio ---------- */
  var createFrame = document.querySelector("[data-create-preview]");
  if (createFrame) {
    var CREATE_BG = {
      cream:    { fill: "#f4eddd", label: "קרם בהיר" },
      white:    { fill: "#ffffff", label: "לבן" },
      bordeaux: { fill: "#5e2b2b", label: "בורדו" },
      black:    { fill: "#14100c", label: "שחור" }
    };
    var CREATE_COLORS = {
      gold:    { fill: "#d19a2a", label: "זהב" },
      silver:  { fill: "#b8b8c2", label: "כסף" },
      natural: { fill: "#7d8b5e", label: "טבעי" },
      mixed:   { fill: null,      label: "מעורב" }
    };
    var MIXED_SEQUENCE = ["#d19a2a", "#b8b8c2", "#7d8b5e"];
    var CREATE_LAYOUTS = {
      3: [ { x: 200, y: 250, r: 0,   s: 1.5 },
           { x: 128, y: 138, r: -24, s: 1.0 },
           { x: 282, y: 366, r: 28,  s: 1.0 } ],
      5: [ { x: 200, y: 130, r: -8,  s: 1.1 },
           { x: 116, y: 244, r: 24,  s: 1.1 },
           { x: 284, y: 250, r: -28, s: 1.1 },
           { x: 168, y: 372, r: 14,  s: 1.1 },
           { x: 264, y: 376, r: -16, s: 0.85 } ],
      7: [ { x: 200, y: 110, r: -6,  s: 1.0 },
           { x: 112, y: 190, r: 26,  s: 0.95 },
           { x: 288, y: 196, r: -26, s: 0.95 },
           { x: 200, y: 268, r: 4,   s: 1.15 },
           { x: 122, y: 340, r: -18, s: 0.9 },
           { x: 282, y: 346, r: 20,  s: 0.9 },
           { x: 200, y: 420, r: -4,  s: 0.8 } ]
    };
    var LEAF_BODY = "M50 4 C74 28 78 66 50 96 C22 66 26 28 50 4 Z";
    var LEAF_VEIN = "M50 14 L50 86";
    var createState = { bg: "cream", color: "gold", count: "5" };
    var createSend = document.querySelector("[data-create-send]");

    function leafFill(index) {
      if (createState.color === "mixed") return MIXED_SEQUENCE[index % MIXED_SEQUENCE.length];
      return CREATE_COLORS[createState.color].fill;
    }

    function renderCreate() {
      var bg = CREATE_BG[createState.bg].fill;
      var layout = CREATE_LAYOUTS[createState.count];
      var parts = [];
      parts.push('<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="הדמיית יצירה">');
      parts.push('<rect width="400" height="500" fill="' + bg + '"/>');
      parts.push('<rect x="14" y="14" width="372" height="472" fill="none" stroke="rgba(143,94,15,0.35)" stroke-width="2"/>');
      for (var i = 0; i < layout.length; i++) {
        var L = layout[i];
        var fill = leafFill(i);
        var vein = createState.bg === "black" || createState.bg === "bordeaux" ? "rgba(244,237,221,0.55)" : "rgba(90,61,11,0.4)";
        parts.push('<g transform="translate(' + L.x + ' ' + L.y + ') rotate(' + L.r + ') scale(' + L.s + ') translate(-50 -50)">');
        parts.push('<path d="' + LEAF_BODY + '" fill="' + fill + '" fill-opacity="0.92" stroke="rgba(90,61,11,0.25)" stroke-width="1.5"/>');
        parts.push('<path d="' + LEAF_VEIN + '" fill="none" stroke="' + vein + '" stroke-width="2" stroke-linecap="round"/>');
        parts.push('</g>');
      }
      parts.push('</svg>');
      createFrame.innerHTML = parts.join("");

      if (createSend) {
        var msg = "שלום ירדנה, אשמח ליצירה בהזמנה אישית:\n" +
          "רקע: " + CREATE_BG[createState.bg].label + "\n" +
          "צבע עלים: " + CREATE_COLORS[createState.color].label + "\n" +
          "מספר עלים: " + createState.count + "\n" +
          "(התמונה באתר להמחשה בלבד — אשמח לשמוע פרטים)";
        createSend.href = "https://wa.me/972555564471?text=" + encodeURIComponent(msg).replace(/%20/g, "+");
      }
    }

    var groups = document.querySelectorAll("[data-create-group]");
    Array.prototype.forEach.call(groups, function (group) {
      var key = group.getAttribute("data-create-group");
      group.addEventListener("click", function (e) {
        var chip = e.target.closest(".create-chip");
        if (!chip) return;
        createState[key] = chip.getAttribute("data-value");
        var chips = group.querySelectorAll(".create-chip");
        Array.prototype.forEach.call(chips, function (c) {
          c.setAttribute("aria-pressed", c === chip ? "true" : "false");
        });
        renderCreate();
      });
    });

    renderCreate();
  }

})();
