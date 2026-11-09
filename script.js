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
    /* arrangement presets derived from visible gallery compositions:
       scattered - loose scatter (Ambra / Perla / Alba), central - one large center leaf
       with satellites (Olea), diagonal - rising diagonal (Gemini / Prima / Silva) */
    var CREATE_ARRANGEMENTS = {
      scattered: { label: "מפוזר", layouts: {
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
      } },
      central: { label: "מרכזי", layouts: {
        3: [ { x: 200, y: 250, r: 0,   s: 1.6 },
             { x: 118, y: 140, r: -18, s: 0.9 },
             { x: 284, y: 366, r: 22,  s: 0.9 } ],
        5: [ { x: 200, y: 255, r: 0,   s: 1.6 },
             { x: 106, y: 122, r: -16, s: 0.9 },
             { x: 298, y: 126, r: 16,  s: 0.9 },
             { x: 110, y: 392, r: -20, s: 0.9 },
             { x: 294, y: 388, r: 20,  s: 0.9 } ],
        7: [ { x: 200, y: 250, r: 0,   s: 1.5 },
             { x: 102, y: 112, r: -14, s: 0.9 },
             { x: 298, y: 112, r: 14,  s: 0.9 },
             { x: 92,  y: 252, r: -24, s: 0.9 },
             { x: 308, y: 252, r: 24,  s: 0.9 },
             { x: 108, y: 394, r: -18, s: 0.9 },
             { x: 292, y: 394, r: 18,  s: 0.9 } ]
      } },
      diagonal: { label: "אלכסון", layouts: {
        3: [ { x: 112, y: 378, r: -22, s: 1.1 },
             { x: 200, y: 250, r: -8,  s: 1.2 },
             { x: 288, y: 122, r: -30, s: 1.1 } ],
        5: [ { x: 96,  y: 402, r: -18, s: 0.95 },
             { x: 148, y: 322, r: -26, s: 1.0 },
             { x: 206, y: 246, r: -6,  s: 1.1 },
             { x: 266, y: 172, r: -22, s: 1.0 },
             { x: 316, y: 100, r: -32, s: 0.95 } ],
        7: [ { x: 84,  y: 412, r: -16, s: 0.85 },
             { x: 124, y: 344, r: -24, s: 0.9 },
             { x: 164, y: 282, r: -10, s: 0.95 },
             { x: 206, y: 226, r: -28, s: 1.05 },
             { x: 246, y: 172, r: -12, s: 0.95 },
             { x: 286, y: 122, r: -26, s: 0.9 },
             { x: 324, y: 76,  r: -34, s: 0.85 } ]
      } }
    };
    /* Extend the same illustrative arrangements to every count from 1 to 8.
       Existing 3/5/7 layouts stay unchanged. */
    Object.keys(CREATE_ARRANGEMENTS).forEach(function (key) {
      var layouts = CREATE_ARRANGEMENTS[key].layouts;
      layouts[1] = [{ x: 200, y: 250, r: key === "diagonal" ? -22 : 0, s: 1.6 }];
      layouts[2] = key === "central" ? [layouts[1][0], { x: 290, y: 120, r: 18, s: 0.9 }] :
        [{ x: 135, y: 340, r: -18, s: 1.25 }, { x: 265, y: 160, r: key === "diagonal" ? -26 : 22, s: 1.25 }];
      layouts[4] = layouts[5].slice(0, 4);
      layouts[6] = layouts[7].slice(0, 6);
      layouts[8] = layouts[7].concat([key === "central" ? { x: 200, y: 420, r: 0, s: 0.8 } :
        key === "diagonal" ? { x: 280, y: 370, r: -20, s: 0.8 } : { x: 305, y: 420, r: 18, s: 0.8 }]);
    });
    var DEFAULT_ARRANGEMENT = "scattered";
    function arrangementLayouts() {
      var a = CREATE_ARRANGEMENTS[createState.arrangement] || CREATE_ARRANGEMENTS[DEFAULT_ARRANGEMENT];
      return a.layouts[createState.count];
    }
    var LEAF_BODY = "M50 4 C74 28 78 66 50 96 C22 66 26 28 50 4 Z";
    var LEAF_VEIN = "M50 7 Q46 50 50 94";
    var LEAF_SHAPES = {
      pointed: { label: "מחודד", body: "M50 3 C61 19 76 22 77 43 C80 65 66 84 50 94 C36 86 23 68 24 48 C23 27 40 19 50 3 Z", width: 27 },
      broad: { label: "רחב", body: "M50 4 C60 20 83 20 87 44 C93 69 76 87 50 94 C27 88 9 70 14 45 C18 23 40 19 50 4 Z", width: 37 },
      slender: { label: "מוארך", body: "M50 2 C58 23 66 37 64 56 C63 76 56 89 50 95 C43 86 35 73 36 53 C35 33 45 20 50 2 Z", width: 15 }
    };
    function leafDimensions(index) { return createState.leafDimensions[index] || [1,1]; }
    function clampLeaf(leaf, index) {
      var d = leafDimensions(index), half = 55 * leaf.s * Math.max(d[0], d[1]);
      leaf.x = Math.min(400-half, Math.max(half,leaf.x));
      leaf.y = Math.min(500-half, Math.max(half,leaf.y));
    }
    function leafShape(index) { return LEAF_SHAPES[createState.leafShapes[index]] || LEAF_SHAPES.pointed; }
    function shadeColor(hex, factor) {
      return "#" + [1,3,5].map(function (i) {
        return Math.max(0, Math.min(255, Math.round(parseInt(hex.substr(i,2),16) * factor))).toString(16).padStart(2,"0");
      }).join("");
    }
    var createState = { bg: "cream", color: "gold", count: "5", arrangement: DEFAULT_ARRANGEMENT, leaves: null, moved: false, selected: -1, leafColors: [], leafShapes: [], leafDimensions: [] };
    var rotateGroup = document.querySelector("[data-rotate-group]");
    var createSend = document.querySelector("[data-create-send]");

    function isCustom(v) { return typeof v === "string" && /^#[0-9a-fA-F]{6}$/.test(v); }
    function bgFill() { return isCustom(createState.bg) ? createState.bg : CREATE_BG[createState.bg].fill; }
    function bgLabel() { return isCustom(createState.bg) ? "צבע חופשי " + createState.bg : CREATE_BG[createState.bg].label; }
    /* Describe visible colors without changing the underlying palette or overrides. */
    function visibleColor() {
      var first = leafFill(0).toLowerCase();
      for (var i = 1; i < +createState.count; i++) {
        if (leafFill(i).toLowerCase() !== first) return "mixed";
      }
      var keys = Object.keys(CREATE_COLORS);
      for (var j = 0; j < keys.length; j++) {
        if (CREATE_COLORS[keys[j]].fill === first) return keys[j];
      }
      return first;
    }
    function colorLabel() {
      var color = visibleColor();
      return isCustom(color) ? "צבע חופשי " + color : CREATE_COLORS[color].label;
    }
    function updateColorMenu() {
      var group = document.querySelector('[data-create-group="color"]');
      if (!group) return;
      var color = visibleColor();
      Array.prototype.forEach.call(group.querySelectorAll(".create-chip"), function (chip) {
        chip.setAttribute("aria-pressed", chip.getAttribute("data-value") === color ? "true" : "false");
      });
      var wrap = group.querySelector("[data-custom-wrap]");
      if (wrap) wrap.classList.toggle("is-active", isCustom(color));
      var input = group.querySelector("[data-create-custom]");
      if (input && isCustom(color)) input.value = color;
    }
    function leafFill(index) {
      if (isCustom(createState.leafColors[index])) return createState.leafColors[index];
      if (isCustom(createState.color)) return createState.color;
      if (createState.color === "mixed") return MIXED_SEQUENCE[index % MIXED_SEQUENCE.length];
      return CREATE_COLORS[createState.color].fill;
    }
    function luminance(hex) {
      var r = parseInt(hex.substr(1, 2), 16), g = parseInt(hex.substr(3, 2), 16), b = parseInt(hex.substr(5, 2), 16);
      return 0.299 * r + 0.587 * g + 0.114 * b;
    }
    function isDarkBg() { return luminance(bgFill()) < 110; }

    function updateArrangementMenu() {
      var group = document.querySelector('[data-create-group="arrangement"]');
      if (!group) return;
      group.querySelectorAll(".create-chip").forEach(function (chip) {
        chip.setAttribute("aria-pressed", chip.getAttribute("data-value") === createState.arrangement ? "true" : "false");
      });
      var indicator = group.querySelector("[data-free-indicator]");
      if (indicator) indicator.hidden = !!createState.arrangement;
    }

    function arrangementLabel() {
      var a = CREATE_ARRANGEMENTS[createState.arrangement];
      return a ? a.label : "חופשי";
    }

    function currentLeaves() {
      if (!createState.leaves || createState.leaves.length !== +createState.count) {
        createState.leaves = arrangementLayouts().map(function (L) {
          return { x: L.x, y: L.y, r: L.r, s: L.s };
        });
      }
      return createState.leaves;
    }

    function designLink() {
      var design = { b: createState.bg, c: createState.color, n: createState.count };
      if (createState.arrangement) design.a = createState.arrangement;
      if (createState.leafDimensions.some(function (v) { return !!v; })) design.ld = createState.leafDimensions.slice(0, +createState.count);
      if (createState.leafShapes.some(function (v) { return !!v; })) design.ls = createState.leafShapes.slice(0, +createState.count);
      if (createState.leafColors.some(isCustom)) design.lc = createState.leafColors.slice(0, +createState.count);
      if (createState.moved) {
        design.p = currentLeaves().map(function (L) { return [Math.round(L.x), Math.round(L.y), Math.round(L.r)]; });
      }
      var param = btoa(unescape(encodeURIComponent(JSON.stringify(design))))
        .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
      return "https://www.reviving-art.com/?d=" + param + "#create";
    }

    function updateSendLink() {
      if (!createSend) return;
      var msg = "שלום ירדנה, אשמח ליצירה בהזמנה אישית:\n" +
        "רקע: " + bgLabel() + "\n" +
        "צבע עלים: " + colorLabel() + (createState.leafColors.some(isCustom) ? " (כולל צבעים אישיים בקישור)" : "") + "\n" +
        "מספר עלים: " + createState.count + "\n" +
        "סידור: " + arrangementLabel() + "\n" +
        "העיצוב שבחרתי באתר: " + designLink() + "\n" +
        "(התמונה באתר להמחשה בלבד — אשמח לשמוע פרטים)";
      createSend.href = "https://wa.me/972555564471?text=" + encodeURIComponent(msg).replace(/%20/g, "+");
    }

    function renderCreate() {
      var leaves = currentLeaves();
      leaves.forEach(clampLeaf);
      var vein = isDarkBg() ? "rgba(244,237,221,0.55)" : "rgba(90,61,11,0.4)";
      var parts = [];
      parts.push('<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="הדמיית יצירה">');
      parts.push('<rect width="400" height="500" fill="' + bgFill() + '"/>');
      parts.push('<rect x="14" y="14" width="372" height="472" fill="none" stroke="rgba(143,94,15,0.35)" stroke-width="2"/>');
      for (var i = 0; i < leaves.length; i++) {
        var L = leaves[i];
        parts.push('<g class="create-leaf' + (i === createState.selected ? " selected" : "") + '" data-index="' + i + '" transform="translate(' + L.x + ' ' + L.y + ') rotate(' + L.r + ') scale(' + (L.s * leafDimensions(i)[0]) + ' ' + (L.s * leafDimensions(i)[1]) + ') translate(-50 -50)">');
        if (i === createState.selected) {
          parts.push('<circle cx="50" cy="50" r="62" fill="none" stroke="rgba(143,94,15,0.7)" stroke-width="2" stroke-dasharray="6 5"/>');
        }
        var shape = leafShape(i), fill = leafFill(i);
        var grad = "leaf-metal-" + i;
        parts.push('<defs><linearGradient id="' + grad + '" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="' + shadeColor(fill,0.62) + '"/><stop offset="0.37" stop-color="' + fill + '"/><stop offset="0.51" stop-color="' + shadeColor(fill,1.28) + '"/><stop offset="0.69" stop-color="' + fill + '"/><stop offset="1" stop-color="' + shadeColor(fill,0.76) + '"/></linearGradient></defs>');
        parts.push('<path d="' + shape.body + '" fill="url(#' + grad + ')" stroke="' + shadeColor(fill,0.62) + '" stroke-width="0.7"/>');
        var veins = LEAF_VEIN;
        for (var v = 1; v < 11; v++) {
          var y = 10 + v * 7, w = Math.sin((y - 4) / 91 * Math.PI) * shape.width * 0.84;
          veins += " M49 " + (y+7) + " Q" + (49+w*0.45) + " " + (y+3) + " " + (50+w) + " " + (y-4);
          veins += " M49 " + (y+7) + " Q" + (49-w*0.45) + " " + (y+3) + " " + (50-w) + " " + (y-4);
        }
        parts.push('<path d="' + veins + '" fill="none" stroke="' + shadeColor(fill,0.55) + '" stroke-opacity="0.6" stroke-width="0.65" stroke-linecap="round"/>');
        parts.push('<path d="M50 94 Q52 100 48 105" fill="none" stroke="' + shadeColor(fill,0.62) + '" stroke-width="1.2" stroke-linecap="round"/>');
        parts.push('</g>');
      }
      parts.push('</svg>');
      createFrame.innerHTML = parts.join("");
      if (rotateGroup && createState.selected >= 0) rotateGroup.querySelector("[data-leaf-color]").value = leafFill(createState.selected);
      updateShapeMenu();
      updateArrangementMenu();
      updateColorMenu();
      updateSendLink();
    }

    /* drag leaves (mouse + touch via pointer events) */
    var dragIndex = -1, dragDX = 0, dragDY = 0;
    function createSvg() { return createFrame.querySelector("svg"); }
    function svgPoint(svg, e) {
      var pt = svg.createSVGPoint();
      pt.x = e.clientX; pt.y = e.clientY;
      return pt.matrixTransform(svg.getScreenCTM().inverse());
    }
    function updateShapeMenu() {
      var selected = createState.selected;
      document.querySelectorAll("[data-leaf-dimension]").forEach(function (input) {
        var dimension = +input.getAttribute("data-leaf-dimension");
        input.value = Math.round(leafDimensions(selected)[dimension] * 100);
        input.parentNode.querySelector("output").textContent = input.value + "%";
      });
      document.querySelectorAll("[data-leaf-shape]").forEach(function (button) {
        button.setAttribute("aria-pressed", selected >= 0 && button.getAttribute("data-leaf-shape") === (createState.leafShapes[selected] || "pointed") ? "true" : "false");
      });
    }
    function selectLeaf(index) {
      createState.selected = index;
      updateShapeMenu();
      var svg = createSvg();
      if (svg) {
        Array.prototype.forEach.call(svg.querySelectorAll(".create-leaf"), function (g) {
          var isSel = +g.getAttribute("data-index") === index;
          g.classList.toggle("selected", isSel);
          var ring = g.querySelector("circle");
          if (isSel && !ring) {
            var c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            c.setAttribute("cx", "50"); c.setAttribute("cy", "50"); c.setAttribute("r", "62");
            c.setAttribute("fill", "none"); c.setAttribute("stroke", "rgba(143,94,15,0.7)");
            c.setAttribute("stroke-width", "2"); c.setAttribute("stroke-dasharray", "6 5");
            g.insertBefore(c, g.firstChild);
          } else if (!isSel && ring) {
            ring.parentNode.removeChild(ring);
          }
        });
      }
      if (rotateGroup) {
        rotateGroup.hidden = index < 0;
        if (index >= 0) rotateGroup.querySelector("[data-leaf-color]").value = leafFill(index);
      }
    }

    createFrame.addEventListener("pointerdown", function (e) {
      var g = e.target && e.target.closest ? e.target.closest(".create-leaf") : null;
      var svg = createSvg();
      if (!g || !svg) { selectLeaf(-1); return; }
      dragIndex = +g.getAttribute("data-index");
      selectLeaf(dragIndex);
      var p = svgPoint(svg, e);
      var leaf = currentLeaves()[dragIndex];
      dragDX = p.x - leaf.x; dragDY = p.y - leaf.y;
      g.classList.add("dragging");
      try { createFrame.setPointerCapture(e.pointerId); } catch (err) {}
      e.preventDefault();
    });
    createFrame.addEventListener("pointermove", function (e) {
      if (dragIndex < 0) return;
      var svg = createSvg();
      if (!svg) return;
      var p = svgPoint(svg, e);
      var leaf = currentLeaves()[dragIndex];
      var dimensions = leafDimensions(dragIndex);
      var half = 55 * leaf.s * Math.max(dimensions[0], dimensions[1]); /* rotation-aware extent: whole leaf stays inside the frame at any angle */
      leaf.x = Math.min(400 - half, Math.max(half, p.x - dragDX));
      leaf.y = Math.min(500 - half, Math.max(half, p.y - dragDY));
      if (!createState.moved) {
        createState.arrangement = null;
        var aChips = document.querySelectorAll('[data-create-group="arrangement"] .create-chip');
        Array.prototype.forEach.call(aChips, function (c) { c.setAttribute("aria-pressed", "false"); });
      }
      createState.moved = true;
      updateArrangementMenu();
      var g = svg.querySelector('[data-index="' + dragIndex + '"]');
      if (g) g.setAttribute("transform", "translate(" + leaf.x + " " + leaf.y + ") rotate(" + leaf.r + ") scale(" + (leaf.s * leafDimensions(dragIndex)[0]) + " " + (leaf.s * leafDimensions(dragIndex)[1]) + ") translate(-50 -50)");
      e.preventDefault();
    });
    function endDrag() {
      if (dragIndex < 0) return;
      dragIndex = -1;
      var svg = createSvg();
      if (svg) {
        var dragging = svg.querySelectorAll(".dragging");
        Array.prototype.forEach.call(dragging, function (g) { g.classList.remove("dragging"); });
      }
      updateSendLink();
    }
    createFrame.addEventListener("pointerup", endDrag);
    createFrame.addEventListener("pointercancel", endDrag);

    var groups = document.querySelectorAll("[data-create-group]");
    Array.prototype.forEach.call(groups, function (group) {
      var key = group.getAttribute("data-create-group");
      group.addEventListener("click", function (e) {
        var chip = e.target.closest(".create-chip");
        if (!chip) return;
        createState[key] = chip.getAttribute("data-value");
        if (key === "color") createState.leafColors = [];
        if (key === "count") { createState.leafColors = createState.leafColors.slice(0, +createState.count); createState.leafShapes = createState.leafShapes.slice(0, +createState.count); createState.leafDimensions = createState.leafDimensions.slice(0, +createState.count); }
        var chips = group.querySelectorAll(".create-chip");
        Array.prototype.forEach.call(chips, function (c) {
          c.setAttribute("aria-pressed", c === chip ? "true" : "false");
        });
        var wrap = group.querySelector("[data-custom-wrap]");
        if (wrap) wrap.classList.remove("is-active");
        if (key === "count" || key === "arrangement") { createState.leaves = null; createState.moved = false; selectLeaf(-1); }
        renderCreate();
      });
    });

    if (rotateGroup) {
      rotateGroup.addEventListener("click", function (e) {
        var shapeButton = e.target.closest("[data-leaf-shape]");
        if (shapeButton && createState.selected >= 0 && LEAF_SHAPES[shapeButton.getAttribute("data-leaf-shape")]) {
          createState.leafShapes[createState.selected] = shapeButton.getAttribute("data-leaf-shape");
          renderCreate();
          return;
        }
        var btn = e.target.closest("[data-rotate]");
        if (!btn || createState.selected < 0) return;
        var leaf = currentLeaves()[createState.selected];
        if (!leaf) return;
        leaf.r += +btn.getAttribute("data-rotate");
        clampLeaf(leaf, createState.selected);
        if (!createState.moved) {
          createState.arrangement = null;
          var aChips = document.querySelectorAll('[data-create-group="arrangement"] .create-chip');
          Array.prototype.forEach.call(aChips, function (c) { c.setAttribute("aria-pressed", "false"); });
        }
        createState.moved = true;
        updateArrangementMenu();
        var svg = createSvg();
        var g = svg && svg.querySelector('[data-index="' + createState.selected + '"]');
        if (g) g.setAttribute("transform", "translate(" + leaf.x + " " + leaf.y + ") rotate(" + leaf.r + ") scale(" + (leaf.s * leafDimensions(createState.selected)[0]) + " " + (leaf.s * leafDimensions(createState.selected)[1]) + ") translate(-50 -50)");
        updateSendLink();
      });
    }

    document.querySelectorAll("[data-leaf-dimension]").forEach(function (input) {
      input.addEventListener("input", function () {
        var index = createState.selected;
        if (index < 0) return;
        var dimensions = leafDimensions(index).slice();
        dimensions[+input.getAttribute("data-leaf-dimension")] = Math.max(0.6, Math.min(1.5, +input.value / 100));
        createState.leafDimensions[index] = dimensions;
        clampLeaf(currentLeaves()[index], index);
        createState.moved = true;
        createState.arrangement = null;
        document.querySelectorAll('[data-create-group="arrangement"] .create-chip').forEach(function (c) { c.setAttribute("aria-pressed","false"); });
        renderCreate();
      });
    });

    var leafColorInput = document.querySelector("[data-leaf-color]");
    if (leafColorInput) leafColorInput.addEventListener("input", function () {
      if (createState.selected < 0 || !isCustom(leafColorInput.value)) return;
      createState.leafColors[createState.selected] = leafColorInput.value;
      renderCreate();
    });

    var customInputs = document.querySelectorAll("[data-create-custom]");
    Array.prototype.forEach.call(customInputs, function (input) {
      input.addEventListener("input", function () {
        var key = input.getAttribute("data-create-custom");
        createState[key] = input.value;
        if (key === "color") createState.leafColors = [];
        var group = document.querySelector('[data-create-group="' + key + '"]');
        if (group) {
          var chips = group.querySelectorAll(".create-chip");
          Array.prototype.forEach.call(chips, function (c) { c.setAttribute("aria-pressed", "false"); });
          var wrap = group.querySelector("[data-custom-wrap]");
          if (wrap) wrap.classList.add("is-active");
        }
        renderCreate();
      });
    });

    /* restore a design shared via link (?d=...) */
    (function applyDesignParam() {
      var m = /[?&]d=([A-Za-z0-9_-]+)/.exec(location.search);
      if (!m) return;
      var d;
      try {
        d = JSON.parse(decodeURIComponent(escape(atob(m[1].replace(/-/g, "+").replace(/_/g, "/")))));
      } catch (e) { return; }
      if (CREATE_BG[d.b] || isCustom(d.b)) createState.bg = d.b;
      if (CREATE_COLORS[d.c] || isCustom(d.c)) createState.color = d.c;
      if (CREATE_ARRANGEMENTS[DEFAULT_ARRANGEMENT].layouts[d.n]) createState.count = d.n;
      if (CREATE_ARRANGEMENTS[d.a]) createState.arrangement = d.a;
      if (Array.isArray(d.ld)) createState.leafDimensions = d.ld.slice(0, +createState.count).map(function (v) {
        return Array.isArray(v) && v.length === 2 && v.every(function (n) { return Number.isFinite(n); }) ? v.map(function (n) { return Math.max(0.6, Math.min(1.5,n)); }) : null;
      });
      var layout = arrangementLayouts();
      if (d.p && d.p.length === layout.length) {
        createState.leaves = layout.map(function (L, i) {
          var s = L.s, dimensions = leafDimensions(i), half = 55 * s * Math.max(dimensions[0], dimensions[1]);
          return {
            x: Math.min(400 - half, Math.max(half, +d.p[i][0] || L.x)),
            y: Math.min(500 - half, Math.max(half, +d.p[i][1] || L.y)),
            r: isFinite(+d.p[i][2]) ? +d.p[i][2] : L.r, s: s
          };
        });
        createState.moved = true;
        createState.arrangement = null;
      }
      if (Array.isArray(d.ls)) createState.leafShapes = d.ls.slice(0, +createState.count).map(function (v) { return LEAF_SHAPES[v] ? v : null; });
      if (Array.isArray(d.lc)) createState.leafColors = d.lc.slice(0, +createState.count).map(function (c) { return isCustom(c) ? c : null; });
      Array.prototype.forEach.call(groups, function (group) {
        var key = group.getAttribute("data-create-group");
        var value = createState[key];
        var chips = group.querySelectorAll(".create-chip");
        Array.prototype.forEach.call(chips, function (c) {
          c.setAttribute("aria-pressed", c.getAttribute("data-value") === value ? "true" : "false");
        });
        var wrap = group.querySelector("[data-custom-wrap]");
        if (wrap) wrap.classList.toggle("is-active", isCustom(value));
        var input = group.querySelector("[data-create-custom]");
        if (input && isCustom(value)) input.value = value;
      });
    })();

    renderCreate();
  }

})();
