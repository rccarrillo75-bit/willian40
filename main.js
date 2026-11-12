(function () {
'use strict';
var C = window.WILLIAN;
var canvas = document.getElementById('gl');
var renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
} catch (e) {
  document.getElementById('nogl').style.display = 'block';
  document.getElementById('loader').style.display = 'none';
  return;
}
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
var scene = new THREE.Scene();
var SKY = 0xd9e8f2;
scene.background = new THREE.Color(SKY);
scene.fog = new THREE.Fog(SKY, 16, 70);
var camera = new THREE.PerspectiveCamera(70, 1, 0.05, 140);
camera.rotation.order = 'YXZ';

/* ---------- texturas ---------- */
function ctex(w, h, draw, rep) {
  var c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  var t = new THREE.CanvasTexture(c); t.anisotropy = 4;
  if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); }
  return t;
}
/* cerámica rojiza antigua */
var floorTex = ctex(128, 128, function (g, w, h) {
  g.fillStyle = '#7a4a34'; g.fillRect(0, 0, w, h);
  for (var i = 0; i < 2; i++) for (var j = 0; j < 2; j++) {
    var v = ((i * 3 + j * 5) % 4) * 7;
    g.fillStyle = 'rgb(' + (186 + v) + ',' + (98 + v) + ',' + (58 + v / 2) + ')';
    g.fillRect(i * 64 + 2, j * 64 + 2, 60, 60);
  }
}, [8, 12]);
var concreteTex = ctex(128, 128, function (g, w, h) {
  g.fillStyle = '#9a9da1'; g.fillRect(0, 0, w, h);
  for (var i = 0; i < 900; i++) { g.fillStyle = (i % 3 ? 'rgba(40,42,46,' : 'rgba(240,240,240,') + (0.15 + Math.random() * .4) + ')'; g.fillRect(Math.random() * w, Math.random() * h, 1 + Math.random() * 2, 1 + Math.random() * 2); }
  g.strokeStyle = 'rgba(70,60,50,.35)'; g.strokeRect(0, 0, w, h);
}, [2, 10]);
var brickTex = ctex(256, 256, function (g, w, h) {
  g.fillStyle = '#d9c8b4'; g.fillRect(0, 0, w, h);
  for (var r = 0; r < 8; r++) for (var c = -1; c < 5; c++) {
    var x = c * 64 + (r % 2 ? 32 : 0), s = 115 + Math.random() * 35;
    g.fillStyle = 'rgb(' + s + ',' + (s * .42 | 0) + ',' + (s * .3 | 0) + ')';
    g.fillRect(x + 2, r * 32 + 2, 60, 28);
  }
}, [3, 2]);
var rattanTex = ctex(64, 64, function (g, w, h) {
  g.fillStyle = '#b98a4e'; g.fillRect(0, 0, w, h);
  g.strokeStyle = '#8a6030'; g.lineWidth = 2;
  for (var i = 0; i < 64; i += 8) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i + 8, 64); g.stroke(); g.beginPath(); g.moveTo(i + 8, 0); g.lineTo(i, 64); g.stroke(); }
}, [2, 2]);
function stripes(kind) {
  return ctex(128, 128, function (g, w, h) {
    if (kind === 'barca') { for (var i = 0; i < 6; i++) { g.fillStyle = i % 2 ? '#004d98' : '#a50044'; g.fillRect(i * w / 6, 0, w / 6, h); } }
    else if (kind === 'arg') { g.fillStyle = '#75aadb'; g.fillRect(0, 0, w, h); g.fillStyle = '#fff'; g.fillRect(0, h * .34, w, h * .32); g.fillStyle = '#e8b83a'; g.beginPath(); g.arc(w / 2, h / 2, 9, 0, 6.3); g.fill(); }
    else if (kind === 'madrid') { g.fillStyle = '#fff'; g.fillRect(0, 0, w, h); g.fillStyle = '#4b2c82'; g.fillRect(w * .2, 0, w * .12, h); g.fillRect(w * .68, 0, w * .12, h); }
    else { g.fillStyle = '#f6f0e6'; g.fillRect(0, 0, w, h); }
  });
}
function noteTex(l1, l2) {
  return ctex(256, 340, function (g, w, h) {
    g.fillStyle = '#f6efe3'; g.fillRect(0, 0, w, h);
    g.strokeStyle = '#d6b9a6'; g.lineWidth = 3; g.strokeRect(14, 14, w - 28, h - 28);
    g.fillStyle = '#a07866'; g.textAlign = 'center';
    g.font = 'italic 24px Georgia,serif'; g.fillText(l1, w / 2, h / 2 - 6);
    g.font = 'italic 17px Georgia,serif'; g.fillText(l2, w / 2, h / 2 + 24);
  });
}
function signTex() {
  return ctex(512, 300, function (g, w, h) {
    g.fillStyle = '#f6efe3'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#a50044'; g.fillRect(0, 0, w / 3, 10); g.fillStyle = '#004d98'; g.fillRect(w / 3, 0, w / 3, 10); g.fillStyle = '#75aadb'; g.fillRect(2 * w / 3, 0, w / 3, 10);
    g.textAlign = 'center'; g.fillStyle = '#4a2e26';
    g.font = 'italic 24px Georgia,serif'; g.fillText('23 de noviembre de 2026', w / 2, 70);
    g.font = 'bold 52px Georgia,serif'; g.fillText('¡Felices 40 años,', w / 2, 150);
    g.fillText('Willian!', w / 2, 212);
    g.font = 'italic 21px Georgia,serif'; g.fillStyle = '#8a5a4a'; g.fillText('Pasa, esta es tu casa', w / 2, 262);
  });
}
function paintingTex() { /* atardecer rojizo con barquito */
  return ctex(256, 180, function (g, w, h) {
    var gr = g.createLinearGradient(0, 0, 0, h * .62); gr.addColorStop(0, '#d9772f'); gr.addColorStop(.5, '#f0a63a'); gr.addColorStop(1, '#f7d27a');
    g.fillStyle = gr; g.fillRect(0, 0, w, h * .62);
    g.fillStyle = '#ffd27a'; g.beginPath(); g.arc(w * .62, h * .5, 20, 0, 6.3); g.fill();
    g.fillStyle = '#2a1a16'; g.fillRect(0, h * .62, w, h * .38);
    g.fillStyle = '#c4572f'; g.fillRect(w * .5, h * .66, w * .3, 3);
    g.fillStyle = '#120a08'; g.beginPath(); g.moveTo(w * .3, h * .66); g.lineTo(w * .46, h * .66); g.lineTo(w * .43, h * .72); g.lineTo(w * .33, h * .72); g.fill();
    g.fillRect(w * .38, h * .45, 2, h * .21); g.beginPath(); g.moveTo(w * .39, h * .46); g.lineTo(w * .45, h * .62); g.lineTo(w * .39, h * .62); g.fill();
  });
}
function lagoonTex() { /* papel tapiz: laguna oscura entre árboles */
  return ctex(128, 256, function (g, w, h) {
    var gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#2a3b34'); gr.addColorStop(.55, '#15231e'); gr.addColorStop(1, '#0a1210');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.fillStyle = '#0b1613';
    for (var i = 0; i < 9; i++) { var x = 8 + i * 14, ht = 80 + (i % 3) * 30; g.beginPath(); g.moveTo(x, h * .62); g.lineTo(x - 11, h * .62 - ht * .2); g.lineTo(x, h * .62 - ht); g.lineTo(x + 11, h * .62 - ht * .2); g.fill(); }
    g.fillStyle = '#3b5550'; g.fillRect(0, h * .64, w, h * .2);
    g.fillStyle = 'rgba(160,190,180,.25)'; g.fillRect(0, h * .66, w, 3);
  });
}
function argShieldTex() {
  return ctex(128, 256, function (g, w, h) {
    g.fillStyle = '#fbfaf6'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#2f6bc4'; g.beginPath(); g.arc(w / 2, 110, 44, 0, 6.3); g.fill();
    g.fillStyle = '#f2c230'; g.beginPath(); g.arc(w / 2, 110, 28, 0, 6.3); g.fill();
    g.fillStyle = '#75aadb'; g.fillRect(w / 2 - 6, 70, 12, 80);
  });
}
function curtainTex() { /* azul rey con soles amarillos */
  return ctex(128, 128, function (g, w, h) {
    g.fillStyle = '#1a2f7a'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#f2c43a';
    [[32, 32], [96, 96], [96, 20], [24, 100]].forEach(function (p) {
      g.beginPath(); g.arc(p[0], p[1], 9, 0, 6.3); g.fill();
      for (var k = 0; k < 8; k++) { var a = k * .785; g.fillRect(p[0] + Math.cos(a) * 13 - 1.5, p[1] + Math.sin(a) * 13 - 1.5, 3, 3); }
    });
  }, [3, 2]);
}
function bannerTex() { return null; }

/* ---------- materiales ---------- */
function L(c) { return new THREE.MeshLambertMaterial({ color: c }); }
var mBone = L(0xe6dccb), mSal = L(0xeba48c), mYel = L(0xfcf8e2), mSky = L(0x9fd0ee), mWhite = L(0xeeeae2), mWood = L(0x8a5a3c);
var mDark = L(0x2e2420), mLight = L(0xd9a85c), mDarkW = L(0x4a2c1c), mTrim = L(0xfbf7ef), mGold = L(0xd9a93a);
var mFloor = new THREE.MeshLambertMaterial({ map: floorTex });
var mBrick = new THREE.MeshLambertMaterial({ map: brickTex });
var mConc = new THREE.MeshLambertMaterial({ map: concreteTex });
var mRattan = new THREE.MeshLambertMaterial({ map: rattanTex });
var mCeil = new THREE.MeshLambertMaterial({ color: 0xe9e1d3, side: THREE.DoubleSide });
var mGlass = new THREE.MeshLambertMaterial({ color: 0xbfe0ee, transparent: true, opacity: 0.35 });

function box(x, y, z, w, h, d, mat, parent) {
  var m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z); (parent || scene).add(m); return m;
}
function cyl(x, y, z, rt, rb, h, mat, seg, parent) {
  var m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg || 16), mat);
  m.position.set(x, y, z); (parent || scene).add(m); return m;
}
var H = 2.5, DH = 2.05;
/* paredes con caras de distinto color. matE/matW: pared a lo largo de z (caras este y oeste);
   matS/matN para paredes a lo largo de x. huecos: [a,b] puerta o [a,b,y0,y1] ventana */
function faces(a, b, end) { return [a, b, mTrimTop, mTrimTop, end, end]; }
var mTrimTop = mBone;
function wallX(x, z0, z1, gaps, mW, mE, th) {
  th = th || 0.12; mE = mE || mW;
  var M = [mE, mW, mBone, mBone, mBone, mBone];
  gaps = (gaps || []).map(function (g) { return g.length === 2 ? [g[0], g[1], 0, DH] : g; }).sort(function (a, b) { return a[0] - b[0]; });
  var cur = z0;
  function seg(a, b) { box(x, H / 2, (a + b) / 2, th, H, b - a, M); }
  gaps.forEach(function (g) {
    if (g[0] > cur) seg(cur, g[0]);
    if (g[2] > 0) box(x, g[2] / 2, (g[0] + g[1]) / 2, th, g[2], g[1] - g[0], M);
    box(x, (H + g[3]) / 2, (g[0] + g[1]) / 2, th, H - g[3], g[1] - g[0], M);
    cur = g[1];
  });
  if (z1 > cur) seg(cur, z1);
}
function wallZ(z, x0, x1, gaps, mN, mS, th) {
  th = th || 0.12; mS = mS || mN;
  var M = [mBone, mBone, mBone, mBone, mS, mN];
  gaps = (gaps || []).map(function (g) { return g.length === 2 ? [g[0], g[1], 0, DH] : g; }).sort(function (a, b) { return a[0] - b[0]; });
  var cur = x0;
  function seg(a, b) { box((a + b) / 2, H / 2, z, b - a, H, th, M); }
  gaps.forEach(function (g) {
    if (g[0] > cur) seg(cur, g[0]);
    if (g[2] > 0) box((g[0] + g[1]) / 2, g[2] / 2, z, g[1] - g[0], g[2], th, M);
    box((g[0] + g[1]) / 2, (H + g[3]) / 2, z, g[1] - g[0], H - g[3], th, M);
    cur = g[1];
  });
  if (x1 > cur) seg(cur, x1);
}
/* panel con arco redondo. axis 'x': pared a lo largo de x en z fijo; 'z': a lo largo de z en x fijo */
function archPanel(axis, fixed, a, b, c, w, mat, th) {
  th = th || 0.12;
  var len = b - a, sh = new THREE.Shape();
  sh.moveTo(0, 0); sh.lineTo(len, 0); sh.lineTo(len, H); sh.lineTo(0, H); sh.lineTo(0, 0);
  var hole = new THREE.Path(), u0 = c - w / 2 - a, u1 = c + w / 2 - a, r = w / 2, ys = DH - r;
  hole.moveTo(u0, 0); hole.lineTo(u1, 0); hole.lineTo(u1, ys); hole.absarc(c - a, ys, r, 0, Math.PI, false); hole.lineTo(u0, 0);
  sh.holes.push(hole);
  var geo = new THREE.ExtrudeGeometry(sh, { depth: th, bevelEnabled: false, curveSegments: 14 });
  var m = new THREE.Mesh(geo, mat);
  if (axis === 'x') { m.position.set(a, 0, fixed - th / 2); }
  else { m.rotation.y = -Math.PI / 2; m.position.set(fixed - th / 2, 0, a); }
  scene.add(m);
  /* marco del arco en madera oscura */
  var tw = 0.09, ro = new THREE.Shape(), ri = new THREE.Path(), r0 = w / 2 + tw;
  ro.moveTo(c - a - r0, 0); ro.lineTo(c - a + r0, 0); ro.lineTo(c - a + r0, ys); ro.absarc(c - a, ys, r0, 0, Math.PI, false); ro.lineTo(c - a - r0, 0);
  ri.moveTo(u0, 0); ri.lineTo(u1, 0); ri.lineTo(u1, ys); ri.absarc(c - a, ys, r, 0, Math.PI, false); ri.lineTo(u0, 0);
  ro.holes.push(ri);
  var tg = new THREE.ExtrudeGeometry(ro, { depth: th + 0.1, bevelEnabled: false, curveSegments: 14 });
  var tm = new THREE.Mesh(tg, mDarkW);
  if (axis === 'x') { tm.position.set(a, 0, fixed - th / 2 - 0.05); }
  else { tm.rotation.y = -Math.PI / 2; tm.position.set(fixed - th / 2 - 0.05, 0, a); }
  scene.add(tm);
}

/* ---------- suelo, techo ---------- */
var fl = new THREE.Mesh(new THREE.PlaneGeometry(7.7, 9.1), mFloor);
fl.rotation.x = -Math.PI / 2; fl.position.set(3.85, 0, 4.5); scene.add(fl);
var pf = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 16), mConc);
pf.rotation.x = -Math.PI / 2; pf.position.set(-0.65, 0, 3.4); scene.add(pf);
var ce = new THREE.Mesh(new THREE.PlaneGeometry(7.7, 9.1), mCeil);
ce.rotation.x = Math.PI / 2; ce.position.set(3.85, H, 4.5); scene.add(ce);
var cp = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 16), new THREE.MeshLambertMaterial({ color: 0xf6f6f2, side: THREE.DoubleSide }));
cp.rotation.x = Math.PI / 2; cp.position.set(-0.65, H, 3.4); scene.add(cp);
/* piso del baño (azul) */
(function () { var b = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 1.6), L(0x6fa8d8)); b.rotation.x = -Math.PI / 2; b.position.set(1.5, 0.01, 3.85); scene.add(b); })();

/* ---------- pared exterior (pasillo de afuera, amarilla) ---------- */
/* hueco de la reja/puerta: z 8.0 a 9.0 */
wallX(-0.1, -6, 9.4, [[7.95, 9.05, 0, H]], mYel, mYel, 0.06);
wallX(0.06, 0, 7.95, [[0.4, 1.6, 1.9, 2.2]], mBone, mBone, 0.12);
wallZ(9.42, -1.3, 0, [], mYel, mYel, 0.1);         /* pared del fondo del pasillo (el letrero) */
wallZ(-6, -1.3, 0, [], mYel, mYel, 0.1);
/* puertas de vecinos */
[[-1.8], [-4.1]].forEach(function (p) { box(-0.14, 1.0, p[0], 0.03, 2.0, 0.85, mWhite); box(-0.155, 1.0, p[0] + 0.5, 0.01, 2.0, 0.06, mDark); });
/* baranda de hierro a la derecha, altura de codo */
var mRail = L(0x5b3a25);
for (var bi = 0; bi < 34; bi++) box(-1.3, 0.55, -6 + bi * 0.45, 0.03, 1.1, 0.03, mRail);
box(-1.3, 1.1, 1.7, 0.07, 0.05, 15.4, mRail); box(-1.3, 0.08, 1.7, 0.05, 0.05, 15.4, mRail);
[-6, -3, 0, 3, 6, 9].forEach(function (zz) { cyl(-1.3, 1.4, zz, 0.035, 0.035, 2.8, mRail, 8); });
/* letrero de bienvenida en el fondo del pasillo */
(function () {
  var s = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.644), new THREE.MeshBasicMaterial({ map: signTex() }));
  s.position.set(-0.65, 1.5, 9.36); s.rotation.y = Math.PI; scene.add(s);
  box(-0.65, 1.5, 9.375, 1.18, 0.72, 0.03, mWood);
})();
/* entorno: árboles, carros, edificio de enfrente */
var ground = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), L(0x8a8f86)); ground.rotation.x = -Math.PI / 2; ground.position.set(-22, -7.5, 4); scene.add(ground);
function tree(x, z, s, base) {
  box(x, base + 1.4 * s, z, 0.35 * s, 2.8 * s, 0.35 * s, L(0x6b4a32));
  var cr = new THREE.Mesh(new THREE.SphereGeometry(1.7 * s, 10, 8), L(0x6f9a5a)); cr.position.set(x, base + 3.8 * s, z); scene.add(cr);
}
tree(-4.5, 0, 1.6, -7.5); tree(-5.5, 5, 1.8, -7.5); tree(-4.2, -4, 1.4, -7.5); tree(-7, 9, 1.7, -7.5); tree(-6, -7, 1.9, -7.5);
box(-9, -7.0, 1, 1.8, 1.0, 3.6, L(0xb04a3a)); box(-9, -7.0, 6, 1.8, 1.0, 3.6, L(0x3d5a80)); box(-9, -7.0, -3, 1.8, 1.0, 3.6, L(0xdddddd));
box(-26, -1, 4, 0.5, 12, 40, L(0xe6c9b4));
for (var wr = 0; wr < 3; wr++) for (var wc = 0; wc < 9; wc++) box(-25.7, -4 + wr * 3, -12 + wc * 3.6, 0.1, 1.2, 1.6, L(0x6d8ca6));

/* ---------- planta del apartamento ---------- */
/* envolvente */
wallX(7.7, 0, 9.05, [[3.0, 4.2, 0.9, 2.05], [0.3, 1.3, 0.9, 2.05], [6.5, 8.3, 0.9, 2.05]], mBone, mBone);
wallZ(0, 0, 7.7, [], mBone, mBone);
wallZ(9.05, 3.12, 7.7, [], mSal, mSal);   /* pared salmón de la derecha, con ventana ancha */
wallZ(9.05, 1.3, 3.12, [], mBone, mBone);
/* pasillito de entrada (1,10 m) */
wallZ(7.95, 0, 1.3, [], mBone, mYel);                      /* portal exterior (L): pared norte */
wallZ(9.05, 0, 1.3, [], mYel, mBone);                      /* pared sur: puerta del vecino */
wallX(1.3, 7.8, 9.05, [[8.0, 8.85]], mBone, mYel, 0.25);   /* ENTRADA CUADRADA con paredita de 25 cm */
archPanel('z', 3.12, 7.8, 9.05, 8.43, 0.9, mBone);        /* arco redondo: fin de la pared del pasillito -> sala */
(function () { var g = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 1.1), mConc); g.rotation.x = -Math.PI / 2; g.position.set(0.65, 0.006, 8.5); scene.add(g); })();
/* puerta del vecino (cerrada): reja dorada y puerta marrón, en la pared sur del portal */
(function () {
  box(0.65, 1.0, 8.97, 0.85, 2.0, 0.04, L(0x5a3a28));
  box(0.65, 2.03, 8.97, 1.0, 0.06, 0.08, L(0x5a3a28)); box(0.17, 1.0, 8.97, 0.06, 2.0, 0.08, L(0x5a3a28)); box(1.13, 1.0, 8.97, 0.06, 2.0, 0.08, L(0x5a3a28));
  for (var gi = 0; gi < 8; gi++) box(0.27 + gi * 0.1, 1.0, 8.92, 0.02, 1.96, 0.02, mGold);
  box(0.65, 1.97, 8.92, 0.9, 0.04, 0.03, mGold); box(0.65, 0.04, 8.92, 0.9, 0.04, 0.03, mGold); box(0.65, 1.0, 8.92, 0.9, 0.03, 0.03, mGold);
  box(0.65, 0.2, 8.92, 0.9, 0.03, 0.03, mGold); box(0.65, 1.7, 8.92, 0.9, 0.03, 0.03, mGold);
})();
/* cocina (blanca): pared sur con el cuadro, pared este con arco */
wallZ(7.8, 1.3, 3.12, [], mBone, mWhite);
wallZ(4.7, 0, 3.12, [], mWhite, mWhite);
wallZ(7.8, 0, 1.3, [], mWhite, mWhite);
/* pared este de cocina y pasillo de habitaciones, x=3.12 */
wallX(3.12, 0, 5.4, [[2.35, 3.05], [3.4, 4.3]], mBone, mBone);
archPanel('z', 3.12, 5.4, 7.8, 6.65, 0.9, mWhite);
/* sala: tramo hacia las habitaciones, pared norte con arco, z=4.7 */
archPanel('x', 4.7, 3.12, 4.45, 3.78, 0.9, mBone);
wallZ(4.7, 4.45, 7.7, [], mBone, mBone);
/* cuarto de papá: pared del pasillo x=4.45 con puerta, z 3.6-4.5 */
wallX(4.45, 2.1, 4.7, [[3.6, 4.5]], mBone, mBone);
wallZ(2.1, 3.12, 7.7, [[3.45, 4.15]], mBone, mBone);       /* con puerta de mamá */
/* baño: cerrado */
wallZ(3.0, 0, 3.12, [], mBone, mWhite);
/* techo sala alto: zócalos y molduras de yeso */
function molding(x0, z0, x1, z1, mat) {
  var t = 0.1, y = H - 0.05;
  box((x0 + x1) / 2, y, z0 + 0.06, x1 - x0, 0.1, 0.1, mat); box((x0 + x1) / 2, y, z1 - 0.06, x1 - x0, 0.1, 0.1, mat);
  box(x0 + 0.06, y, (z0 + z1) / 2, 0.1, 0.1, z1 - z0, mat); box(x1 - 0.06, y, (z0 + z1) / 2, 0.1, 0.1, z1 - z0, mat);
}
molding(3.18, 4.76, 7.64, 9.0, mTrim);
molding(3.18, 0.06, 7.64, 2.04, mTrim);
/* franjas azules de la habitación de Raúl (3 tonos) */
(function () {
  var cols = [0x7bb6e0, 0x5a9bd0, 0x3f83bd];
  cols.forEach(function (c, i) {
    var y = H - 0.08 - i * 0.16, m = L(c);
    box(1.56, y, 0.08, 3.0, 0.15, 0.03, m); box(1.56, y, 2.92, 3.0, 0.15, 0.03, m);
    box(0.14, y, 1.5, 0.03, 0.15, 2.9, m); box(3.04, y, 1.5, 0.03, 0.15, 2.9, m);
  });
  /* paredes azul cielo de su cuarto (capas interiores) */
  var sky = L(0x9fd0ee);
  box(0.13, 1.0, 1.5, 0.02, 1.4, 2.88, sky); box(1.56, 1.0, 0.075, 2.98, 1.4, 0.02, sky);
  box(3.05, 1.0, 1.0, 0.02, 1.4, 1.9, sky); box(1.56, 1.0, 2.935, 2.98, 1.4, 0.02, sky);
  box(0.13, 2.05, 1.5, 0.02, 0.26, 2.88, sky);
})();
/* ventanas: vidrio claro */
function glass(x, y, z, w, h, rotY) { var g = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: 0xbcd9ea, transparent: true, opacity: 0.55 })); g.position.set(x, y, z); g.rotation.y = rotY; scene.add(g); }
glass(0.125, 2.05, 1.0, 1.2, 0.3, Math.PI / 2);
glass(7.6, 1.5, 3.6, 1.2, 1.15, -Math.PI / 2);
glass(7.6, 1.5, 0.8, 1.0, 1.15, -Math.PI / 2);
glass(7.6, 1.5, 7.4, 1.8, 1.15, -Math.PI / 2);
for (var rj = 0; rj < 7; rj++) box(7.78, 1.5, 6.55 + rj * 0.28, 0.025, 1.1, 0.025, mDark);

/* ---------- puertas ---------- */
function leaf(x, y, z, w, h, rotY, mat) { var g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rotY; scene.add(g); box(w / 2, h / 2, 0, w, h, 0.05, mat, g); return g; }
/* reja dorada hacia afuera (abierta, pegada a la pared norte del portal) y puerta blanca hacia adentro (abierta contra la pared de la cocina) */
(function () {
  var g = new THREE.Group(); g.position.set(1.15, 0, 8.04); g.rotation.y = Math.PI; scene.add(g);
  for (var i = 0; i < 8; i++) box(i * 0.105 + 0.03, 1.0, 0, 0.03, 2.0, 0.03, mGold, g);
  box(0.4, 0.05, 0, 0.85, 0.05, 0.04, mGold, g); box(0.4, 1.95, 0, 0.85, 0.05, 0.04, mGold, g); box(0.4, 1.0, 0, 0.85, 0.04, 0.04, mGold, g);
  leaf(1.43, 0, 7.93, 0.85, 2.0, 0, mWhite);
})();
/* marcos negros */
function frameX(x, z0, z1, h, m) { m = m || mDark; box(x, h / 2, z0 - 0.04, 0.14, h, 0.06, m); box(x, h / 2, z1 + 0.04, 0.14, h, 0.06, m); box(x, h + 0.03, (z0 + z1) / 2, 0.14, 0.06, z1 - z0 + 0.14, m); }
frameX(4.45, 3.6, 4.5, DH);
leaf(4.5, 0, 4.6, 0.9, 2.0, 0, mWhite); /* puerta abierta contra la pared de la derecha */
frameX(3.12, 3.4, 4.3, DH); /* baño sin puerta */
/* puerta de Raúl: blanca con escudo de Argentina, abierta hacia adentro */
(function () {
  frameX(3.12, 2.35, 3.05, DH);
  var g = new THREE.Group(); g.position.set(3.1, 0, 3.0); g.rotation.y = Math.PI; scene.add(g);
  var m = box(0.35, 1.0, 0, 0.7, 2.0, 0.05, [mWhite, mWhite, mWhite, mWhite, new THREE.MeshLambertMaterial({ map: argShieldTex() }), mWhite], g);
})();
/* puerta de mamá: papel tapiz de laguna oscura */
(function () {
  box(3.45, DH / 2, 2.1, 0.06, DH, 0.14, mDark); box(4.15, DH / 2, 2.1, 0.06, DH, 0.14, mDark);
  var g = new THREE.Group(); g.position.set(3.45, 0, 2.1); g.rotation.y = Math.PI / 2; scene.add(g);
  box(0.35, 1.0, 0, 0.7, 2.0, 0.05, [mWhite, mWhite, mWhite, mWhite, new THREE.MeshLambertMaterial({ map: lagoonTex() }), new THREE.MeshLambertMaterial({ map: lagoonTex() })], g);
})();

/* ---------- muebles ---------- */
var cushTex = ctex(64, 64, function (g, w, h) {
  g.fillStyle = '#7a1f2a'; g.fillRect(0, 0, w, h);
  for (var i = 0; i < 14; i++) { g.fillStyle = ['#e8c35a', '#d8a0a0', '#3f6b4a', '#f2e6d0'][i % 4]; g.beginPath(); g.arc(Math.random() * w, Math.random() * h, 3 + Math.random() * 3, 0, 6.3); g.fill(); }
});
var mCush = new THREE.MeshLambertMaterial({ map: cushTex });
function armchair(x, z, rotY) {
  var g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rotY; scene.add(g);
  box(0, 0.3, 0, 0.75, 0.3, 0.75, mRattan, g); box(0, 0.65, -0.33, 0.75, 0.6, 0.1, mRattan, g);
  box(-0.37, 0.45, 0, 0.08, 0.35, 0.7, mRattan, g); box(0.37, 0.45, 0, 0.08, 0.35, 0.7, mRattan, g);
  box(0, 0.5, 0.03, 0.62, 0.1, 0.6, mCush, g);
}
function glassTable(x, z, w, d, h) {
  box(x, h, z, w, 0.03, d, mGlass);
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (s) { box(x + s[0] * (w / 2 - 0.05), h / 2, z + s[1] * (d / 2 - 0.05), 0.05, h, 0.05, mRattan); });
}
function chair(x, z, rotY) {
  var g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rotY; scene.add(g);
  box(0, 0.45, 0, 0.42, 0.06, 0.42, mRattan, g); box(0, 0.78, -0.2, 0.42, 0.6, 0.05, mRattan, g);
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (s) { box(s[0] * 0.18, 0.22, s[1] * 0.18, 0.04, 0.44, 0.04, mRattan, g); });
}
/* sala normal: mesa de ratán con vidrio y 4 sillas */
var nd = scene.children.length;
glassTable(5.6, 6.1, 1.3, 0.85, 0.75);
chair(5.6, 5.45, 0); chair(5.6, 6.75, Math.PI); chair(4.8, 6.1, Math.PI / 2); chair(6.4, 6.1, -Math.PI / 2);
for (var qd = nd; qd < scene.children.length; qd++) scene.children[qd].position.y += 0.18;
/* sala alta: 2 escalones curvos de cerámica rojiza con filo dorado, sofá y sillones de ratán, mesa de vidrio */
(function () {
  function plat(x0, z0, x1, z1, rx, y, h) {
    var w = x1 - x0, d = z1 - z0, sh = new THREE.Shape();
    sh.moveTo(rx, d); sh.absellipse(rx, d / 2, rx, d / 2, Math.PI / 2, Math.PI * 1.5, false); sh.lineTo(w, 0); sh.lineTo(w, d); sh.lineTo(rx, d);
    var g = new THREE.ExtrudeGeometry(sh, { depth: h, bevelEnabled: false, curveSegments: 24 });
    var m = new THREE.Mesh(g, mFloor); m.rotation.x = Math.PI / 2; m.position.set(x0, y + h, z0); scene.add(m);
  }
  plat(4.15, 4.75, 7.7, 9.05, 0.55, 0, 0.18);
  plat(4.85, 7.2, 7.7, 9.05, 0.45, 0.18, 0.18);
  var n0 = scene.children.length;
  box(6.5, 0.6, 8.88, 1.9, 0.5, 0.2, mRattan); box(6.5, 0.95, 8.98, 1.9, 0.7, 0.1, mRattan); box(6.5, 0.5, 8.7, 1.8, 0.14, 0.5, mCush);  /* sofá de ratán bajo la ventana */
  armchair(5.4, 7.7, Math.PI / 2); armchair(7.1, 7.7, -Math.PI / 2);
  glassTable(6.3, 7.85, 0.8, 0.6, 0.9);
  for (var q = n0; q < scene.children.length; q++) scene.children[q].position.y += 0.36;
  /* cortinas ámbar y visillo blanco */
  box(7.58, 1.4, 6.42, 0.1, 1.9, 0.5, L(0x9a6a2a)); box(7.58, 1.4, 8.4, 0.1, 1.9, 0.5, L(0x9a6a2a));
  var sh = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 1.8), new THREE.MeshBasicMaterial({ color: 0xf2f2ee, transparent: true, opacity: 0.5, side: THREE.DoubleSide })); sh.position.set(7.56, 1.4, 7.4); sh.rotation.y = Math.PI / 2; scene.add(sh);
  /* cuadros negros con figura roja junto a la chimenea */
  [[5.7, 1.65, 8.98], [6.55, 1.65, 8.98]].forEach(function (p) {
    var f = new THREE.Group(); f.position.set(p[0], p[1], p[2]); f.rotation.y = Math.PI; scene.add(f);
    box(0, 0, 0, 0.5, 0.65, 0.03, mWhite, f); box(0, 0, 0.016, 0.42, 0.57, 0.01, mDark, f); box(0, -0.03, 0.025, 0.12, 0.35, 0.01, L(0xc8332e), f);
  });
  function rusticTex() {
    return ctex(200, 150, function (g, w, h) {
      g.fillStyle = '#8fd0ee'; g.fillRect(0, 0, w, h); g.fillStyle = '#6fbf4a'; g.fillRect(0, h * .45, w, h * .55);
      g.fillStyle = '#2f8fd8'; g.beginPath(); g.moveTo(w * .35, h); g.quadraticCurveTo(w * .6, h * .75, w * .45, h * .5); g.lineTo(w * .55, h * .5); g.quadraticCurveTo(w * .75, h * .75, w * .7, h); g.fill();
      g.fillStyle = '#f2d36a'; g.fillRect(w * .1, h * .38, 44, 34); g.fillStyle = '#d2432e'; g.beginPath(); g.moveTo(w * .08, h * .38); g.lineTo(w * .1 + 22, h * .22); g.lineTo(w * .1 + 52, h * .38); g.fill();
      g.fillStyle = '#7a4a2a'; g.fillRect(w * .1 + 17, h * .5, 10, 16);
      [[.82, .5, '#e0603a'], [.72, .42, '#f2a62e'], [.9, .62, '#c8368a']].forEach(function (t) { g.fillStyle = '#6b4a2a'; g.fillRect(w * t[0] - 2, h * t[1], 4, 22); g.fillStyle = t[2]; g.beginPath(); g.arc(w * t[0], h * t[1], 14, 0, 6.3); g.fill(); });
      g.fillStyle = '#ffd84a'; g.beginPath(); g.arc(w * .85, h * .15, 10, 0, 6.3); g.fill();
    });
  }
  [5.15, 5.85].forEach(function (x) {
    var f = new THREE.Group(); f.position.set(x, 1.7, 4.78); f.rotation.y = 0; scene.add(f);
    box(0, 0, 0, 0.5, 0.39, 0.03, mWood, f);
    var p = new THREE.Mesh(new THREE.PlaneGeometry(0.44, 0.33), new THREE.MeshBasicMaterial({ map: rusticTex() })); p.position.z = 0.02; f.add(p);
  });
  /* aplique de pared cálido */
  box(7.6, 1.9, 5.9, 0.1, 0.18, 0.1, L(0xffe9b0)); pl(7.2, 1.9, 5.9, 0.3, 4);
})();
/* chimenea semi-redonda de ladrillo en la esquina, con repisa tipo pozo y techito */
(function () {
  var nc = scene.children.length;
  cyl(7.2, 0.55, 5.45, 0.58, 0.58, 1.1, mBrick, 20);
  box(7.2, 0.35, 5.0, 0.5, 0.5, 0.2, mDark); box(7.2, 0.3, 5.03, 0.3, 0.2, 0.05, new THREE.MeshBasicMaterial({ color: 0xff7a2a }));
  cyl(7.2, 1.2, 5.45, 0.62, 0.62, 0.08, mWood, 20);
  cyl(7.2, 1.62, 5.45, 0.4, 0.43, 0.8, mBrick, 16);
  box(7.2, 2.15, 5.45, 0.8, 0.08, 0.9, mWood); box(7.2, 2.25, 5.45, 0.55, 0.12, 0.55, mBrick);
  box(7.5, 1.9, 5.65, 0.05, 0.5, 0.05, mWood); box(6.9, 1.9, 5.25, 0.05, 0.5, 0.05, mWood);
  for (var qc = nc; qc < scene.children.length; qc++) scene.children[qc].position.y += 0.18;
})();
/* pintura del atardecer: en la pared de la entrada de la cocina (cara hacia la sala) */
(function () {
  var p = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.434), new THREE.MeshBasicMaterial({ map: paintingTex() }));
  p.position.set(3.215, 1.5, 7.45); p.rotation.y = Math.PI / 2; scene.add(p);
  box(3.195, 1.5, 7.45, 0.02, 0.5, 0.7, mDark);
})();
/* cocina blanca, apenas se asoma */
box(0.5, 0.45, 5.2, 0.6, 0.9, 1.2, mWhite); box(0.5, 0.45, 6.6, 0.6, 0.9, 1.4, mWhite); box(0.4, 1.0, 5.2, 0.6, 2.0, 0.8, L(0xdcdcdc));
/* lámpara de yeso en el techo de la sala */
cyl(5.45, H - 0.02, 7.0, 0.5, 0.5, 0.03, mTrim, 24); cyl(5.45, H - 0.06, 7.0, 0.28, 0.28, 0.04, mTrim, 20);
(function () { var b = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), new THREE.MeshBasicMaterial({ color: 0xfff0c0 })); b.position.set(5.45, H - 0.14, 7.0); scene.add(b); })();
cyl(3.7, H - 0.02, 3.4, 0.25, 0.25, 0.03, mTrim, 20);
/* banderines y estrellas (guiño a Barça y Argentina) en la pared de la sala */
(function () {
  var shape = new THREE.Shape(); shape.moveTo(0, 1); shape.lineTo(1, 1); shape.lineTo(0.5, 0); shape.lineTo(0, 1);
  var kinds = ['barca', 'bone', 'arg', 'bone', 'barca', 'bone', 'arg'], cache = {};
  kinds.forEach(function (k, i) {
    cache[k] = cache[k] || new THREE.MeshBasicMaterial({ map: stripes(k), side: THREE.DoubleSide });
    var m = new THREE.Mesh(new THREE.ShapeGeometry(shape), cache[k]);
    m.scale.set(0.3, 0.28, 1); m.position.set(7.6, 2.0, 5.9 + i * 0.4); m.rotation.y = -Math.PI / 2 - 0.0; scene.add(m);
    m.position.set(7.62, 2.05, 6.0 + i * 0.4 + 0.15);
  });
  box(7.62, 2.35, 7.2, 0.01, 0.01, 3.0, mDark);
})();
(function () {
  var st = new THREE.Shape();
  for (var i = 0; i < 10; i++) { var r = i % 2 ? 0.04 : 0.09, a = i * Math.PI / 5 - Math.PI / 2; st[i ? 'lineTo' : 'moveTo'](Math.cos(a) * r, Math.sin(a) * r); }
  [0, 1, 2].forEach(function (i) { var m = new THREE.Mesh(new THREE.ShapeGeometry(st), new THREE.MeshBasicMaterial({ color: 0xd9a93a, side: THREE.DoubleSide })); m.position.set(7.62, 1.65, 6.0 + i * 0.16); m.rotation.y = -Math.PI / 2; scene.add(m); });
})();

/* ---------- marcos con fotos ---------- */
var loader = new THREE.TextureLoader(), toLoad = 0, loaded = 0;
function loadTex(src) { toLoad++; return loader.load(src, function () { loaded++; }, undefined, function () { loaded++; }); }
function addFrame(src, l1, l2, x, y, z, rotY, h, aspect) {
  var w = h * aspect, g = new THREE.Group();
  g.add(new THREE.Mesh(new THREE.BoxGeometry(w + 0.1, h + 0.1, 0.04), L(0x6b4a38)));
  var mat = src ? new THREE.MeshBasicMaterial({ map: loadTex(src), color: 0xf2eee8 }) : new THREE.MeshBasicMaterial({ map: noteTex(l1, l2) });
  var p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat); p.position.z = 0.025; g.add(p);
  g.position.set(x, y, z); g.rotation.y = rotY; scene.add(g);
}
function bed(x, z, rotY, len, wid, cover, wood) {
  var g = new THREE.Group(); wood = wood || mWood;
  box(0, 0.22, 0, len, 0.44, wid, wood, g); box(0, 0.5, 0, len - 0.1, 0.18, wid - 0.1, mBone, g);
  box(0.05, 0.6, 0, len - 0.7, 0.06, wid - 0.06, L(cover), g); box(-len / 2 + 0.3, 0.68, 0, 0.45, 0.14, wid - 0.3, mTrim, g);
  box(-len / 2 + 0.03, 0.8, 0, 0.06, 0.8, wid, wood, g);
  g.position.set(x, 0, z); g.rotation.y = rotY; scene.add(g);
}
/* ----- cuarto de papá ----- */
var mPine = L(0xd9b35c);
box(4.78, 1.0, 2.85, 0.5, 2.0, 1.3, mPine); box(5.04, 1.0, 2.85, 0.02, 1.9, 1.2, L(0xe6c677)); /* clóset en la pared de la puerta: solo se ve una esquina */
box(4.52, 1.15, 3.52, 0.02, 0.12, 0.08, mTrim); box(4.52, 1.15, 3.52, 0.025, 0.05, 0.03, mDark); /* apagador */ /* clóset de madera clarita (a la izquierda al entrar) */
bed(7.1, 3.55, Math.PI, 1.9, 1.3, 0xefe7d6, L(0xf2ead8));  /* cama blanco hueso al fondo, bajo la ventana (cabecera al este) */
box(6.05, 0.3, 4.52, 0.9, 0.6, 0.4, mPine); box(6.05, 0.85, 4.55, 0.8, 0.5, 0.06, mDark); /* TV */
/* cortina azul rey con soles */
box(7.6, 1.35, 2.7, 0.05, 1.7, 0.4, new THREE.MeshLambertMaterial({ map: curtainTex() })); box(7.6, 1.35, 4.5, 0.05, 1.7, 0.4, new THREE.MeshLambertMaterial({ map: curtainTex() }));
/* techo azul oscuro con estrellas */
(function () {
  var c = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 2.6), new THREE.MeshBasicMaterial({ color: 0x15204f, side: THREE.DoubleSide }));
  c.rotation.x = Math.PI / 2; c.position.set(6.08, H - 0.01, 3.4); scene.add(c);
  var sm = new THREE.MeshBasicMaterial({ color: 0xcdf6a6 }), sg = new THREE.SphereGeometry(0.028, 5, 4);
  for (var i = 0; i < 46; i++) { var s = new THREE.Mesh(sg, sm); s.position.set(4.55 + Math.random() * 3.0, H - 0.03, 2.2 + Math.random() * 2.4); scene.add(s); }
})();
/* copa de Champions del Real Madrid en pedestal y bufanda en la pared */
(function () {
  var mSil = new THREE.MeshLambertMaterial({ color: 0xcfd4dc, emissive: 0x30343a });
  box(7.4, 0.5, 2.4, 0.5, 1.0, 0.5, mWhite);
  cyl(7.4, 1.04, 2.4, 0.16, 0.12, 0.06, mSil, 12); cyl(7.4, 1.22, 2.4, 0.03, 0.03, 0.3, mSil, 8);
  cyl(7.4, 1.52, 2.4, 0.15, 0.07, 0.3, mSil, 14);
  [-1, 1].forEach(function (k) { var t = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.018, 6, 14), mSil); t.position.set(7.4 + k * 0.17, 1.52, 2.4); scene.add(t); });
  var s = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.9), new THREE.MeshBasicMaterial({ map: stripes('madrid'), side: THREE.DoubleSide }));
  s.position.set(7.0, 1.7, 2.17); scene.add(s);
})();
addFrame('fotos/papa1.jpg', '', '', 6.45, 1.5, 2.17, 0, 0.9, 498 / 670);
addFrame('fotos/papa2.jpg', '', '', 6.05, 1.8, 4.63, Math.PI, 0.9, 498 / 662);
addFrame('fotos/papa3.jpg', '', '', 7.05, 1.55, 4.63, Math.PI, 0.9, 720 / 888);
addFrame('fotos/papa4.jpg', '', '', 5.6, 1.5, 2.17, 0, 0.9, 498 / 664);
/* ----- cuarto de Raúl ----- */
(function () {
  var dk = L(0x5a3320);
  [0.25, 1.25].forEach(function (y) { box(1.2, y + 0.2, 0.55, 1.9, 0.12, 0.9, dk); box(1.2, y + 0.3, 0.55, 1.8, 0.1, 0.8, L(0xcfd9e6)); });
  [[0.3, 0.15], [2.1, 0.15], [0.3, 0.95], [2.1, 0.95]].forEach(function (p) { box(p[0], 0.9, p[1], 0.07, 1.8, 0.07, dk); });
  box(2.75, 1.1, 0.3, 0.45, 0.05, 0.4, dk);                                   /* flotante marrón */
  box(2.75, 1.32, 0.32, 0.3, 0.3, 0.25, L(0x2a2a30));                          /* televisor antiguo */
  [0x6a8fb8, 0xc45a3a, 0xe0c060, 0x4a7a5a].forEach(function (c, i) { box(2.62 + i * 0.07, 1.2, 0.3, 0.05, 0.22, 0.2, L(c)); });
  box(2.3, H / 2, 2.8, 0.12, H, 0.5, L(0xa9cfe6));                          /* paredita de concreto pintado frente a la puerta */
  box(1.95, 1.0, 2.75, 0.3, 2.0, 0.5, L(0x4a2c1c));                           /* clóset pequeño de madera, detrás */

})();
addFrame('fotos/hermano1.jpg', '', '', 0.14, 1.15, 1.15, Math.PI / 2, 0.4, 0.992);
addFrame('fotos/hermano2.jpg', '', '', 0.14, 1.15, 1.85, Math.PI / 2, 0.4, 1.000);
addFrame('fotos/hermano3.jpg', '', '', 0.14, 1.15, 2.55, Math.PI / 2, 0.4, 0.751);
addFrame('fotos/hermano4.jpg', '', '', 0.14, 1.7, 1.15, Math.PI / 2, 0.4, 1.301);
addFrame('fotos/hermano5.jpg', '', '', 0.14, 1.7, 1.85, Math.PI / 2, 0.4, 0.750);
addFrame('fotos/hermano6.jpg', '', '', 0.14, 1.7, 2.55, Math.PI / 2, 0.4, 1.023);
/* ----- cuarto de mamá ----- */
(function () {
  box(3.65, 1.05, 1.3, 1.0, 2.1, 0.1, L(0xeeeadc));                           /* paredita-clóset */
  box(3.65, 1.0, 1.36, 0.8, 1.7, 0.02, new THREE.MeshLambertMaterial({ color: 0xc4d0d8, emissive: 0x56626a }));/* espejo de frente a la puerta */
  box(5.7, 0.8, 0.8, 1.45, 0.4, 2.0, L(0xefe7d6));                             /* cama debajo de «Mamá» */
  box(5.7, 0.62, 0.7, 1.4, 0.2, 1.8, L(0xd9a0a0));
  box(7.3, 0.55, 0.45, 0.8, 0.1, 0.45, mDarkW);                                /* máquina de coser antigua */
  box(7.3, 0.28, 0.45, 0.7, 0.55, 0.4, mDarkW);
  box(6.5, 0.4, 1.9, 1.3, 0.8, 0.35, mDarkW); box(6.5, 1.2, 2.02, 1.0, 0.8, 0.04, L(0xcfe3ee)); /* peinadora con espejo */
  box(5.1, 0.75, 1.9, 0.8, 0.5, 0.4, L(0x2a2a30));                              /* televisor */
  box(5.85, 2.18, 1.9, 4.1, 0.06, 0.3, mTrim);                                  /* pestaña de cemento arriba */
})();
(function () { /* barras paralelas rojas junto a la ventana, pared del fondo del cuarto de mamá */
  [1.45, 1.75].forEach(function (z) {
    box(7.44, 1.3, z, 0.4, 0.04, 0.04, L(0xc8201e));
    var d = box(7.46, 1.12, z, 0.34, 0.03, 0.03, L(0x3a3a3a)); d.rotation.z = -0.55;
  });
})();
addFrame('fotos/mama1.jpg', '', '', 3.95, 1.6, 0.07, 0, 0.7, 1.091);
addFrame('fotos/mama2.jpg', '', '', 4.7, 1.6, 0.07, 0, 0.7, 0.780);
addFrame('fotos/mama3.jpg', '', '', 5.45, 1.6, 0.07, 0, 0.7, 0.750);
addFrame('fotos/mama4.jpg', '', '', 6.2, 1.6, 0.07, 0, 0.7, 0.750);
addFrame('fotos/mama5.jpg', '', '', 6.95, 1.6, 0.07, 0, 0.7, 0.750);
addFrame('fotos/mama6.jpg', '', '', 7.5, 1.6, 0.07, 0, 0.7, 0.870);
(function () { var b = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 8), new THREE.MeshBasicMaterial({ color: 0xfff0c0 })); b.position.set(1.5, H - 0.12, 1.5); scene.add(b); })();

/* ---------- luces ---------- */
scene.add(new THREE.HemisphereLight(0xfff1e6, 0xdcc0ac, 0.8));
function pl(x, y, z, i, d) { var l = new THREE.PointLight(0xffe0c0, i, d, 1.5); l.position.set(x, y, z); scene.add(l); }
pl(5.4, 2.1, 7.0, 0.35, 8); pl(3.8, 2.1, 4.0, 0.3, 6); pl(5.7, 2.1, 3.4, 0.35, 5); pl(1.5, 2.1, 1.5, 0.35, 5); pl(5.5, 2.1, 1.0, 0.35, 6); pl(2.0, 2.1, 8.5, 0.3, 5);
var sun = new THREE.DirectionalLight(0xfff0dd, 0.25); sun.position.set(-3, 8, 10); scene.add(sun);

/* ---------- recorrido ---------- */
/* id, x, y, z, giro (0 norte, 90 este, 180 sur, 270 oeste), inclinación, peso */
var KF = [
  ['start', -0.65, 1.7, -5.0, 180, -1, 0],
  ['porch', -0.65, 1.7, 0.5, 180, 0, 3.5],
  ['sign', -0.65, 1.7, 5.4, 180, 0, 3],
  ['door-pre', -0.65, 1.65, 7.5, 180, 0, 2],
  ['door-turn', -0.65, 1.65, 8.5, 90, 0, 1.5],
  ['door', 0.05, 1.65, 8.5, 90, 0, 1.2],
  ['arch', 0.9, 1.65, 8.5, 80, 0, 1.3],
  ['sala-in', 1.7, 1.65, 8.5, 62, 0, 1.5],
  ['alta', 3.0, 1.65, 8.45, 105, 0, 2],
  ['cuadro', 4.0, 1.6, 8.2, -48, 0, 3.5],
  ['cuadro2', 3.85, 1.6, 8.05, -45, 0, 3.5],
  ['turn-n', 3.8, 1.65, 8.3, 0, 0, 2],
  ['sala-n', 3.8, 1.65, 6.7, 0, 0, 2],
  ['chim', 3.9, 1.65, 6.2, 72, 0, 2.5],
  ['sala-n2', 3.8, 1.65, 5.2, 0, 0, 2],
  ['arch2', 3.78, 1.65, 4.7, 0, 0, 1.2],
  ['papa-pre', 3.8, 1.65, 4.05, 90, 0, 1.8],
  ['papa-door', 4.45, 1.65, 4.05, 90, 0, 1.2],
  ['papa1', 5.4, 1.55, 3.6, 90, 0, 3],
  ['papa2', 5.4, 1.55, 3.3, 52, 0, 3],
  ['papa3', 5.6, 1.55, 3.4, 200, 0, 3],
  ['papa4', 5.6, 1.55, 3.4, 135, 0, 3],
  ['papa5', 6.0, 1.55, 3.3, 340, 0, 3],
  ['papa-out', 4.45, 1.65, 4.05, 270, 0, 3],
  ['corr2', 3.8, 1.65, 3.8, 360, 0, 1.8],
  ['bro-pre', 3.8, 1.65, 2.7, 270, 0, 1.5],
  ['bro-door', 3.12, 1.65, 2.7, 270, 0, 2],
  ['bro-in', 2.85, 1.65, 2.5, 300, 0, 2.6],
  ['bro-r', 2.75, 1.6, 1.4, 335, 0, 2.6],
  ['bro1', 1.8, 1.55, 1.2, 285, 0, 4.5],
  ['bro2', 1.8, 1.55, 1.2, 345, 0, 4.5],
  ['bro3', 1.8, 1.55, 1.2, 395, 0, 4.5],
  ['bro-back', 2.8, 1.6, 1.3, 450, 0, 3],
  ['bro-door2', 2.85, 1.65, 2.5, 450, 0, 2.6],
  ['bro-out', 3.5, 1.65, 2.7, 450, 0, 2.6],
  ['corr3', 3.8, 1.65, 2.5, 360, 0, 1.2],
  ['mama-door', 3.8, 1.65, 2.1, 360, 0, 1.2],
  ['mama0', 3.8, 1.65, 1.85, 360, 0, 2.5],
  ['mama2', 4.7, 1.6, 1.75, 450, 0, 2.5],
  ['mama3', 5.6, 1.6, 1.7, 365, 0, 3],
  ['mama4', 6.4, 1.6, 1.6, 402, 0, 3],
  ['mama5', 6.0, 1.6, 1.65, 395, 0, 3],
  ['end', 5.5, 1.7, 1.7, 380, 0, 3]
];
var cum = [], total = 0, idx = {};
KF.forEach(function (k, i) { total += k[6]; cum.push(total); idx[k[0]] = i; });
cum = cum.map(function (c) { return c / total; });
function cr(a, b, c, d, t) {
  return 0.5 * ((2 * b) + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t * t + (-a + 3 * b - 3 * c + d) * t * t * t);
}
function posAt(p) {
  p = Math.max(0, Math.min(1, p));
  var i = 0; while (i < cum.length - 2 && p > cum[i + 1]) i++;
  var s = Math.max(0, Math.min(1, (p - cum[i]) / (cum[i + 1] - cum[i])));
  var a = KF[Math.max(0, i - 1)], b = KF[i], c = KF[i + 1], d = KF[Math.min(KF.length - 1, i + 2)];
  return {
    x: cr(a[1], b[1], c[1], d[1], s), y: cr(a[2], b[2], c[2], d[2], s), z: cr(a[3], b[3], c[3], d[3], s),
    yaw: cr(a[4], b[4], c[4], d[4], s), pitch: cr(a[5], b[5], c[5], d[5], s)
  };
}
window.__walk = posAt; window.__cum = cum; window.__idx = idx;

/* ---------- tarjetas ---------- */
var cardsEl = document.getElementById('cards'), lb = document.getElementById('lb');
function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
var cards = C.scenes.map(function (s) {
  var el = document.createElement('div');
  el.className = 'card' + (s.center ? ' center' : '') + (s.pending ? ' pending' : '');
  var h = '<p class="k">' + esc(s.kicker) + '</p><h2>' + esc(s.title) + '</h2><div class="rule"></div><p>' + esc(s.text) + '</p>';
  if (s.sign) h += '<p class="sg">' + esc(s.sign) + '</p>';
  if (s.photos) h += '<div class="thumbs">' + s.photos.map(function (p, i) { return '<img src="' + esc(p.src) + '" alt="' + esc(p.cap) + '" data-i="' + i + '">'; }).join('') + '</div>';
  if (s.songs) h += '<div class="songs">' + s.songs.map(function (g) { return '<a href="' + esc(g.url) + '" target="_blank" rel="noopener">🎵 ' + esc(g.label) + '</a>'; }).join('') + '</div>';
  if (s.hint) h += '<div class="hint">' + esc(s.hint) + ' ↓</div>';
  el.innerHTML = h; cardsEl.appendChild(el);
  if (s.photos) el.querySelectorAll('img').forEach(function (im) {
    im.addEventListener('click', function () { lb.querySelector('img').src = im.src; lb.querySelector('span').textContent = im.alt; lb.classList.add('on'); });
  });
  var a = s.from === 'start' ? -1 : cum[idx[s.from]], b = s.last ? 1.01 : cum[idx[s.to]];
  return { el: el, a: a, b: b, s: s };
});
lb.addEventListener('click', function () { lb.classList.remove('on'); });

var navEl = document.getElementById('nav'), chips = [];
C.nav.forEach(function (n) {
  var b = document.createElement('button'); b.textContent = n.label;
  b.addEventListener('click', function () { goTo(cum[idx[n.go]]); });
  navEl.appendChild(b); chips.push({ b: b, p: cum[idx[n.go]] });
});
var PER = 0.4, space = document.getElementById('space'), maxScroll = 1;
function resize() {
  var w = window.innerWidth, h = window.innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h; camera.fov = w / h < 0.8 ? 78 : 62; camera.updateProjectionMatrix();
  space.style.height = Math.round(total * PER * h + h) + 'px';
  maxScroll = Math.max(1, document.documentElement.scrollHeight - h);
}
function goTo(p) { window.scrollTo({ top: p * maxScroll, behavior: 'smooth' }); }
window.addEventListener('resize', resize); resize();

/* minimapa */
var mapC = document.getElementById('map'), mg = mapC.getContext('2d');
var rooms = [
  [0, 0, 3.12, 3.0, 'Hermano', '#9fd0ee'], [3.12, 0, 4.58, 2.1, 'Mamá', '#f1e6d6'], [4.45, 2.1, 3.25, 2.6, 'Papá', '#f1e6d6'],
  [3.12, 2.1, 1.33, 2.6, '', '#f1e6d6'], [0, 3.0, 3.12, 1.7, '', '#d7e6f2'], [0, 4.7, 3.12, 3.1, '', '#fff'],
  [3.12, 4.7, 4.58, 4.35, 'Sala', '#eba48c'], [0, 7.8, 3.12, 1.25, '', '#f1e6d6'], [-1.3, -6, 1.3, 15.4, '', '#e6c85a']
];
function drawMap(pos) {
  var W = mapC.width, Hh = mapC.height, x0 = -1.6, x1 = 8, z0 = -6.2, z1 = 9.6;
  var sx = W / (x1 - x0), sz = Hh / (z1 - z0);
  mg.clearRect(0, 0, W, Hh);
  rooms.forEach(function (r) {
    mg.fillStyle = r[5]; mg.strokeStyle = '#8a5a4a'; mg.lineWidth = 1;
    var X = (r[0] - x0) * sx, Z = (r[1] - z0) * sz;
    mg.fillRect(X, Z, r[2] * sx, r[3] * sz); mg.strokeRect(X, Z, r[2] * sx, r[3] * sz);
    if (r[4]) { mg.fillStyle = '#4a2e26'; mg.font = '13px Georgia'; mg.textAlign = 'center'; mg.fillText(r[4], X + r[2] * sx / 2, Z + r[3] * sz / 2 + 4); }
  });
  var px = (pos.x - x0) * sx, pz = (pos.z - z0) * sz, a = pos.yaw * Math.PI / 180;
  mg.fillStyle = '#004d98'; mg.beginPath(); mg.arc(px, pz, 6, 0, 6.3); mg.fill();
  mg.strokeStyle = '#a50044'; mg.lineWidth = 3; mg.beginPath(); mg.moveTo(px, pz); mg.lineTo(px + Math.sin(a) * 18, pz - Math.cos(a) * 18); mg.stroke();
}

/* ---------- bucle ---------- */
var target = 0, cur = 0, progEl = document.getElementById('prog');
function readScroll() { target = Math.max(0, Math.min(1, window.scrollY / maxScroll)); }
window.addEventListener('scroll', readScroll, { passive: true }); readScroll();
function frame() {
  cur += (target - cur) * 0.06;
  if (Math.abs(target - cur) < 0.00005) cur = target;
  var s = posAt(cur);
  camera.position.set(s.x, s.y, s.z);
  camera.rotation.y = -s.yaw * Math.PI / 180;
  camera.rotation.x = s.pitch * Math.PI / 180;
  renderer.render(scene, camera);
  progEl.style.transform = 'scaleX(' + cur.toFixed(4) + ')';
  var f = 0.012;
  cards.forEach(function (c) {
    var on = cur >= c.a + f * 0.5 && cur <= c.b - f * 0.2;
    if (c.on !== on) { c.on = on; c.el.classList.toggle('on', on); }
  });
  var act = -1; chips.forEach(function (c, i) { if (cur >= c.p - 0.001) act = i; });
  chips.forEach(function (c, i) { c.b.classList.toggle('on', i === act); });
  drawMap(s);
  requestAnimationFrame(frame);
}
function ready() { return toLoad === 0 || loaded >= toLoad; }
var t0 = Date.now();
(function wait() {
  if (ready() || Date.now() - t0 > 6000) { document.getElementById('loader').classList.add('off'); frame(); }
  else setTimeout(wait, 120);
})();
window.__setProgress = function (p) { target = cur = p; };
})();
