/* ============================================================
   WEBSITE CHÚC MỪNG SINH NHẬT 🎂
   Phong cách viral TikTok/Douyin — tối ưu cho điện thoại.
   Mọi nội dung cần cá nhân hóa đều nằm trong CONFIG bên dưới.
   ============================================================ */

// ===================== CẤU HÌNH — CHỈNH SỬA TẠI ĐÂY =====================
const CONFIG = {
  recipientName: "Trần Thị Hồng Loan",        // Tên người nhận quà
  birthDate: "07/10/2009",         // Ngày sinh
  age: 18,                          // Tuổi (số nến tự động theo tuổi, tối đa 12 để đẹp trên mobile)
  senderName: "Nguyễn Mạnh Cường",       // Người gửi (ký tên cuối thư)
  wishes: [                         // 3–5 câu chúc (hiện kiểu máy đánh chữ)
    "Chúc mừng sinh nhật bạn Loan nha ! ",
    "Chúc cho bạn luôn vui vẻ,khỏe mạnh và ngày càng đẹp zai hơn.",
    "Cảm ơn bạn vì chúng ta đã chơi với nhau được gần 1 năm nà.",
  ],
  letter: [                         // Thư tay ngắn — mỗi phần tử là một dòng
    "Tuổi mới phải trưởng thành hơn nhé,",
    "chúc bạn có 1 ngày thật tuyệt vời nha.",
    "Mong cô nhận được nhiều lời chúc từ mọi người xung quanh,",
    "nếu có vấn đề đừng buồn tui nha tu code gà lắm. 🌸",
    "Bước sang tuổi mới rồi bớt bắt nạt em nha,",
    "chịu khó để ý thằng này 1 tý.",
  ],
  images: [                         // 6–10 ảnh trong assets/images (tên không dấu, không khoảng trắng)
    "assets/images/1.jpg",
    "assets/images/2.jpg",
    "assets/images/3.jpg",
    "assets/images/4.jpg",
  ],
  music: "",                        // Đường dẫn file mp3, vd: "assets/audio/birthday.mp3". Để trống sẽ phát nhạc nền nhẹ tự tạo.
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
  // Giai điệu nhẹ nhàng dùng khi chưa có file mp3 (Web Audio)
  melody: [523.25, 659.25, 783.99, 1046.5, 783.99, 659.25, 523.25, 392.0],
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
    const playNote = () => {
      if (!this.playing) return;
      const f = this.melody[this.noteIdx % this.melody.length];
      this.noteIdx++;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = f;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.12, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.9);
      osc.connect(gain).connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 1);
      this.timer = setTimeout(playNote, 420);
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

// Tạo sprite chấm phát sáng sẵn để vết nhanh (tránh shadowBlur nặng)
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

// Lấy toạ độ điểm ảnh của chữ để hạt xếp thành chữ
function sampleTextPoints(text, baseSize) {
  const w = fxC.width, h = fxC.height;
  const off = document.createElement("canvas");
  off.width = w;
  off.height = h;
  const g = off.getContext("2d");
  // Tự giảm cỡ chữ cho vừa màn hình
  let size = baseSize;
  g.font = `400 ${size}px 'Great Vibes', cursive`;
  const maxW = w * 0.88;
  while (g.measureText(text).width > maxW && size > 20) {
    size -= 4;
    g.font = `400 ${size}px 'Great Vibes', cursive`;
  }
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillStyle = "#fff";
  g.fillText(text, w / 2, h / 2 - h * 0.02);
  const data = g.getImageData(0, 0, w, h).data;
  const step = isMobile ? 4 : 3;
  const pts = [];
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      if (data[(y * w + x) * 4 + 3] > 120) pts.push({ x, y });
    }
  }
  return pts;
}

// Toạ độ hình trái tim (đường cong tham số)
function heartPoints(count) {
  const dpr = fxC.width / innerWidth;
  const s = Math.min(innerWidth, innerHeight) * 0.028 * dpr;
  const cx = fxC.width / 2, cy = fxC.height * 0.46;
  const pts = [];
  for (let i = 0; i < count; i++) {
    const t = Math.random() * Math.PI * 2;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    pts.push({ x: cx + x * s, y: cy - y * s });
  }
  return pts;
}

function setTargets(points) {
  const n = fx.parts.length;
  for (let i = 0; i < n; i++) {
    const p = points[(Math.random() * points.length) | 0];
    fx.parts[i].tx = p.x;
    fx.parts[i].ty = p.y;
  }
}

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
  for (const p of fx.parts) {
    // Hạt bay Ease-out về toạ độ mục tiêu, có chút nhiễu để lung linh
    p.x += (p.tx - p.x) * 0.075 + (Math.random() - 0.5) * 0.4;
    p.y += (p.ty - p.y) * 0.075 + (Math.random() - 0.5) * 0.4;
    g.globalAlpha = 0.55 + 0.45 * Math.sin(now * 0.004 + p.phase);
    const r = p.size * dpr;
    g.drawImage(p.sprite, p.x - r, p.y - r, r * 2, r * 2);
  }
  g.globalAlpha = 1;
  // Hiệu ứng trái tim đập nhẹ
  if (fx.heartMode && !reduceMotion) {
    const beat = 1 + 0.09 * Math.pow(Math.sin(now * 0.005), 2);
    fxC.style.transform = `scale(${beat})`;
  } else {
    fxC.style.transform = "";
  }
}

function stopFx() {
  fx.running = false;
  fx.heartMode = false;
  fxC.style.transform = "";
}

async function startParticles(token) {
  await document.fonts.ready; // đợi font viết tay để xếp chữ đúng hình
  sizeFxCanvas();
  const count = Math.round((isLowEnd ? 380 : 750) * PARTICLE_SCALE);
  fx.parts = Array.from({ length: count }, () => ({
    x: Math.random() * fxC.width,
    y: Math.random() * fxC.height,
    tx: 0, ty: 0,
    size: 2 + Math.random() * 2.5,
    phase: Math.random() * Math.PI * 2,
    sprite: dotSprite(COLORS[(Math.random() * COLORS.length) | 0]),
  }));
  fx.sparks = [];
  fx.rockets = [];
  fx.running = true;
  fx.heartMode = false;
  fx.lastLaunch = 0;
  requestAnimationFrame(fxLoop);

  const m = Math.min(innerWidth, innerHeight);
  const titleFont = Math.round(m * 0.16);
  const nameFont = Math.round(m * 0.13);

  setTargets(sampleTextPoints("Happy Birthday", titleFont));
  await wait(2600); if (token !== sceneToken) return;
  setTargets(sampleTextPoints(CONFIG.recipientName, nameFont));
  await wait(2800); if (token !== sceneToken) return;
  // Tan ra rồi tụ thành trái tim đập nhẹ
  for (const p of fx.parts) {
    p.tx = Math.random() * fxC.width;
    p.ty = Math.random() * fxC.height;
  }
  await wait(900); if (token !== sceneToken) return;
  fx.heartMode = true;
  setTargets(heartPoints(fx.parts.length));
  await wait(5600); if (token !== sceneToken) return;
  fx.heartMode = false;
  stopFx();
  goToScene("scene-cake");
}

// ===================== 4. BÁNH KEM & THỔI NẾN =====================
let candlesLit = 0;
let micCtx = null, analyser = null, micData = null, micStream = null;
let micReady = false, micDenied = false, blowHold = 0;

function buildCandles() {
  const row = $("#candle-row");
  row.innerHTML = "";
  const n = Math.max(1, Math.min(CONFIG.age, 12)); // giới hạn 12 nến để đẹp trên mobile, tối thiểu 1 nến
  candlesLit = n;
  for (let i = 0; i < n; i++) {
    const b = document.createElement("button");
    b.className = "candle";
    b.type = "button";
    b.setAttribute("aria-label", `Nến ${i + 1} — bấm để tắt`);
    b.innerHTML = '<span class="smoke"></span><span class="flame"></span><span class="wick"></span><span class="stick"></span>';
    b.addEventListener("click", () => extinguishCandle(b));
    row.appendChild(b);
  }
}

function extinguishCandle(candle) {
  if (candle.classList.contains("out")) return;
  candle.classList.add("out"); // khói bay nhờ CSS animation
  candlesLit--;
  if (candlesLit === 0) celebrate();
}

function blowAllCandles() {
  $$("#candle-row .candle").forEach((c, i) => setTimeout(() => extinguishCandle(c), i * 90));
}

function celebrate() {
  $("#mic-hint").textContent = "";
  $("#btn-mic").style.display = "none";
  $("#wish-reveal").classList.add("show");
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

function enterCake(token) {
  buildCandles();
  $("#wish-reveal").classList.remove("show");
  $("#btn-mic").style.display = "";
  $("#mic-hint").textContent = micDenied
    ? "Không dùng được micro — hãy bấm vào nến để tắt 💡"
    : "Thổi nến đi nào! (hoặc bấm vào nến)";
  tryInitMic(); // xin quyền; nếu bị chặn thì nút "Cho phép micro" vẫn hiện
  if (token !== sceneToken) return;
  // Tự động sang cảnh tiếp sau 25s nếu chưa tắt nến
  wait(25000).then(() => { if (token === sceneToken && candlesLit > 0) goToScene("scene-gallery"); });
}

$("#btn-mic").addEventListener("click", tryInitMic);
$("#btn-cake-next").addEventListener("click", () => goToScene("scene-gallery"));

// ===================== 5. VÒNG ẢNH 3D (Three.js) =====================
let galleryInited = false;

function enterGallery() {
  if (!galleryInited) {
    galleryInited = true;
    initGallery();
  }
}

$("#btn-gallery-next").addEventListener("click", () => goToScene("scene-wishes"));

async function initGallery() {
  const container = $("#gallery-3d");
  const sources = CONFIG.images.length ? CONFIG.images : ["assets/images/photo-1.svg"];
  let THREE;
  try {
    THREE = await import("three");
    try {
      buildThreeGallery(THREE, container, sources);
      return;
    } catch (e) {
      console.warn("WebGL không khả dụng — dùng gallery 2D", e);
    }
  } catch (e) {
    console.warn("Three.js không tải được — dùng gallery 2D", e);
  }
  build2dGallery(container, sources);
}

// Ảnh tạm nếu ảnh thật tải lỗi
function makePlaceholderCanvas(i) {
  const c = document.createElement("canvas");
  c.width = 400;
  c.height = 300;
  const g = c.getContext("2d");
  const hue = (i * 47) % 360;
  const grad = g.createLinearGradient(0, 0, 400, 300);
  grad.addColorStop(0, `hsl(${hue}, 60%, 30%)`);
  grad.addColorStop(1, `hsl(${(hue + 60) % 360}, 70%, 55%)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, 400, 300);
  g.fillStyle = "#ffe9a8";
  g.font = "40px Georgia";
  g.textAlign = "center";
  g.fillText("Ảnh " + (i + 1), 200, 160);
  return c;
}

// Trái tim phát sáng ở chính giữa vòng ảnh
function makeHeartCanvas() {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d");
  g.translate(128, 138);
  g.scale(6, 6);
  g.beginPath();
  for (let t = 0; t <= Math.PI * 2 + 0.01; t += 0.05) {
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    if (t === 0) g.moveTo(x, y); else g.lineTo(x, y);
  }
  const grad = g.createLinearGradient(0, -20, 0, 20);
  grad.addColorStop(0, "#ff8fc7");
  grad.addColorStop(1, "#ff5fa2");
  g.fillStyle = grad;
  g.shadowColor = "#ff5fa2";
  g.shadowBlur = 12;
  g.fill();
  return c;
}

function makeGlowCanvas() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d");
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, "rgba(255,143,199,.8)");
  grad.addColorStop(1, "rgba(255,143,199,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  return c;
}

function buildThreeGallery(THREE, container, sources) {
  const W = container.clientWidth || innerWidth;
  const H = container.clientHeight || innerHeight * 0.6;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, W / Math.max(1, H), 0.1, 100);
  camera.position.set(0, 1.3, 11.5);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.setSize(W, H);
  container.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xffffff, 0.7));
  const pinkLight = new THREE.PointLight(0xff5fa2, 60, 40);
  pinkLight.position.set(0, 2.4, 2);
  scene.add(pinkLight);
  const goldLight = new THREE.PointLight(0xffd166, 40, 40);
  goldLight.position.set(3, 0, 4);
  scene.add(goldLight);

  const heart = new THREE.Sprite(new THREE.SpriteMaterial({
    map: new THREE.CanvasTexture(makeHeartCanvas()), transparent: true, depthWrite: false,
  }));
  heart.position.set(0, 2.35, 0);
  heart.scale.set(2.4, 2.4, 1);
  scene.add(heart);
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({
    map: new THREE.CanvasTexture(makeGlowCanvas()), transparent: true, opacity: 0.5,
    depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  halo.position.copy(heart.position);
  halo.scale.set(6, 6, 1);
  scene.add(halo);

  // Ảnh xếp thành vòng tròn quanh trái tim
  const ring = new THREE.Group();
  const R = 5.6;
  const photoMeshes = [];
  sources.forEach((src, i) => {
    const mat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1.75, 1.3), mat);
    const theta = (i / sources.length) * Math.PI * 2;
    mesh.position.set(R * Math.sin(theta), Math.sin(theta * 3) * 0.55, R * Math.cos(theta));
    mesh.rotation.y = theta; // quay mặt ra ngoài vòng tròn
    mesh.userData.src = src;
    new THREE.TextureLoader().load(src,
      (tex) => { mat.map = tex; mat.needsUpdate = true; },
      undefined,
      () => { mat.map = new THREE.CanvasTexture(makePlaceholderCanvas(i)); mat.needsUpdate = true; }
    );
    ring.add(mesh);
    photoMeshes.push(mesh);
  });
  scene.add(ring);

  // Kéo / vuốt để xoay, có quán tính; bấm để phóng to ảnh
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const el = renderer.domElement;
  let dragging = false, lastX = 0, vel = 0, rotY = 0, autoRotate = true, moved = 0;

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
    rotY += dx * 0.006;
    vel = dx * 0.006;
  });
  const endDrag = (e) => {
    if (!dragging) return;
    dragging = false;
    setTimeout(() => { autoRotate = true; }, 2500);
    if (moved < 8) { // coi là bấm → tìm ảnh bị bấm
      const rect = el.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(photoMeshes)[0];
      if (hit) openLightbox(hit.object.userData.src);
    }
  };
  el.addEventListener("pointerup", endDrag);
  el.addEventListener("pointercancel", endDrag);

  addEventListener("resize", () => {
    const w = container.clientWidth || innerWidth;
    const h = container.clientHeight || innerHeight * 0.6;
    camera.aspect = w / Math.max(1, h);
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });

  let last = performance.now();
  (function loop(now) {
    requestAnimationFrame(loop);
    if (currentScene !== "scene-gallery" || document.hidden) return; // chỉ render khi cần
    const dt = Math.min(50, now - last);
    last = now;
    if (!dragging && autoRotate && !reduceMotion) rotY += dt * 0.00012;
    if (!dragging && Math.abs(vel) > 0.0001) { rotY += vel; vel *= 0.95; }
    ring.rotation.y = rotY;
    // Trái tim đập nhẹ
    const beat = 1 + 0.1 * Math.pow(Math.sin(now * 0.004), 2);
    heart.scale.set(2.4 * beat, 2.4 * beat, 1);
    halo.material.opacity = 0.35 + 0.15 * Math.sin(now * 0.004);
    renderer.render(scene, camera);
  })(performance.now());
}

// Phương án dự phòng: gallery ngang cuộn (khi Three.js/WebGL lỗi)
function build2dGallery(container, sources) {
  container.classList.add("gallery-2d");
  sources.forEach((src) => {
    const img = document.createElement("img");
    img.src = src;
    img.loading = "lazy";
    img.alt = "Ảnh kỷ niệm";
    img.addEventListener("click", () => openLightbox(src));
    container.appendChild(img);
  });
}

// ===================== LIGHTBOX =====================
function openLightbox(src) {
  $("#lightbox-img").src = src;
  $("#lightbox").hidden = false;
}
function closeLightbox() {
  $("#lightbox").hidden = true;
  $("#lightbox-img").src = "";
}
$("#lb-close").addEventListener("click", closeLightbox);
$("#lightbox").addEventListener("click", (e) => { if (e.target.id === "lightbox") closeLightbox(); });
addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });

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

// Đánh dấu đã khởi động xong (dùng cho kiểm tra lỗi trong index.html)
window.__appReady = true;
