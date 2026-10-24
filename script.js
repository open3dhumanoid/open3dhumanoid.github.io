/* ==========================================================================
   Lorem Ipsum — generated plotter art
   Every <path data-art="key"> in index.html gets its "d" attribute from
   buildArt()[key] (dotted keys like "tape.holes" reach into nested objects).
   ========================================================================== */
(function () {
  'use strict';

  const TAU = Math.PI * 2;
  const DEG = Math.PI / 180;

  /* ---------- path helpers ---------- */
  const f = (n) => n.toFixed(1);
  const polyline = (pts) => pts.map((p, i) => (i ? 'L' : 'M') + f(p[0]) + ' ' + f(p[1])).join('');
  const circle = (cx, cy, r) =>
    `M${f(cx - r)} ${f(cy)}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;
  const segment = (x1, y1, x2, y2) => `M${f(x1)} ${f(y1)}L${f(x2)} ${f(y2)}`;

  /* Brand mark: 1:2 Lissajous figure, x = sin t, y = sin 2t */
  function logo() {
    const pts = [];
    for (let t = 0; t <= TAU + 1e-4; t += Math.PI / 60) {
      pts.push([20 + 12 * Math.sin(t), 20 + 12 * Math.sin(2 * t)]);
    }
    return polyline(pts);
  }

  /* Hero: protractor ticks every 5°, outside the Vitruvian circle (r = 231) */
  function protractorTicks() {
    let d = '';
    for (let i = 0; i < 72; i++) {
      const a = i * 5 * DEG;
      const len = i % 6 === 0 ? 16 : i % 2 === 0 ? 9 : 5;
      d += segment(
        300 + 231 * Math.cos(a), 300 + 231 * Math.sin(a),
        300 + (231 + len) * Math.cos(a), 300 + (231 + len) * Math.sin(a)
      );
    }
    return d;
  }

  /* Card A.01: Maurer rose — chords of r = sin(6θ) taken at θ_k = 71k° */
  function maurerRose() {
    const rose = (th) => 68 * Math.sin(6 * th);
    const chords = [];
    const curve = [];
    for (let k = 0; k <= 360; k++) {
      const th = k * 71 * DEG;
      chords.push([100 + rose(th) * Math.cos(th), 80 + rose(th) * Math.sin(th)]);
    }
    for (let k = 0; k <= 720; k++) {
      const th = k * Math.PI / 360;
      curve.push([100 + rose(th) * Math.cos(th), 80 + rose(th) * Math.sin(th)]);
    }
    return { maurer: polyline(chords), rose: polyline(curve) };
  }

  /* Card A.02: moiré — two sets of concentric circles, centres 32 units apart */
  function moire() {
    let a = '';
    let b = '';
    for (let r = 4; r <= 140; r += 5) {
      a += circle(84, 80, r);
      b += circle(116, 80, r);
    }
    return { moire1: a, moire2: b };
  }

  /* Card A.03: tesseract — rotate in the XW and YW planes, project 4D → 3D → 2D.
     Edges along the w axis go in their own path so they can be drawn in red. */
  function tesseract() {
    const pts = [];
    for (let i = 0; i < 16; i++) {
      const x = i & 1 ? 1 : -1, y = i & 2 ? 1 : -1, z = i & 4 ? 1 : -1, w = i & 8 ? 1 : -1;
      const a1 = 0.6, a2 = 0.45, a3 = 0.5, a4 = 0.35;
      const x1 = x * Math.cos(a1) - w * Math.sin(a1);
      const w1 = x * Math.sin(a1) + w * Math.cos(a1);
      const y1 = y * Math.cos(a2) - w1 * Math.sin(a2);
      const w2 = y * Math.sin(a2) + w1 * Math.cos(a2);
      const k4 = 1 / (3 - w2); // 4D perspective
      const X = x1 * k4, Y = y1 * k4, Z = z * k4;
      const X2 = X * Math.cos(a3) + Z * Math.sin(a3);
      const Z2 = -X * Math.sin(a3) + Z * Math.cos(a3);
      const Y2 = Y * Math.cos(a4) - Z2 * Math.sin(a4);
      const Z3 = Y * Math.sin(a4) + Z2 * Math.cos(a4);
      const k3 = 1 / (2.6 - Z3); // 3D perspective
      pts.push([100 + X2 * k3 * 110, 80 + Y2 * k3 * 110]);
    }
    let cube = '';
    let wEdges = '';
    for (let i = 0; i < 16; i++) {
      for (let bit = 0; bit < 4; bit++) {
        const j = i ^ (1 << bit); // vertices differing in one coordinate share an edge
        if (j <= i) continue;
        const s = segment(pts[i][0], pts[i][1], pts[j][0], pts[j][1]);
        if (bit === 3) wEdges += s; else cube += s;
      }
    }
    return { tessA: cube, tessW: wEdges };
  }

  /* Card A.04: dipole — short strokes along the unit field E/|E| on a grid */
  function dipoleField() {
    const charges = [[64, 80, 1], [136, 80, -1]];
    let d = '';
    for (let gx = 6; gx < 200; gx += 11) {
      for (let gy = 6; gy < 160; gy += 11) {
        let ex = 0, ey = 0, near = false;
        for (const [cx, cy, q] of charges) {
          const dx = gx - cx, dy = gy - cy, r2 = dx * dx + dy * dy;
          if (r2 < 144) near = true;
          const r3 = Math.pow(r2, 1.5) || 1;
          ex += q * dx / r3;
          ey += q * dy / r3;
        }
        if (near) continue;
        const m = Math.hypot(ex, ey) || 1;
        const ux = (ex / m) * 4, uy = (ey / m) * 4;
        d += segment(gx - ux, gy - uy, gx + ux, gy + uy);
      }
    }
    return d;
  }

  /* CTA: two radial line fields, offset centres, counter-rotated by CSS → moiré */
  function rays() {
    let a = '';
    let b = '';
    for (let i = 0; i < 90; i++) {
      const t = i * Math.PI / 90, c = Math.cos(t), s = Math.sin(t);
      a += segment(200 - 184 * c, 200 - 184 * s, 200 + 184 * c, 200 + 184 * s);
      b += segment(208 - 172 * c, 194 - 172 * s, 208 + 172 * c, 194 + 172 * s);
    }
    return { rays: a, rays2: b };
  }

  /* Paper tape: 8-level ASCII (7 data bits + even parity), sprocket holes
     between tracks 3 and 4. The message is doubled so the CSS translateX(-50%)
     loop is seamless. */
  function paperTape() {
    const msg = 'LOREM IPSUM DOLOR SIT AMET CONSECTETUR ADIPISCING ELIT SED DO EIUSMOD TEMPOR INCIDIDUNT UT LABORE ET DOLORE MAGNA ALIQUA UT ENIM AD MINIM VENIAM ';
    const cols = (msg + msg).split('');
    const rowsY = [18, 30, 42, 54, 66, 78, 90, 102, 114];
    let holes = '';
    let feed = '';
    cols.forEach((ch, c) => {
      const x = 7 + c * 14;
      const code = ch.charCodeAt(0) & 127;
      let ones = 0;
      for (let b = 0; b < 7; b++) if ((code >> b) & 1) ones++;
      const bits = [
        code & 1, (code >> 1) & 1, (code >> 2) & 1,
        -1, // sprocket track
        (code >> 3) & 1, (code >> 4) & 1, (code >> 5) & 1, (code >> 6) & 1,
        ones % 2 // even parity
      ];
      bits.forEach((bit, r) => {
        if (bit === -1) feed += circle(x, rowsY[r], 1.8);
        else if (bit) holes += circle(x, rowsY[r], 4);
      });
    });
    const w = cols.length * 14;
    return { w, holes, feed, edge: `M0 6H${w}M0 122H${w}` };
  }

  function buildArt() {
    const tape = paperTape();
    return {
      logo: logo(),
      ticks: protractorTicks(),
      ...maurerRose(),
      ...moire(),
      ...tesseract(),
      field: dipoleField(),
      ...rays(),
      tape,
      tapeEdge: tape.edge
    };
  }

  /* ---------- render ---------- */
  const lookup = (obj, path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);

  function render() {
    const art = buildArt();

    document.querySelectorAll('[data-art]').forEach((el) => {
      const d = lookup(art, el.dataset.art);
      if (typeof d === 'string') el.setAttribute('d', d);
    });

    const tapeSvg = document.querySelector('[data-tape]');
    if (tapeSvg) {
      tapeSvg.setAttribute('width', art.tape.w);
      tapeSvg.setAttribute('viewBox', `0 0 ${art.tape.w} 128`);
    }
  }

  /* ---------- sign-up form (placeholder: no backend yet) ---------- */
  function initSignup() {
    const form = document.querySelector('.signup');
    if (!form) return;
    const status = form.querySelector('.signup-status');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (status) status.textContent = 'Lorem ipsum dolor sit amet.';
      form.reset();
    });
  }

  render();
  initSignup();
})();
