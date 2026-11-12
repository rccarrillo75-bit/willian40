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
var SKY = 0xdfeaf2;
scene.background = new THREE.Color(SKY);
scene.fog = new THREE.Fog(SKY, 14, 60);
var camera = new THREE.PerspectiveCamera(70, 1, 0.05, 120);
camera.rotation.order = 'YXZ';

/* ---------- texturas ---------- */
function ctex(w, h, draw, rep) {
  var c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  var t = new THREE.CanvasTexture(c); t.anisotropy = 4;
  if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); }
  return t;
}
var floorTex = ctex(256, 256, function (g, w, h) {
  g.fillStyle = '#cdb99f'; g.fillRect(0, 0, w, h);
  for (var i = 0; i < 2; i++) for (var j = 0; j < 2; j++) {
    g.fillStyle = (i + j) % 2 ? '#d6c4a8' : '#c6b195';
    g.fillRect(i * 128 + 3, j * 128 + 3, 122, 122);
  }
}, [18, 30]);
var porchTex = ctex(128, 128, function (g, w, h) {
  g.fillStyle = '#cfc6bb'; g.fillRect(0, 0, w, h);
  for (var i = 0; i < 400; i++) { g.fillStyle = 'rgba(90,80,70,' + Math.random() * .12 + ')'; g.fillRect(Math.random() * w, Math.random() * h, 2, 2); }
}, [6, 8]);
var brickTex = ctex(256, 256, function (g, w, h) {
  g.fillStyle = '#d9c8b4'; g.fillRect(0, 0, w, h);
  var bh = 32, bw = 64;
  for (var r = 0; r < 8; r++) for (var c = -1; c < 5; c++) {
    var x = c * bw + (r % 2 ? bw / 2 : 0);
    var s = 120 + Math.random() * 35;
    g.fillStyle = 'rgb(' + s + ',' + (s * .42 | 0) + ',' + (s * .3 | 0) + ')';
    g.fillRect(x + 2, r * bh + 2, bw - 4, bh - 4);
  }
}, [2, 4]);
function stripes(kind) {
  return ctex(128, 128, function (g, w, h) {
    if (kind === 'barca') {
      for (var i = 0; i < 6; i++) { g.fillStyle = i % 2 ? '#004d98' : '#a50044'; g.fillRect(i * w / 6, 0, w / 6, h); }
    } else if (kind === 'arg') {
      g.fillStyle = '#75aadb'; g.fillRect(0, 0, w, h);
      g.fillStyle = '#ffffff'; g.fillRect(0, h * .34, w, h * .32);
      g.fillStyle = '#e8b83a'; g.beginPath(); g.arc(w / 2, h / 2, 9, 0, 6.3); g.fill();
    } else { g.fillStyle = '#f6f0e6'; g.fillRect(0, 0, w, h); }
  });
}
function noteTex(line1, line2) {
  return ctex(256, 340, function (g, w, h) {
    g.fillStyle = '#f6efe3'; g.fillRect(0, 0, w, h);
    g.strokeStyle = '#d6b9a6'; g.lineWidth = 3; g.strokeRect(14, 14, w - 28, h - 28);
    g.fillStyle = '#a07866'; g.textAlign = 'center';
    g.font = 'italic 24px Georgia,serif'; g.fillText(line1, w / 2, h / 2 - 6);
    g.font = 'italic 17px Georgia,serif'; g.fillText(line2, w / 2, h / 2 + 24);
  });
}
function ballTex() {
  return ctex(256, 128, function (g, w, h) {
    g.fillStyle = '#fafafa'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#222';
    for (var i = 0; i < 14; i++) {
      var x = (i % 7) * 40 + (i > 6 ? 20 : 0) + 10, y = i > 6 ? 90 : 38;
      g.beginPath(); for (var k = 0; k < 5; k++) { var a = k * 1.2566 - 1.5708; g.lineTo(x + Math.cos(a) * 12, y + Math.sin(a) * 12); } g.fill();
    }
  });
}

/* ---------- materiales ---------- */
function L(c) { return new THREE.MeshLambertMaterial({ color: c }); }
var mSal = L(0xe8a994), mHue = L(0xeee6d8), mWood = L(0x8a5a3c), mDark = L(0x3a2a24), mTrim = L(0xfbf7ef);
var mFloor = new THREE.MeshLambertMaterial({ map: floorTex });
var mBrick = new THREE.MeshLambertMaterial({ map: brickTex });
var mPorch = new THREE.MeshLambertMaterial({ map: porchTex });
var mCeil = new THREE.MeshLambertMaterial({ color: 0xf3ede2, side: THREE.DoubleSide });

function box(x, y, z, w, h, d, mat, parent) {
  var m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z); (parent || scene).add(m); return m;
}
var H = 2.6, TH = 0.16, DH = 2.1;
function wallX(x, z0, z1, gaps, mat) { /* pared a lo largo de z, en x fijo */
  gaps = (gaps || []).slice().sort(function (a, b) { return a[0] - b[0]; });
  var cur = z0;
  gaps.forEach(function (g) {
    if (g[0] > cur) box(x, H / 2, (cur + g[0]) / 2, TH, H, g[0] - cur, mat);
    box(x, (H + DH) / 2, (g[0] + g[1]) / 2, TH, H - DH, g[1] - g[0], mat);
    cur = g[1];
  });
  if (z1 > cur) box(x, H / 2, (cur + z1) / 2, TH, H, z1 - cur, mat);
}
function wallZ(z, x0, x1, gaps, mat) { /* pared a lo largo de x, en z fijo */
  gaps = (gaps || []).slice().sort(function (a, b) { return a[0] - b[0]; });
  var cur = x0;
  gaps.forEach(function (g) {
    if (g[0] > cur) box((cur + g[0]) / 2, H / 2, z, g[0] - cur, H, TH, mat);
    box((g[0] + g[1]) / 2, (H + DH) / 2, z, g[1] - g[0], H - DH, TH, mat);
    cur = g[1];
  });
  if (x1 > cur) box((cur + x1) / 2, H / 2, z, x1 - cur, H, TH, mat);
}

/* ---------- planta ---------- */
/* suelo y techo */
var fl = new THREE.Mesh(new THREE.PlaneGeometry(17, 28), mFloor);
fl.rotation.x = -Math.PI / 2; fl.position.set(0.5, 0, -6); scene.add(fl);
var pf = new THREE.Mesh(new THREE.PlaneGeometry(5, 12), mPorch);
pf.rotation.x = -Math.PI / 2; pf.position.set(0, 0, 13); scene.add(pf);
var ce = new THREE.Mesh(new THREE.PlaneGeometry(16.6, 27), mCeil);
ce.rotation.x = Math.PI / 2; ce.position.set(0.5, H, -6.5); scene.add(ce);

/* sala (salmón) */
wallX(-2.5, -3, 7, [], mSal);
wallX(2.5, -3, 7, [[-2.6, -1.0]], mSal);
wallZ(7, -2.5, 2.5, [[-0.5, 0.5]], mSal);
wallZ(-3, -2.5, 2.5, [[-1.4, 1.4]], mSal);
/* pasillo (hueso) */
wallX(-1.4, -13, -3, [[-5.2, -4.4], [-9.4, -7.8]], mHue);
wallX(1.4, -13, -3, [], mHue);
wallZ(-13, -3.5, 3.5, [[-0.8, 0.8]], mHue);
/* cuarto de papá (salmón) */
wallZ(-3, 2.5, 8, [], mSal); wallZ(1, 2.5, 8, [], mSal); wallX(8, -3, 1, [], mSal);
/* cuarto del hermano (hueso) */
wallZ(-11, -7.4, -1.4, [], mHue); wallZ(-6, -7.4, -1.4, [], mHue); wallX(-7.4, -11, -6, [], mHue);
/* cuarto de mamá (salmón) */
wallX(-3.5, -19.5, -13, [], mSal); wallX(3.5, -19.5, -13, [], mSal); wallZ(-19.5, -3.5, 3.5, [], mSal);
/* zócalos blancos en las paredes de la sala (guiño blanco hueso) */
box(-2.4, 0.07, 2, 0.04, 0.14, 10, mTrim); box(2.42, 0.07, 3.2, 0.04, 0.14, 7.6, mTrim);
/* pasillo exterior: pared vecina y baranda de hierro */
box(2.5, H / 2, 13, TH, H, 12, mSal);
for (var bi = 0; bi < 24; bi++) box(-2.5, 0.5, 7.4 + bi * 0.45, 0.03, 1.0, 0.03, mDark);
box(-2.5, 1.0, 13, 0.06, 0.05, 11, mDark); box(-2.5, 0.05, 13, 0.06, 0.05, 11, mDark);
/* árboles del edificio de enfrente */
function tree(x, z, s) {
  box(x, 1.2 * s, z, 0.3 * s, 2.4 * s, 0.3 * s, L(0x6b4a32));
  var cr = new THREE.Mesh(new THREE.SphereGeometry(1.5 * s, 10, 8), L(0x6f9a5a));
  cr.position.set(x, 3.2 * s, z); scene.add(cr);
}
tree(-7, 9, 1.2); tree(-9.5, 13, 1.5); tree(-6.5, 16, 1.1); tree(-11, 8, 1.3);
box(-16, 5, 12, 0.4, 10, 22, L(0xe6c9b4)); /* edificio de enfrente */

/* puerta de entrada (abierta hacia adentro) */
(function () {
  var pivot = new THREE.Group(); pivot.position.set(-0.5, 0, 6.85); pivot.rotation.y = -1.25; scene.add(pivot);
  box(0.45, 1.03, 0, 0.9, 2.06, 0.05, mWood, pivot);
})();
/* puerta cerrada del baño */
box(-1.4, 1.05, -4.8, 0.07, 2.1, 0.8, mWood);
box(-1.34, 1.0, -4.55, 0.04, 0.08, 0.08, L(0xcfa24a));

/* ---------- decoración de la sala ---------- */
/* chimenea de ladrillos */
var chim = box(2.22, H / 2, 3.1, 0.56, H, 1.9, mBrick);
box(2.0, 0.55, 3.1, 0.06, 0.8, 1.1, mDark); /* boca de la chimenea */
box(2.0, 1.2, 3.1, 0.3, 0.07, 2.3, mHue);   /* repisa */
(function () { /* bufanda azulgrana sobre la repisa */
  var s = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.75), new THREE.MeshBasicMaterial({ map: stripes('barca'), side: THREE.DoubleSide }));
  s.position.set(1.84, 0.82, 3.7); s.rotation.y = -Math.PI / 2; scene.add(s);
})();
/* sofá celeste y mesa de mármol */
box(-2.0, 0.22, 2.6, 0.9, 0.44, 2.3, L(0xb9cdd6));
box(-2.35, 0.7, 2.6, 0.22, 0.6, 2.3, L(0xb9cdd6));
box(-2.0, 0.55, 1.35, 0.9, 0.3, 0.2, L(0xaec3cd)); box(-2.0, 0.55, 3.85, 0.9, 0.3, 0.2, L(0xaec3cd));
box(-0.75, 0.38, 2.6, 0.7, 0.05, 1.2, L(0xd2b09c)); box(-0.75, 0.18, 2.6, 0.6, 0.35, 1.0, L(0x2a2a30));
/* balón de fútbol */
(function () {
  var b = new THREE.Mesh(new THREE.SphereGeometry(0.11, 18, 14), new THREE.MeshLambertMaterial({ map: ballTex() }));
  b.position.set(0.2, 0.11, 4.3); scene.add(b);
})();
/* banderines: azulgrana, celeste y blanco, hueso */
(function () {
  var shape = new THREE.Shape(); shape.moveTo(0, 1); shape.lineTo(1, 1); shape.lineTo(0.5, 0); shape.lineTo(0, 1);
  var kinds = ['barca', 'bone', 'arg', 'bone', 'barca', 'bone', 'arg', 'bone', 'barca'];
  var cache = {};
  kinds.forEach(function (k, i) {
    cache[k] = cache[k] || new THREE.MeshBasicMaterial({ map: stripes(k), side: THREE.DoubleSide });
    var m = new THREE.Mesh(new THREE.ShapeGeometry(shape), cache[k]);
    m.scale.set(0.42, 0.4, 1); m.position.set(-2.0 + i * 0.5 + 0.21, 2.02, 6.88); m.rotation.y = Math.PI; scene.add(m);
  });
  box(0, 2.42, 6.89, 4.6, 0.012, 0.012, mDark);
  /* tres estrellas doradas */
  var st = new THREE.Shape();
  for (var i = 0; i < 10; i++) { var r = i % 2 ? 0.045 : 0.1, a = i * Math.PI / 5 - Math.PI / 2; st[i ? 'lineTo' : 'moveTo'](Math.cos(a) * r, Math.sin(a) * r); }
  [0, 1, 2].forEach(function (i) {
    var m = new THREE.Mesh(new THREE.ShapeGeometry(st), new THREE.MeshBasicMaterial({ color: 0xd9a93a, side: THREE.DoubleSide }));
    m.position.set(1.15 + i * 0.28, 1.75, 6.9); m.rotation.y = Math.PI; scene.add(m);
  });
})();

/* ---------- marcos y muebles ---------- */
var loader = new THREE.TextureLoader();
var toLoad = 0, loaded = 0;
function loadTex(src) {
  toLoad++;
  return loader.load(src, function () { loaded++; }, undefined, function () { loaded++; });
}
function addFrame(src, line1, line2, x, y, z, rotY, h, aspect) {
  var w = h * aspect, g = new THREE.Group();
  g.add(new THREE.Mesh(new THREE.BoxGeometry(w + 0.12, h + 0.12, 0.05), L(0x6b4a38)));
  g.add(box(0, 0, 0.012, w + 0.05, h + 0.05, 0.05, L(0xf8f2e8), g));
  var mat = src ? new THREE.MeshBasicMaterial({ map: loadTex(src), color: 0xf2eee8 })
                : new THREE.MeshBasicMaterial({ map: noteTex(line1, line2) });
  var p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat); p.position.z = 0.04; g.add(p);
  g.position.set(x, y, z); g.rotation.y = rotY; scene.add(g);
}
function bed(x, z, rotY, len, wid, cover) {
  var g = new THREE.Group();
  box(0, 0.22, 0, len, 0.44, wid, mWood, g);
  box(0, 0.5, 0, len - 0.1, 0.18, wid - 0.1, mHue, g);
  box(0.05, 0.6, 0, len - 0.7, 0.06, wid - 0.06, L(cover), g);
  box(-len / 2 + 0.3, 0.68, 0, 0.45, 0.14, wid - 0.3, mTrim, g);
  box(-len / 2 + 0.03, 0.8, 0, 0.06, 0.8, wid, mWood, g);
  g.position.set(x, 0, z); g.rotation.y = rotY; scene.add(g);
}
/* papá: fotos reales */
var PH = 1.0;
addFrame('fotos/papa1.jpg', '', '', 7.9, 1.5, -2.1, -Math.PI / 2, PH, 498 / 670);
addFrame('fotos/papa2.jpg', '', '', 7.9, 1.5, -0.45, -Math.PI / 2, PH, 498 / 662);
addFrame('fotos/papa3.jpg', '', '', 5.8, 1.55, 0.92, Math.PI, 1.0, 720 / 888);
addFrame('fotos/papa4.jpg', '', '', 5.8, 1.5, -2.92, 0, PH, 498 / 664);
bed(6.6, 0.0, Math.PI / 2, 1.9, 1.4, 0x6f8fb8);
/* el cuarto de papá: la cama pegada al sur, el ropero al norte-oeste */
box(3.3, 1.0, -2.65, 1.5, 2.0, 0.55, mWood);
box(4.4, 0.3, 0.55, 0.45, 0.6, 0.4, mWood);
/* hermano */
addFrame(null, 'Foto de tu hermano', 'llegará aquí', -7.3, 1.5, -9.2, Math.PI / 2, 1.0, 0.75);
addFrame(null, 'Su canción', 'llegará aquí', -7.3, 1.5, -8.0, Math.PI / 2, 1.0, 0.75);
addFrame(null, 'Nuestra foto', 'llegará aquí', -4.2, 1.5, -10.9, 0, 1.0, 0.75);
bed(-5.0, -6.9, 0, 2.0, 1.1, 0x9ab0c8);
box(-2.6, 0.38, -10.5, 0.7, 0.76, 0.9, mWood);
/* mamá */
addFrame(null, 'Foto de Mamá', 'llegará aquí', -0.62, 1.5, -19.4, 0, 1.0, 0.75);
addFrame(null, 'Su canción', 'llegará aquí', 0.62, 1.5, -19.4, 0, 1.0, 0.75);
bed(2.3, -18.4, -Math.PI / 2, 2.0, 1.5, 0xd9a0a0);
box(-3.0, 1.0, -14.2, 0.6, 2.0, 1.5, mWood);

/* ---------- luces ---------- */
scene.add(new THREE.HemisphereLight(0xfff1e6, 0xe6cfbd, 0.9));
function pl(x, y, z, i, d) { var l = new THREE.PointLight(0xffe0c0, i, d, 1.5); l.position.set(x, y, z); scene.add(l); }
pl(0, 2.2, 2.5, 0.5, 9); pl(0, 2.2, -7, 0.4, 9); pl(5.2, 2.2, -1, 0.45, 8);
pl(-4.2, 2.2, -8.6, 0.45, 8); pl(0, 2.2, -16, 0.5, 8);
var sun = new THREE.DirectionalLight(0xfff0dd, 0.3); sun.position.set(-3, 6, 10); scene.add(sun);

/* ---------- recorrido ---------- */
/* id, x, y, z, giro (grados; 0 = norte, 90 = este), inclinación, peso (duración) */
var KF = [
  ['start', 0, 1.7, 15.5, 0, -1, 0],
  ['porch', 0, 1.65, 10.5, 0, 0, 3],
  ['door', 0, 1.65, 7.2, 0, 0, 2],
  ['sala-in', 0, 1.65, 4.8, 0, 0, 2],
  ['fire', 0, 1.6, 2.8, 90, 0, 2.5],
  ['back', 0, 1.6, 2.8, 180, 0, 2.5],
  ['sofa', 0, 1.6, 2.8, 270, 0, 2.5],
  ['north', 0, 1.65, 1.0, 360, 0, 2.5],
  ['papa-pre', 0.9, 1.65, -1.8, 450, 0, 2.5],
  ['papa-door', 2.5, 1.65, -1.8, 450, 0, 1.5],
  ['papa1', 5.0, 1.55, -1.28, 450, 0, 3],
  ['papa2', 5.8, 1.55, -1.5, 540, 0, 3],
  ['papa3', 5.8, 1.55, -1.5, 360, 0, 3.5],
  ['papa-out', 4.0, 1.65, -1.8, 270, 0, 3.5],
  ['papa-door2', 2.5, 1.65, -1.8, 270, 0, 1.5],
  ['sala-exit', 0, 1.65, -2.8, 360, 0, 2.5],
  ['corr', 0, 1.65, -6.0, 360, 0, 3],
  ['bro-pre', 0, 1.65, -8.6, 270, 0, 2.5],
  ['bro-door', -1.4, 1.65, -8.6, 270, 0, 1.5],
  ['bro1', -4.2, 1.55, -8.6, 270, 0, 3.5],
  ['bro2', -4.2, 1.55, -8.6, 360, 0, 3.5],
  ['bro-out', -1.6, 1.65, -8.6, 450, 0, 3],
  ['corr2', 0, 1.65, -10.0, 360, 0, 2.5],
  ['mama-door', 0, 1.65, -13.0, 360, 0, 3],
  ['mama1', 0, 1.6, -16.8, 360, 0, 3.5],
  ['mama2', 0, 1.6, -17.0, 335, 0, 2],
  ['mama3', 0, 1.6, -17.0, 385, 0, 3],
  ['end', 0, 1.7, -16.4, 360, 0, 3]
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
var cardsEl = document.getElementById('cards');
var lb = document.getElementById('lb');
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

/* navegación */
var navEl = document.getElementById('nav'), chips = [];
C.nav.forEach(function (n) {
  var b = document.createElement('button'); b.textContent = n.label;
  b.addEventListener('click', function () { goTo(cum[idx[n.go]]); });
  navEl.appendChild(b); chips.push({ b: b, p: cum[idx[n.go]] });
});
var PER = 0.4; /* pantallas de scroll por unidad de duración */
var space = document.getElementById('space'), maxScroll = 1;
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
  [-2.5, -3, 5, 10, 'Sala'], [-1.4, -13, 2.8, 10, ''], [2.5, -3, 5.5, 4, 'Papá'],
  [-7.4, -11, 6, 5, 'Hermano'], [-3.5, -19.5, 7, 6.5, 'Mamá']
];
function drawMap(pos) {
  var W = mapC.width, Hh = mapC.height, x0 = -8, x1 = 8.5, z0 = -20, z1 = 8;
  var sx = W / (x1 - x0), sz = Hh / (z1 - z0);
  mg.clearRect(0, 0, W, Hh);
  rooms.forEach(function (r) {
    mg.fillStyle = r[4] === '' ? '#f1e6d6' : '#f0b5a0'; mg.strokeStyle = '#8a5a4a'; mg.lineWidth = 1;
    var X = (r[0] - x0) * sx, Z = (r[1] - z0) * sz;
    mg.fillRect(X, Z, r[2] * sx, r[3] * sz); mg.strokeRect(X, Z, r[2] * sx, r[3] * sz);
    if (r[4]) { mg.fillStyle = '#4a2e26'; mg.font = '15px Georgia'; mg.textAlign = 'center'; mg.fillText(r[4], X + r[2] * sx / 2, Z + r[3] * sz / 2 + 5); }
  });
  var px = (pos.x - x0) * sx, pz = (pos.z - z0) * sz, a = pos.yaw * Math.PI / 180;
  mg.fillStyle = '#004d98'; mg.beginPath(); mg.arc(px, pz, 6, 0, 6.3); mg.fill();
  mg.strokeStyle = '#a50044'; mg.lineWidth = 3; mg.beginPath(); mg.moveTo(px, pz); mg.lineTo(px + Math.sin(a) * 18, pz - Math.cos(a) * 18); mg.stroke();
}

/* ---------- bucle ---------- */
var target = 0, cur = 0, progEl = document.getElementById('prog'), hintGone = false;
function readScroll() { target = Math.max(0, Math.min(1, window.scrollY / maxScroll)); }
window.addEventListener('scroll', readScroll, { passive: true }); readScroll();
function frame() {
  cur += (target - cur) * 0.085;
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
