/* ============================================================
   WEBSITE CHÚC MỪNG SINH NHẬT 🎂
   Phong cách viral TikTok/Douyin — tối ưu cho điện thoại.
   Mọi nội dung cần cá nhân hóa đều nằm trong CONFIG bên dưới.
   ============================================================ */

// ===================== CẤU HÌNH — CHỈNH SỬA TẠI ĐÂY =====================
const CONFIG = {
  recipientName: "Trần Thị Hồng Loan",        // Tên người nhận quà
  birthDate: "07/10/2009",         // Ngày sinh
  age: 17,                          // Tuổi (số nến tự động theo tuổi, tối đa 12 để đẹp trên mobile)
  senderName: "Nguyễn Mạnh Cường",       // Người gửi (ký tên cuối thư)
  wishes: [                         // 3–5 câu chúc (hiện kiểu máy đánh chữ)
    "Chúc mừng sinh nhật bạn Loan nha ! ",
    "Chúc cho bạn luôn vui vẻ,khỏe mạnh và ngày càng đẹp zai hơn.",
    "Cảm ơn bạn vì chúng ta đã chơi với nhau được gần 1 năm nà.",
  ],
  letter: [                         // Thư tay ngắn — mỗi phần tử là một dòng
    "Tuổi mới phải trưởng thành hơn nhé,",
    "chúc cô có 1 ngày thật tuyệt vời nha.",
    "Mong cô nhận được nhiều lời chúc từ mọi người xung quanh,",
    "nếu có vấn đề đừng buồn tui nha tu code gà lắm. 🌸",
    "Bước sang tuổi mới rồi bớt bắt nạt em nha,",
    "chịu khó để ý thằng này 1 tý.",
  ],
  images: [                         // 6–10 ảnh trong assets/images (tên không dấu, không khoảng trắng)
    "assets/images/photo-1.jpg",
    "assets/images/photo-2.jpg",
    "assets/images/photo-3.jpg",
    "assets/images/photo-4.jpg",
  ],
  music: "",                        // Đường dẫn file mp3, vd: "assets/audio/birthday.mp3". Để trống sẽ tự chơi nhạc "Happy Birthday" (public domain).
};

// ===================== TIỆN ÍCH & PHÁT HIỆN THIẾT BỊ =====================
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// Giới hạn số hạt theo thiết bị để không giật lag trên máy yếu
const isMobile = matchMedia("(max-width: 768px)").matches;
const isLowEnd =
  isMobile ||
  (navigator.hardwareConcurrency || 8) <= 4 ||
  (navigator.deviceMemory && navigator.deviceMemory <= 4);
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const PARTICLE_SCALE = reduceMotion ? 0.35 : isLowEnd ? 0.6 : 1;

// ===================== NỀN SAO LẤP LÁNH (chạy suốt) =====================
const bgC = $("#bg-stars");
const bg = { ctx: bgC.getContext("2d"), stars: [], shoot: null, last: 0 };

function initStarfield() {
  const dpr = Math.min(devicePixelRatio || 1, 2);
  bgC.width = innerWidth * dpr;
  bgC.height = innerHeight * dpr;
  const n = Math.round((reduceMotion ? 40 : isLowEnd ? 90 : 170) * (innerWidth < 768 ? 0.7 : 1));
  bg.stars = Array.from({ length: n }, () => ({
    x: Math.random() * bgC.width,
    y: Math.random() * bgC.height,
    r: (Math.random() * 1.4 + 0.4) * dpr,
    ph: Math.random() * Math.PI * 2,
    sp: Math.random() * 0.002 + 0.0005,
  }));
}

function bgLoop(now) {
  requestAnimationFrame(bgLoop);
  if (document.hidden) return; // tiết kiệm pin khi ẩn tab
  const g = bg.ctx;
  g.clearRect(0, 0, bgC.width, bgC.height);
  for (const s of bg.stars) {
    g.globalAlpha = 0.35 + 0.65 * Math.abs(Math.sin(now * s.sp + s.ph));
    g.fillStyle = "#fff";
    g.beginPath();
    g.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    g.fill();
  }
  // Sao băng thỉnh thoảng
  if (!bg.shoot && !reduceMotion && now - bg.last > 5000 + Math.random() * 6000) {
    bg.last = now;
    bg.shoot = { x: Math.random() * bgC.width * 0.7, y: Math.random() * bgC.height * 0.3, vx: 9, vy: 4, life: 40 };
  }
  if (bg.shoot) {
    const s = bg.shoot;
    s.x += s.vx;
    s.y += s.vy;
    s.life--;
    const grad = g.createLinearGradient(s.x, s.y, s.x - s.vx * 8, s.y - s.vy * 8);
    grad.addColorStop(0, "rgba(255,255,255,.9)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    g.globalAlpha = Math.min(1, s.life / 20);
    g.strokeStyle = grad;
    g.lineWidth = 2;
    g.beginPath();
    g.moveTo(s.x, s.y);
    g.lineTo(s.x - s.vx * 8, s.y - s.vy * 8);
    g.stroke();
    if (s.life <= 0) bg.shoot = null;
  }
  g.globalAlpha = 1;
}

addEventListener("resize", () => { initStarfield(); sizeFxCanvas(); });

// ===================== NHẠC NỀN (chỉ phát sau cử động đầu tiên) =====================
const Music = {
  ctx: null,
  el: null,
  timer: null,
  noteIdx: 0,
  playing: false,
  // Giai điệu "Happy Birthday" (public domain) — mỗi nốt: [tần số Hz, độ dài beat]
  melody: [
    [392.00, 0.75], [392.00, 0.25], [440.00, 1], [392.00, 1], [523.25, 1], [493.88, 2],
    [392.00, 0.75], [392.00, 0.25], [440.00, 1], [392.00, 1], [587.33, 1], [523.25, 2],
    [392.00, 0.75], [392.00, 0.25], [783.99, 1], [659.25, 1], [523.25, 1], [493.88, 1], [440.00, 2],
    [698.46, 0.75], [698.46, 0.25], [659.25, 1], [523.25, 1], [587.33, 1], [523.25, 2],
  ],
  async start() {
    if (this.playing) return;
    if (CONFIG.music) {
      this.el = new Audio(CONFIG.music);
      this.el.loop = true;
      this.el.volume = 0.6;
      try {
        await this.el.play();
        this.playing = true;
      } catch (e) {
        console.warn("Không phát được file nhạc — chuyển nhạc tự tạo", e);
        this.startMelody();
      }
    } else {
      this.startMelody();
    }
    updateMusicButton();
  },
  startMelody() {
    try {
      this.ctx = this.ctx || new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      return; // thiết bị không hỗ trợ Web Audio
    }
    this.playing = true;
    const BEAT = 0.42; // giây mỗi nốt
    const playNote = () => {
      if (!this.playing) return;
      const [f, beats] = this.melody[this.noteIdx % this.melody.length];
      this.noteIdx++;
      const t = this.ctx.currentTime;
      const dur = beats * BEAT;
      // Nốt chính (sine mềm)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = f;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.12, t + 0.04);
      gain.gain.setValueAtTime(0.12, t + Math.max(0.05, dur - 0.15));
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
      osc.connect(gain).connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + dur);
      // Họa âm nhẹ một quãng tám dưới cho ấm hơn
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = "triangle";
      osc2.frequency.value = f / 2;
      gain2.gain.setValueAtTime(0, t);
      gain2.gain.linearRampToValueAtTime(0.04, t + 0.06);
      gain2.gain.exponentialRampToValueAtTime(0.001, t + dur);
      osc2.connect(gain2).connect(this.ctx.destination);
      osc2.start(t);
      osc2.stop(t + dur);
      this.timer = setTimeout(playNote, dur * 1000);
    };
    playNote();
  },
  stop() {
    this.playing = false;
    if (this.el) { this.el.pause(); this.el = null; }
    if (this.timer) { clearTimeout(this.timer); this.timer = null; }
    updateMusicButton();
  },
};

function updateMusicButton() {
  const b = $("#music-toggle");
  b.textContent = Music.playing ? "🎵" : "🔇";
  b.classList.toggle("on", Music.playing);
  b.setAttribute("aria-pressed", String(Music.playing));
}

$("#music-toggle").addEventListener("click", () => {
  Music.playing ? Music.stop() : Music.start();
});

// Bật nút nhạc sau cử động đầu tiên (trình duyệt yêu cầu)
addEventListener("pointerdown", function unlockMusic() {
  $("#music-toggle").disabled = false;
  removeEventListener("pointerdown", unlockMusic);
});

// ===================== QUẢN LÝ CẢNH =====================
let currentScene = "";
let sceneToken = 0; // tăng khi đổi cảnh để huỷ các tác vụ async đang chạy
const ORDER = [
  "scene-intro", "scene-countdown", "scene-particles", "scene-cake",
  "scene-gallery", "scene-wishes", "scene-letter", "scene-end",
];

const sceneHandlers = {
  "scene-intro": enterIntro,
  "scene-countdown": runCountdown,
  "scene-particles": startParticles,
  "scene-cake": enterCake,
  "scene-gallery": enterGallery,
  "scene-wishes": playWishes,
  "scene-letter": playLetter,
  "scene-end": enterEnd,
};

function goToScene(id) {
  if (currentScene === id) return;
  currentScene = id;
  sceneToken++;
  $$(".scene").forEach((s) => s.classList.toggle("active", s.id === id));
  // Dọn dẹp tài nguyên khi rời cảnh
  if (id !== "scene-particles") stopFx();
  if (id !== "scene-cake") stopMic();
  const handler = sceneHandlers[id];
  if (handler) handler(sceneToken);
}

// Bấm vào cảnh có data-skip để qua cảnh tiếp (không tính nút bấm)
document.addEventListener("click", (e) => {
  const scene = e.target.closest(".scene[data-skip]");
  if (!scene || e.target.closest("button") || e.target.closest("a")) return;
  const next = ORDER[ORDER.indexOf(scene.id) + 1];
  if (next) goToScene(next);
});

// ===================== 1. MỞ ĐẦU =====================
function enterIntro() {
  if (window.gsap && !reduceMotion) {
    gsap.from(".intro-content > *", { y: 30, opacity: 0, stagger: 0.18, duration: 0.9, ease: "power2.out" });
  }
}

$("#btn-open").addEventListener("click", async () => {
  await Music.start(); // nhạc chỉ phát sau lần chạm đầu tiên
  goToScene("scene-countdown");
});

// ===================== 2. ĐẾM NGƯỢC =====================
async function runCountdown(token) {
  const num = $("#countdown-num");
  for (const n of ["3", "2", "1"]) {
    if (token !== sceneToken) return;
    num.textContent = n;
    num.classList.remove("pop");
    void num.offsetWidth; // khởi động lại animation
    num.classList.add("pop");
    await wait(reduceMotion ? 250 : 900);
  }
  if (token !== sceneToken) return;
  goToScene("scene-particles");
}

// ===================== 3. HẠT XẾP CHỮ + PHÁO HOA (Canvas 2D) =====================
const fxC = $("#fx-canvas");
const fx = {
  ctx: fxC.getContext("2d"),
  parts: [], sparks: [], rockets: [],
  running: false, heartMode: false, lastLaunch: 0,
};

function sizeFxCanvas() {
  if (!fxC.offsetParent && currentScene !== "scene-particles") return;
  const dpr = Math.min(devicePixelRatio || 1, isMobile ? 1.5 : 2);
  fxC.width = innerWidth * dpr;
  fxC.height = innerHeight * dpr;
}

// Tạo sprite chấm phát sáng sẵn để vẽ nhanh (tránh shadowBlur nặng)
const SPRITES = {};
function dotSprite(color) {
  if (SPRITES[color]) return SPRITES[color];
  const c = document.createElement("canvas");
  c.width = c.height = 32;
  const g = c.getContext("2d");
  const grad = g.createRadialGradient(16, 16, 0, 16, 16, 16);
  grad.addColorStop(0, "rgba(255,255,255,.95)");
  grad.addColorStop(0.25, color);
  grad.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 32, 32);
  return (SPRITES[color] = c);
}
const COLORS = ["#ffd166", "#ff5fa2", "#ffffff", "#c9bde6"];

function launchRocket() {
  const dpr = fxC.width / innerWidth;
  const x = Math.random() * fxC.width;
  const y = fxC.height * 0.95;
  const peak = fxC.height * (0.15 + Math.random() * 0.35);
  fx.rockets.push({ x, y, vy: -Math.sqrt(2 * 0.05 * dpr * (y - peak)), peak, g: 0.05 * dpr });
}

function explode(r) {
  const dpr = fxC.width / innerWidth;
  const n = Math.round((isLowEnd ? 40 : 80) * PARTICLE_SCALE);
  const sprite = dotSprite(COLORS[(Math.random() * COLORS.length) | 0]);
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2;
    const sp = (Math.random() * 3 + 1.2) * dpr;
    fx.sparks.push({
      x: r.x, y: r.y,
      vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
      g: 0.045 * dpr,
      life: 50 + Math.random() * 40, maxLife: 90,
      size: 2.5 + Math.random() * 2, sprite,
    });
  }
}

function updateFireworks(g, now) {
  const dpr = fxC.width / innerWidth;
  if (now - fx.lastLaunch > (isLowEnd ? 1100 : 750)) {
    fx.lastLaunch = now;
    launchRocket();
  }
  for (let i = fx.rockets.length - 1; i >= 0; i--) {
    const r = fx.rockets[i];
    r.y += r.vy;
    r.vy += r.g;
    g.globalAlpha = 1;
    g.drawImage(dotSprite("#ffffff"), r.x - 3 * dpr, r.y - 3 * dpr, 6 * dpr, 6 * dpr);
    if (r.vy >= -0.5 || r.y <= r.peak) { explode(r); fx.rockets.splice(i, 1); }
  }
  const maxSparks = Math.round((isLowEnd ? 260 : 520) * PARTICLE_SCALE);
  for (let i = fx.sparks.length - 1; i >= 0; i--) {
    const s = fx.sparks[i];
    s.x += s.vx;
    s.y += s.vy;
    s.vy += s.g;
    s.vx *= 0.985;
    s.life--;
    if (s.life <= 0 || fx.sparks.length > maxSparks * 1.2) { fx.sparks.splice(i, 1); continue; }
    g.globalAlpha = Math.max(0, s.life / s.maxLife);
    const r = s.size * dpr;
    g.drawImage(s.sprite, s.x - r, s.y - r, r * 2, r * 2);
  }
  g.globalAlpha = 1;
}

function fxLoop(now) {
  if (!fx.running) return;
  requestAnimationFrame(fxLoop);
  const g = fx.ctx;
  const dpr = fxC.width / innerWidth;
  g.clearRect(0, 0, fxC.width, fxC.height);
  updateFireworks(g, now);
  // Chế độ cộng sáng: hạt glow như đèn neon
  g.globalCompositeOperation = "lighter";
  const cx = fxC.width / 2, cy = fxC.height * 0.46;
  for (const p of fx.parts) {
    if (fx.heartMode) {
      // Hạt quay quanh trái tim
      p.angle += p.orbit;
      const r = p.radius + Math.sin(now * 0.001 + p.phase) * 14;
      p.x = cx + Math.cos(p.angle) * r;
      p.y = cy + Math.sin(p.angle) * r * 0.82;
    } else {
      // Hạt trôi nhẹ tại chỗ
      p.x = p.baseX + Math.sin(now * p.drift + p.phase) * p.amp;
      p.y = p.baseY + Math.cos(now * p.drift * 0.8 + p.phase) * p.amp;
    }
    const tw = 0.7 + 0.3 * Math.sin(now * 0.005 + p.phase);
    const r = p.size * dpr;
    g.globalAlpha = tw * 0.25; // vầng hào quang nhỏ
    g.drawImage(p.sprite, p.x - r * 2, p.y - r * 2, r * 4, r * 4);
    g.globalAlpha = tw; // lõi hình khối vuông sáng rõ
    g.fillStyle = p.color;
    g.fillRect(p.x - r, p.y - r, r * 2, r * 2);
  }
  g.globalAlpha = 1;
  g.globalCompositeOperation = "source-over";
}

function stopFx() {
  fx.running = false;
  fx.heartMode = false;
  fxC.style.transform = "";
  $("#fx-text").classList.remove("show");
  $("#fx-heart").classList.remove("show");
}

async function startParticles(token) {
  await document.fonts.ready; // đợi font viết tay để chữ DOM hiển thị đúng
  sizeFxCanvas();
  // Hạt nền lung linh (trôi nhẹ, không xếp chữ → luôn rõ nét)
  const count = Math.round((isMobile ? 800 : 1500) * PARTICLE_SCALE);
  fx.parts = Array.from({ length: count }, () => {
    const color = COLORS[(Math.random() * COLORS.length) | 0];
    return {
      baseX: Math.random() * fxC.width,
      baseY: Math.random() * fxC.height,
      x: 0, y: 0,
      amp: 20 + Math.random() * 40,
      angle: Math.random() * Math.PI * 2,
      radius: 50 + Math.random() * Math.min(fxC.width, fxC.height) * 0.32,
      drift: 0.0004 + Math.random() * 0.0008,
      orbit: (0.002 + Math.random() * 0.004) * (Math.random() < 0.5 ? 1 : -1),
      phase: Math.random() * Math.PI * 2,
      size: 2 + Math.random() * 2.5,
      color,
      sprite: dotSprite(color),
    };
  });
  fx.sparks = [];
  fx.rockets = [];
  fx.running = true;
  fx.heartMode = false;
  fx.lastLaunch = 0;
  requestAnimationFrame(fxLoop);

  const textEl = $("#fx-text");
  const heartEl = $("#fx-heart");
  // Giai đoạn 1: chữ "Happy Birthday" (DOM nên sắc nét tuyệt đối)
  textEl.textContent = "Happy Birthday";
  textEl.classList.add("show");
  await wait(3200); if (token !== sceneToken) return;
  // Giai đoạn 2: tên người nhận
  textEl.textContent = CONFIG.recipientName;
  await wait(3400); if (token !== sceneToken) return;
  // Giai đoạn 3: trái tim đập, hạt sáng quay quanh
  textEl.classList.remove("show");
  heartEl.classList.add("show");
  fx.heartMode = true;
  await wait(5400); if (token !== sceneToken) return;
  fx.heartMode = false;
  stopFx();
  goToScene("scene-cake");
}

// ===================== 4. BÁNH KEM 3D & THỔI NẾN =====================
let candlesLit = 0;
let candleTotal = 0;
let cake = null; // { fallback, THREE, group, candles, smokes, smokeTex }
let micCtx = null, analyser = null, micData = null, micStream = null;
let micReady = false, micDenied = false, blowHold = 0;

// Texture sọc xoắn cho cây nến
function candleStripeTexture(THREE) {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d");
  g.fillStyle = "#ff5fa2";
  g.fillRect(0, 0, 64, 64);
  g.fillStyle = "#ffffff";
  for (let i = -64; i < 128; i += 16) {
    g.beginPath();
    g.moveTo(i, 0);
    g.lineTo(i + 8, 0);
    g.lineTo(i + 72, 64);
    g.lineTo(i + 64, 64);
    g.closePath();
    g.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

// Texture ngọn lửa (sprite)
function flameTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d");
  const grad = g.createRadialGradient(32, 42, 2, 32, 32, 30);
  grad.addColorStop(0, "rgba(255,247,204,1)");
  grad.addColorStop(0.35, "rgba(255,209,102,0.95)");
  grad.addColorStop(0.7, "rgba(255,157,92,0.55)");
  grad.addColorStop(1, "rgba(255,95,162,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  return c;
}

// Texture khói (sprite)
function smokeTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d");
  const grad = g.createRadialGradient(32, 32, 2, 32, 32, 30);
  grad.addColorStop(0, "rgba(210,205,230,0.85)");
  grad.addColorStop(1, "rgba(210,205,230,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  return c;
}

// Dựng bánh kem 3D (Three.js), lỗi thì dùng bánh DOM dự phòng
async function buildCake3d() {
  if (cake) { resetCandles(); return; } // đã có bánh → chỉ cần thắp lại nến
  const container = $("#cake-3d");
  container.innerHTML = "";
  let THREE;
  try {
    THREE = await import("three");
    try {
      buildCakeScene(THREE, container);
    } catch (e) {
      console.warn("WebGL không khả dụng — dùng bánh dự phòng", e);
      buildCakeFallback(container);
    }
  } catch (e) {
    console.warn("Three.js không tải được — dùng bánh dự phòng", e);
    buildCakeFallback(container);
  }
}

function buildCakeScene(THREE, container) {
  const W = container.clientWidth || innerWidth;
  const H = Math.max(300, container.clientHeight || innerHeight * 0.5);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
  camera.position.set(0, 2.7, 6.4);
  camera.lookAt(0, 1.0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.setSize(W, H);
  container.appendChild(renderer.domElement);

  // Đèn: ánh sáng môi trường + vàng + hồng
  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const key = new THREE.PointLight(0xffd166, 60, 40);
  key.position.set(3.5, 5, 4);
  scene.add(key);
  const pinkL = new THREE.PointLight(0xff5fa2, 45, 40);
  pinkL.position.set(-4, 3, 2.5);
  scene.add(pinkL);
  const flameLight = new THREE.PointLight(0xffa040, 0, 10);
  flameLight.position.set(0, 2.7, 0);
  scene.add(flameLight);

  const group = new THREE.Group();
  scene.add(group);

  // Đĩa bánh
  const plate = new THREE.Mesh(
    new THREE.CylinderGeometry(2.15, 2.3, 0.14, 48),
    new THREE.MeshStandardMaterial({ color: 0xe8e2f7, roughness: 0.35, metalness: 0.35 })
  );
  plate.position.y = 0.07;
  group.add(plate);

  // 3 tầng bánh, mỗi tầng kẹp viền kem trắng
  const layers = [
    { r: 1.78, h: 0.85, y: 0.14, c: 0x8e6cf0 },
    { r: 1.34, h: 0.72, y: 0.99, c: 0xff5fa2 },
    { r: 0.94, h: 0.56, y: 1.71, c: 0xffd166 },
  ];
  for (const l of layers) {
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(l.r, l.r, l.h, 48),
      new THREE.MeshStandardMaterial({ color: l.c, roughness: 0.55 })
    );
    body.position.y = l.y + l.h / 2;
    group.add(body);
    const rim = new THREE.Mesh(
      new THREE.TorusGeometry(l.r * 0.99, 0.085, 12, 48),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 })
    );
    rim.rotation.x = Math.PI / 2;
    rim.position.y = l.y + l.h;
    group.add(rim);
    const top = new THREE.Mesh(
      new THREE.CylinderGeometry(l.r * 0.97, l.r * 0.97, 0.07, 48),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 })
    );
    top.position.y = l.y + l.h + 0.035;
    group.add(top);
  }

  // Nến: số nến theo tuổi, xếp vòng trên mặt bánh (tối đa 12)
  const topY = 2.34;
  const n = Math.max(1, Math.min(CONFIG.age, 12));
  const stripeTex = candleStripeTexture(THREE);
  const flameTex = new THREE.CanvasTexture(flameTexture());
  const smokeTex = new THREE.CanvasTexture(smokeTexture());
  const candles = [];
  const candleMeshes = [];
  for (let i = 0; i < n; i++) {
    const theta = (i / n) * Math.PI * 2;
    const cx = 0.5 * Math.sin(theta);
    const cz = 0.5 * Math.cos(theta);
    const stick = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.045, 0.55, 12),
      new THREE.MeshStandardMaterial({ map: stripeTex, roughness: 0.5 })
    );
    stick.position.set(cx, topY + 0.275, cz);
    group.add(stick);
    const flame = new THREE.Sprite(new THREE.SpriteMaterial({ map: flameTex, transparent: true, depthWrite: false }));
    flame.position.set(cx, topY + 0.68, cz);
    flame.scale.set(0.34, 0.42, 1);
    group.add(flame);
    const candle = { stick, flame, lit: true, idx: i };
    stick.userData.candle = candle;
    candles.push(candle);
    candleMeshes.push(stick);
  }
  candlesLit = candleTotal = candles.length;

  cake = { fallback: false, THREE, group, candles, smokes: [], smokeTex };

  // Kéo xoay bánh (có quán tính), bấm nến để tắt
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const el = renderer.domElement;
  let dragging = false, lastX = 0, moved = 0, rotY = 0, vel = 0, autoRotate = true;

  el.addEventListener("pointerdown", (e) => {
    dragging = true;
    lastX = e.clientX;
    moved = 0;
    autoRotate = false;
    el.setPointerCapture(e.pointerId);
  });
  el.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    lastX = e.clientX;
    moved += Math.abs(dx);
    rotY += dx * 0.008;
    vel = dx * 0.008;
  });
  const endDrag = (e) => {
    if (!dragging) return;
    dragging = false;
    setTimeout(() => { autoRotate = true; }, 2500);
    if (moved < 8) { // coi là bấm → tắt nến bị bấm
      const rect = el.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(candleMeshes)[0];
      if (hit && hit.object.userData.candle) extinguishCandle(hit.object.userData.candle);
    }
  };
  el.addEventListener("pointerup", endDrag);
  el.addEventListener("pointercancel", endDrag);

  addEventListener("resize", () => {
    const w = container.clientWidth || innerWidth;
    const h = Math.max(300, container.clientHeight || innerHeight * 0.5);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });

  // Vòng lặp render: chỉ chạy khi cảnh bánh kem đang hoạt động
  let last = performance.now();
  (function loop(now) {
    requestAnimationFrame(loop);
    if (currentScene !== "scene-cake" || document.hidden) return;
    const dt = Math.min(50, now - last);
    last = now;
    if (!dragging && autoRotate && !reduceMotion) rotY += dt * 0.00025;
    if (!dragging && Math.abs(vel) > 0.0001) { rotY += vel; vel *= 0.94; }
    group.rotation.y = rotY;
    // Lửa nhấp nháy + ánh sáng ấm theo số nến đang cháy
    const t = now * 0.012;
    let lit = 0;
    for (const c of candles) {
      if (!c.lit) continue;
      lit++;
      const s = 1 + 0.16 * Math.sin(t + c.idx * 1.7);
      c.flame.scale.set(0.34 * s, 0.42 * (1 + 0.1 * Math.sin(t * 1.3 + c.idx)), 1);
    }
    flameLight.intensity = lit * 2.2;
    // Khói bay lên khi nến tắt
    for (let i = cake.smokes.length - 1; i >= 0; i--) {
      const s = cake.smokes[i];
      s.life++;
      s.sprite.position.y += 0.018;
      s.sprite.position.x += Math.sin(s.life * 0.08) * 0.004;
      const k = 1 - s.life / 110;
      s.sprite.material.opacity = Math.max(0, k) * 0.7;
      const sc = 0.3 + s.life * 0.006;
      s.sprite.scale.set(sc, sc, 1);
      if (s.life > 110) {
        group.remove(s.sprite);
        s.sprite.material.dispose();
        cake.smokes.splice(i, 1);
      }
    }
    renderer.render(scene, camera);
  })(performance.now());
}

// Bánh dự phòng (không có WebGL): emoji bánh + nến DOM
function buildCakeFallback(container) {
  const wrap = document.createElement("div");
  wrap.className = "cake-fallback";
  const emoji = document.createElement("div");
  emoji.className = "cake-emoji";
  emoji.textContent = "🎂";
  wrap.appendChild(emoji);
  const row = document.createElement("div");
  row.className = "candle-row";
  const n = Math.max(1, Math.min(CONFIG.age, 12));
  const candles = [];
  for (let i = 0; i < n; i++) {
    const b = document.createElement("button");
    b.className = "candle";
    b.type = "button";
    b.setAttribute("aria-label", `Nến ${i + 1} — bấm để tắt`);
    b.innerHTML = '<span class="smoke"></span><span class="flame"></span><span class="wick"></span><span class="stick"></span>';
    const candle = { dom: b, lit: true, idx: i };
    b.addEventListener("click", () => extinguishCandle(candle));
    candles.push(candle);
    row.appendChild(b);
  }
  wrap.appendChild(row);
  container.appendChild(wrap);
  candlesLit = candleTotal = candles.length;
  cake = { fallback: true, candles, smokes: [] };
}

function resetCandles() {
  if (!cake) return;
  for (const c of cake.candles) {
    c.lit = true;
    if (cake.fallback) c.dom.classList.remove("out");
    else c.flame.visible = true;
  }
  if (!cake.fallback) {
    for (const s of cake.smokes) {
      cake.group.remove(s.sprite);
      s.sprite.material.dispose();
    }
    cake.smokes = [];
  }
  candlesLit = candleTotal;
}

function extinguishCandle(candle) {
  if (!candle || !candle.lit) return;
  candle.lit = false;
  if (cake.fallback) {
    candle.dom.classList.add("out"); // khói bay nhờ CSS animation
  } else {
    candle.flame.visible = false;
    // Tạo khói bay lên
    const smoke = new cake.THREE.Sprite(new cake.THREE.SpriteMaterial({
      map: cake.smokeTex, transparent: true, depthWrite: false,
    }));
    smoke.position.copy(candle.flame.position);
    smoke.scale.set(0.3, 0.3, 1);
    cake.group.add(smoke);
    cake.smokes.push({ sprite: smoke, life: 0 });
  }
  candlesLit--;
  updateCandleUI();
  if (candlesLit === 0) celebrate();
}

function blowAllCandles() {
  if (!cake) return;
  cake.candles.forEach((c, i) => setTimeout(() => extinguishCandle(c), i * 90));
}

function updateCandleUI() {
  $("#candle-count").textContent = candlesLit > 0 ? `Còn ${candlesLit} ngọn 🕯️` : "";
}

function celebrate() {
  $("#mic-hint").textContent = "";
  $("#btn-mic").style.display = "none";
  $("#candle-count").textContent = "";
  $("#btn-relight").hidden = false;
  $("#wish-reveal").classList.add("show");
  stopMic();
  // Pháo giấy nổ (canvas-confetti)
  if (window.confetti && !reduceMotion) {
    const colors = ["#ff5fa2", "#ffd166", "#ffffff", "#ff8fc7"];
    confetti({ particleCount: 130, spread: 80, origin: { y: 0.6 }, colors });
    setTimeout(() => confetti({ particleCount: 70, angle: 60, spread: 60, origin: { x: 0, y: 0.7 }, colors }), 250);
    setTimeout(() => confetti({ particleCount: 70, angle: 120, spread: 60, origin: { x: 1, y: 0.7 }, colors }), 400);
  }
  if (window.gsap && !reduceMotion) {
    gsap.from("#wish-reveal", { scale: 0.5, opacity: 0, duration: 1, ease: "back.out(2)" });
  }
}

// Xin quyền micro để phát hiện tiếng thổi (Web Audio API)
async function tryInitMic() {
  if (micReady || micDenied || !navigator.mediaDevices?.getUserMedia) return;
  try {
    micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    micCtx = micCtx || new (window.AudioContext || window.webkitAudioContext)();
    const src = micCtx.createMediaStreamSource(micStream);
    analyser = micCtx.createAnalyser();
    analyser.fftSize = 512;
    src.connect(analyser);
    micData = new Uint8Array(analyser.fftSize);
    micReady = true;
    $("#btn-mic").style.display = "none";
    $("#mic-hint").textContent = "🎤 Đang lắng nghe… hãy thổi thật mạnh để tắt nến!";
  } catch (err) {
    micDenied = true; // từ chối hoặc không hỗ trợ → dùng nút bấm nến
    $("#btn-mic").style.display = "";
    $("#mic-hint").textContent = "Không dùng được micro — hãy bấm vào nến để tắt 💡";
  }
}

function stopMic() {
  if (micStream) { micStream.getTracks().forEach((t) => t.stop()); micStream = null; }
  micReady = false;
  blowHold = 0;
}

// Đo cường độ âm thanh liên tục, chỉ chạy khi cảnh bánh kem đang hoạt động
function micLoop() {
  requestAnimationFrame(micLoop);
  if (!micReady || currentScene !== "scene-cake" || candlesLit === 0) { blowHold = 0; return; }
  analyser.getByteTimeDomainData(micData);
  let sum = 0;
  for (let i = 0; i < micData.length; i++) {
    const v = (micData[i] - 128) / 128;
    sum += v * v;
  }
  const rms = Math.sqrt(sum / micData.length);
  blowHold = rms > 0.16 ? blowHold + 16 : 0; // ngưỡng thổi, giữ 350ms
  if (blowHold > 350) { blowHold = 0; blowAllCandles(); }
}

async function enterCake(token) {
  $("#wish-reveal").classList.remove("show");
  $("#btn-relight").hidden = true;
  $("#btn-mic").style.display = "";
  $("#mic-hint").textContent = micDenied
    ? "Không dùng được micro — hãy bấm vào nến để tắt 💡"
    : "Thổi nến đi nào! (hoặc bấm vào nến)";
  await buildCake3d();
  updateCandleUI();
  tryInitMic(); // xin quyền; nếu bị chặn thì nút "Cho phép micro" vẫn hiện
  // Tự động sang cảnh tiếp sau 25s nếu chưa tắt nến
  wait(25000).then(() => { if (token === sceneToken && candlesLit > 0) goToScene("scene-gallery"); });
}

$("#btn-mic").addEventListener("click", tryInitMic);
$("#btn-relight").addEventListener("click", () => {
  resetCandles();
  $("#wish-reveal").classList.remove("show");
  $("#btn-relight").hidden = true;
  $("#btn-mic").style.display = micReady ? "none" : "";
  updateCandleUI();
});
$("#btn-cake-next").addEventListener("click", () => goToScene("scene-gallery"));

// ===================== 5. THƯ VIỆN ẢNH CUỘL DỌC =====================
let galleryInited = false;
let lbSources = [];

function enterGallery() {
  if (!galleryInited) {
    galleryInited = true;
    buildScrollGallery();
  }
}

$("#btn-gallery-next").addEventListener("click", () => goToScene("scene-wishes"));

// Ảnh tạm (SVG data URI) nếu ảnh thật lỗi
function placeholderSrc(i) {
  const palettes = [
    ["#3a2a8c", "#ff74b8"],
    ["#2a1b6b", "#ffd479"],
    ["#4b2a9c", "#ff9ccf"],
    ["#1d1a6b", "#c9b6ff"],
  ];
  const emojis = ["🌙", "🎂", "💫", "🎀", "🌸", "✨", "💖", "🎈"];
  const [a, b] = palettes[i % palettes.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><circle cx="480" cy="140" r="130" fill="#fff" fill-opacity=".18"/><text x="50%" y="52%" font-size="180" text-anchor="middle" dominant-baseline="middle">${emojis[i % emojis.length]}</text></svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

// Gallery cuộn dọc: mỗi ảnh chiếm trọn màn hình, snap khi cuộn
function buildScrollGallery() {
  const container = $("#gallery-scroll");
  const dots = $("#gallery-dots");
  container.innerHTML = "";
  dots.innerHTML = "";
  const sources = CONFIG.images.length ? CONFIG.images : [placeholderSrc(0)];
  lbSources = sources;
  let pointerStartScroll = 0;

  sources.forEach((src, i) => {
    const slide = document.createElement("figure");
    slide.className = "gslide";
    const img = document.createElement("img");
    img.src = src;
    img.loading = "lazy";
    img.alt = "Ảnh kỷ niệm " + (i + 1);
    img.draggable = false;
    const ph = placeholderSrc(i);
    img.addEventListener("error", () => { if (!img.src.startsWith("data:")) img.src = ph; });
    slide.appendChild(img);
    const cap = document.createElement("figcaption");
    cap.textContent = (i + 1) + " / " + sources.length;
    slide.appendChild(cap);
    // Phân biệt cuộn và bấm: chỉ mở lightbox khi không cuộn
    slide.addEventListener("pointerdown", () => { pointerStartScroll = container.scrollTop; });
    slide.addEventListener("click", () => {
      if (Math.abs(container.scrollTop - pointerStartScroll) < 10) openLightbox(i);
    });
    container.appendChild(slide);

    // Chấm tiến trình
    const dot = document.createElement("button");
    dot.className = "gdot";
    dot.type = "button";
    dot.setAttribute("aria-label", "Ảnh " + (i + 1));
    dot.addEventListener("click", () => container.scrollTo({ top: slide.offsetTop, behavior: "smooth" }));
    dots.appendChild(dot);
  });
  if (dots.children[0]) dots.children[0].classList.add("on");

  // Cập nhật chấm tiến trình khi cuộn
  let ticking = false;
  container.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const first = container.querySelector(".gslide");
      const slideH = first ? first.offsetHeight : container.clientHeight;
      const idx = Math.round(container.scrollTop / slideH);
      [...dots.children].forEach((d, i) => d.classList.toggle("on", i === idx));
      ticking = false;
    });
  });
}

// ===================== LIGHTBOX =====================
let lbIndex = 0;

function openLightbox(i) {
  if (!lbSources.length) return;
  lbIndex = ((i % lbSources.length) + lbSources.length) % lbSources.length;
  $("#lightbox-img").src = lbSources[lbIndex];
  $("#lightbox").hidden = false;
}
function closeLightbox() {
  $("#lightbox").hidden = true;
  $("#lightbox-img").src = "";
}
$("#lb-close").addEventListener("click", closeLightbox);
$("#lb-prev").addEventListener("click", (e) => { e.stopPropagation(); openLightbox(lbIndex - 1); });
$("#lb-next").addEventListener("click", (e) => { e.stopPropagation(); openLightbox(lbIndex + 1); });
$("#lightbox").addEventListener("click", (e) => { if (e.target.id === "lightbox") closeLightbox(); });
addEventListener("keydown", (e) => {
  if ($("#lightbox").hidden) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") openLightbox(lbIndex - 1);
  if (e.key === "ArrowRight") openLightbox(lbIndex + 1);
});

// ===================== 6. LỜI CHÚC (kiểu máy đánh chữ) =====================
async function playWishes(token) {
  const list = $("#wishes-list");
  if (list.dataset.done) return; // chỉ chơi 1 lần mỗi lượt
  list.dataset.done = "1";
  list.innerHTML = "";
  for (const text of CONFIG.wishes) {
    if (token !== sceneToken) return;
    const p = document.createElement("p");
    p.className = "wish-line";
    list.appendChild(p);
    if (reduceMotion) { p.textContent = text; continue; }
    for (let i = 1; i <= text.length; i++) {
      if (token !== sceneToken) return;
      p.textContent = text.slice(0, i);
      await wait(26);
    }
    await wait(450);
  }
  await wait(4000);
  if (token !== sceneToken) return;
  goToScene("scene-letter");
}

// ===================== 7. THƯ TAY =====================
async function playLetter(token) {
  const box = $("#letter-lines");
  if (box.dataset.done) return;
  box.dataset.done = "1";
  box.innerHTML = "";
  const sig = $("#letter-signature");
  sig.textContent = "";
  sig.classList.remove("write");
  for (const line of CONFIG.letter) {
    if (token !== sceneToken) return;
    const p = document.createElement("p");
    p.textContent = line;
    box.appendChild(p);
    if (!reduceMotion) await wait(950); // hiệu ứng viết từng dòng
  }
  sig.textContent = "— " + CONFIG.senderName;
  sig.classList.add("write");
  await wait(3500);
  if (token !== sceneToken) return;
  goToScene("scene-end");
}

// ===================== 8. KẾT =====================
function enterEnd() {
  if (window.confetti && !reduceMotion) {
    const colors = ["#ff5fa2", "#ffd166", "#ffffff", "#ff8fc7"];
    confetti({ particleCount: 130, spread: 80, origin: { y: 0.55 }, colors });
    setTimeout(() => confetti({ particleCount: 70, angle: 60, spread: 60, origin: { x: 0, y: 0.7 }, colors }), 250);
    setTimeout(() => confetti({ particleCount: 70, angle: 120, spread: 60, origin: { x: 1, y: 0.7 }, colors }), 400);
  }
  if (window.gsap && !reduceMotion) {
    gsap.from(".end-title", { scale: 0.6, opacity: 0, duration: 1.1, ease: "back.out(1.8)" });
  }
}

$("#btn-replay").addEventListener("click", () => {
  // Đặt lại trạng thái để xem lại từ đầu
  $("#wish-reveal").classList.remove("show");
  const list = $("#wishes-list");
  list.innerHTML = "";
  delete list.dataset.done;
  const box = $("#letter-lines");
  box.innerHTML = "";
  delete box.dataset.done;
  const sig = $("#letter-signature");
  sig.textContent = "";
  sig.classList.remove("write");
  stopFx();
  goToScene("scene-intro");
  scrollTo(0, 0);
});

// ===================== KHỞI TẠO =====================
function init() {
  // Điền nội dung cá nhân hóa từ CONFIG
  $("#intro-name").textContent = CONFIG.recipientName;
  $("#intro-date").textContent = `${CONFIG.birthDate} • ${CONFIG.age} tuổi`;
  $("#cake-name").textContent = CONFIG.recipientName;
  $("#gallery-name").textContent = CONFIG.recipientName;
  $("#end-sender").textContent = CONFIG.senderName;
  initStarfield();
  sizeFxCanvas();
  requestAnimationFrame(bgLoop);
  requestAnimationFrame(micLoop);
  goToScene("scene-intro");
}

init();
