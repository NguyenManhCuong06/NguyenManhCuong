/* ============================================================
   WEBSITE CHÚC MỪNG SINH NHẬT 🎂 — Theme pastel sáng
   Single-page: hộp quà → hero → bánh kem thổi nến → lời chúc
   → kỷ niệm → thư viện → lá thư.
   Mọi nội dung cần cá nhân hóa đều nằm trong CONFIG bên dưới.
   ============================================================ */

// ===================== CẤU HÌNH — CHỈNH SỬA TẠI ĐÂY =====================
const CONFIG = {
  name: "Trần Thị Hồng Loan",      // Tên người nhận (hiện ở tiêu đề chính)
  nickname: "Loan",                // Tên gọi thân mật
  sender: "Nguyễn Mạnh Cường",     // Người gửi (ký tên cuối thư)
  relation: "bạn thân",            // Quan hệ với người gửi
  birthdayISO: "2009-10-07T00:00:00", // Ngày sinh (để tính đếm ngược & tuổi)
  birthdayDisplay: "07/10/2009",   // Ngày sinh hiển thị
  audioSrc: "",                    // Đường dẫn mp3 nhạc nền. Để trống sẽ tự chơi "Happy Birthday" (public domain).
  wishes: [                        // Lời chúc (hiện trong card)
    "Chúc mừng sinh nhật bạn Loan nha !",
    "Chúc cho bạn luôn vui vẻ,khỏe mạnh và ngày càng đẹp zai hơn.",
    "Cảm ơn bạn vì chúng ta đã chơi với nhau được gần 1 năm nè.",
  ],
  memories: [                      // Kỷ niệm (timeline). src để trống sẽ dùng ảnh placeholder.
    {
      title: "Lần đầu mình làm bạn",
      date: "Mùa thu năm đó",
      text: "Một buổi chiều mưa, hai chiếc ô, và câu chào ngượng ngùng đã mở đầu cho tất cả.",
      src: "assets/images/photo-1.jpg",
      alt: "Ảnh kỷ niệm lần đầu gặp nhau",
    },
    {
      title: "Chuyến đi không kế hoạch",
      date: "Một cuối tuần nọ",
      text: "Lạc đường cả buổi nhưng lại là chuyến đi mình cười nhiều nhất.",
      src: "assets/images/photo-2.jpg",
      alt: "Ảnh chuyến đi chơi cùng nhau",
    },
    {
      title: "Sinh nhật năm ngoái",
      date: "Một năm trước",
      text: "Chiếc bánh bị nghiêng, nến cháy lệch, nhưng điều ước thì vẫn thành sự thật.",
      src: "assets/images/photo-3.jpg",
      alt: "Ảnh sinh nhật năm ngoái",
    },
  ],
  gallery: [                       // Thư viện ảnh (masonry). ratio = rộng/cao.
    { src: "assets/images/photo-1.jpg", alt: "Khoảnh khắc 1", ratio: 1.25 },
    { src: "assets/images/photo-2.jpg", alt: "Khoảnh khắc 2", ratio: 0.8 },
    { src: "assets/images/photo-3.jpg", alt: "Khoảnh khắc 3", ratio: 1 },
    { src: "assets/images/photo-4.jpg", alt: "Khoảnh khắc 4", ratio: 0.72 },
  ],
  letter: [                        // Thư tay — mỗi phần tử là một dòng
    "Tuổi mới phải trưởng thành hơn nhé,",
    "chúc cô có 1 ngày thật tuyệt vời nha.",
    "Mong cô nhận được nhiều lời chúc từ mọi người xung quanh,",
    "nếu có vấn đề đừng buồn tui nha tu code gà lắm. 🌸",
    "Bước sang tuổi mới rồi bớt bắt nạt em nha,",
    "chịu khó để ý thằng này 1 tý.",
  ],
  secretWish:                      // Lời chúc bí mật (easter egg: gõ "love" hoặc bấm ✦)
    "Bí mật nhỏ: tui rất vui vì đời này có bạn. Chúc bạn tuổi mới thật nhiều nắng, luôn được cười thật nhiều, và nhớ là tui luôn ở đây nha. Yêu bạn nhiều! 💌",
};

// ===================== TIỆN ÍCH =====================
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const isMobile = matchMedia("(max-width: 768px)").matches;
const isLowEnd =
  isMobile ||
  (navigator.hardwareConcurrency || 8) <= 4 ||
  (navigator.deviceMemory && navigator.deviceMemory <= 4);

// Sinh nhật tiếp theo (tìm ngày tháng năm nay, nếu qua rồi thì lấy năm sau)
function nextBirthday() {
  const b = new Date(CONFIG.birthdayISO);
  const now = new Date();
  let t = new Date(now.getFullYear(), b.getMonth(), b.getDate());
  if (t.getTime() < now.getTime()) t = new Date(now.getFullYear() + 1, b.getMonth(), b.getDate());
  return t;
}
function isBirthdayToday() {
  const b = new Date(CONFIG.birthdayISO);
  const now = new Date();
  return b.getMonth() === now.getMonth() && b.getDate() === now.getDate();
}

// Tuổi sẽ tròn vào sinh nhật tiếp theo → số nến (tối đa 12 để đẹp trên mobile)
const AGE = nextBirthday().getFullYear() - new Date(CONFIG.birthdayISO).getFullYear();
const CANDLE_COUNT = Math.max(1, Math.min(AGE, 12));

// Ảnh placeholder khi chưa có ảnh thật (SVG gradient + emoji)
const PALETTES = [
  ["#ffb3c7", "#c7a8f5"],
  ["#ffd3a5", "#fd9db5"],
  ["#b9e3ff", "#d3b6ff"],
  ["#ffe6a7", "#ffadc0"],
];
const EMOJI = ["🎈", "🌸", "🍰", "✨", "🎀", "🧁", "💌", "🌷"];
function placeholder(i, w = 800, h = 600) {
  const [a, b] = PALETTES[i % PALETTES.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><circle cx="${w * 0.8}" cy="${h * 0.2}" r="${h * 0.22}" fill="#fff" fill-opacity=".25"/><circle cx="${w * 0.15}" cy="${h * 0.85}" r="${h * 0.3}" fill="#fff" fill-opacity=".18"/><text x="50%" y="52%" font-size="${Math.min(w, h) * 0.22}" text-anchor="middle" dominant-baseline="middle">${EMOJI[i % EMOJI.length]}</text></svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

// ===================== NỀN LẤP LÁNH (DOM bits) =====================
(function buildSparkles() {
  const wrap = document.createElement("div");
  wrap.className = "sparkles";
  wrap.setAttribute("aria-hidden", "true");
  const chars = ["✦", "♥", "·", "✧"];
  const colors = ["#d93f6e", "#b79be8", "#f2c25c"];
  for (let i = 0; i < 16; i++) {
    const s = document.createElement("span");
    s.className = "bit";
    s.textContent = chars[i % 4];
    s.style.left = `${(i * 0.618 * 100) % 100}%`;
    s.style.fontSize = `${10 + ((i * 3) % 14)}px`;
    s.style.color = colors[i % 3];
    s.style.setProperty("--d", `${16 + ((i * 7) % 14)}s`);
    s.style.setProperty("--delay", `${-((i * 5) % 20)}s`);
    wrap.appendChild(s);
  }
  document.body.appendChild(wrap);
})();

// ===================== NHẠC NỀN (chỉ phát sau cử động đầu tiên) =====================
const Music = {
  ctx: null,
  el: null,
  timer: null,
  noteIdx: 0,
  playing: false,
  // Giai điệu "Happy Birthday" (public domain) — mỗi nốt: [tần số Hz, độ dài beat]
  melody: [
    [392.0, 0.75], [392.0, 0.25], [440.0, 1], [392.0, 1], [523.25, 1], [493.88, 2],
    [392.0, 0.75], [392.0, 0.25], [440.0, 1], [392.0, 1], [587.33, 1], [523.25, 2],
    [392.0, 0.75], [392.0, 0.25], [783.99, 1], [659.25, 1], [523.25, 1], [493.88, 1], [440.0, 2],
    [698.46, 0.75], [698.46, 0.25], [659.25, 1], [523.25, 1], [587.33, 1], [523.25, 2],
  ],
  start() {
    if (this.playing) return;
    if (CONFIG.audioSrc) {
      try {
        this.el = this.el || new Audio(CONFIG.audioSrc);
        this.el.loop = true;
        this.el.volume = 0.6;
        const p = this.el.play();
        if (p && p.catch) p.catch(() => this.startMelody());
        this.playing = true;
      } catch (e) {
        this.startMelody(); // lỗi file nhạc → chuyển nhạc tự tạo
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
    this.ctx.resume();
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
    clearTimeout(this.timer);
    if (this.el) this.el.pause();
    updateMusicButton();
  },
};

const musicBtn = $("#music-toggle");
function updateMusicButton() {
  if (!musicBtn) return;
  musicBtn.textContent = Music.playing ? "🔊" : "🔇";
  musicBtn.setAttribute("aria-pressed", String(Music.playing));
  musicBtn.setAttribute("aria-label", Music.playing ? "Tắt nhạc nền" : "Bật nhạc nền");
}
musicBtn.addEventListener("click", () => {
  if (Music.playing) Music.stop();
  else Music.start();
});

// ===================== PHÁO GIẤY (canvas-confetti) =====================
const CONFETTI_COLORS = ["#d93f6e", "#b79be8", "#f2c25c", "#ffbf9b", "#7cc6fe", "#ffffff"];
function fireConfetti(x = 0.5, y = 0.5, count = 90) {
  if (!window.confetti || reduceMotion) return;
  confetti({ particleCount: count, spread: 75, origin: { x, y }, colors: CONFETTI_COLORS });
}

// ===================== GÕ CHỮ (TYPEWRITER) =====================
let typeTimer = null;
function startTypewriter() {
  const el = $("#hero-title-text");
  const caret = $("#hero-caret");
  const full = `Chúc mừng sinh nhật ${CONFIG.name}!`;
  clearInterval(typeTimer);
  el.textContent = "";
  caret.style.display = "";
  if (reduceMotion) {
    el.textContent = full;
    caret.style.display = "none";
    return;
  }
  let i = 0;
  typeTimer = setInterval(() => {
    el.textContent = full.slice(0, ++i);
    if (i >= full.length) {
      clearInterval(typeTimer);
      caret.style.display = "none";
    }
  }, 75);
}

// ===================== ĐẾM NGƯỢC =====================
function tickCountdown() {
  const cd = $("#countdown");
  if (isBirthdayToday()) { cd.hidden = true; return; }
  const diff = nextBirthday().getTime() - Date.now();
  if (diff <= 0) { cd.hidden = true; return; }
  cd.hidden = false;
  const s = Math.floor(diff / 1000);
  $("#cd-d").textContent = String(Math.floor(s / 86400)).padStart(2, "0");
  $("#cd-h").textContent = String(Math.floor((s % 86400) / 3600)).padStart(2, "0");
  $("#cd-m").textContent = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  $("#cd-s").textContent = String(s % 60).padStart(2, "0");
}
tickCountdown();
setInterval(tickCountdown, 1000);

// ===================== CUỘN TỚI HIỆN NỘI DUNG =====================
const revealIO = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        revealIO.unobserve(e.target);
      }
    }
  },
  { threshold: 0.15 }
);
$$(".reveal").forEach((el) => revealIO.observe(el));

// ===================== BÓNG BAY (HERO) =====================
function buildBalloons() {
  const wrap = $("#hero-balloons");
  if (wrap.childElementCount) return;
  const colors = ["#ff8fb0", "#b79be8", "#f2c25c", "#7cc6fe", "#ffbf9b", "#d93f6e", "#c9b6f5", "#ff9cc2"];
  colors.forEach((c, i) => {
    const b = document.createElement("span");
    b.className = "balloon";
    b.setAttribute("aria-hidden", "true");
    b.style.left = `${6 + i * 12}%`;
    b.style.setProperty("--c", c);
    b.style.setProperty("--d", `${11 + (i % 4) * 2.5}s`);
    b.style.setProperty("--delay", `${-(i * 2.3)}s`);
    wrap.appendChild(b);
  });
}

// ===================== MỞ HỘP QUÀ =====================
let opened = false;
function openGift() {
  if (opened) return;
  opened = true;
  document.body.classList.remove("locked");
  $("#intro").classList.add("gift-open");
  Music.start();
  musicBtn.disabled = false;
  fireConfetti(0.5, 0.55, 120);
  setTimeout(() => fireConfetti(0.2, 0.4, 70), 900);
  setTimeout(() => fireConfetti(0.8, 0.4, 70), 900);
  startTypewriter();
  buildBalloons();
  setTimeout(() => $("#intro").classList.add("gone"), 1400);
}
$("#gift-btn").addEventListener("click", openGift);

// ===================== ĐIỀN NỘI DUNG TỪ CONFIG =====================
$("#intro-nickname").textContent = CONFIG.nickname;
$("#hero-birthday").textContent = CONFIG.birthdayDisplay;
$("#hero-nickname").textContent = CONFIG.nickname;
$("#hero-relation").textContent = CONFIG.relation;
$("#made-sender").textContent = CONFIG.sender;
// Khả năng đọc cho screen reader khi đang gõ chữ
const heroTitle = $(".hero-title");
heroTitle.setAttribute("aria-label", `Chúc mừng sinh nhật ${CONFIG.name}!`);
$("#hero-title-text").setAttribute("aria-hidden", "true");
$("#hero-caret").setAttribute("aria-hidden", "true");

// ===================== LỜI CHÚC =====================
(function renderWishes() {
  $("#wish-greet").textContent = `Gửi ${CONFIG.nickname},`;
  const list = $("#wishes-list");
  CONFIG.wishes.forEach((w) => {
    const p = document.createElement("p");
    p.textContent = w;
    list.appendChild(p);
  });
  $("#wish-sign").textContent = `— ${CONFIG.sender}`;
})();

// ===================== TIMELINE KỶ NIỆM =====================
(function renderTimeline() {
  const ol = $("#timeline");
  CONFIG.memories.forEach((m, i) => {
    const li = document.createElement("li");
    li.className = "mem-item";
    const dot = document.createElement("span");
    dot.className = "mem-dot";
    dot.setAttribute("aria-hidden", "true");
    const card = document.createElement("article");
    card.className = "mem-card reveal";
    card.style.transitionDelay = `${(i % 2) * 120}ms`;
    const img = document.createElement("img");
    img.src = m.src || placeholder(i, 800, 500);
    img.alt = m.alt;
    img.loading = "lazy";
    const body = document.createElement("div");
    body.className = "mem-body";
    const date = document.createElement("p");
    date.className = "mem-date";
    date.textContent = m.date;
    const title = document.createElement("h3");
    title.className = "mem-title";
    title.textContent = m.title;
    const text = document.createElement("p");
    text.className = "mem-text";
    text.textContent = m.text;
    body.append(date, title, text);
    card.append(img, body);
    li.append(dot, card);
    ol.appendChild(li);
    revealIO.observe(card);
  });
})();

// ===================== THƯ VIỆN ẢNH + LIGHTBOX =====================
const photos = CONFIG.gallery.map((g, i) => ({
  ...g,
  src: g.src || placeholder(i + 1, 800, Math.round(800 / g.ratio)),
}));

(function renderGallery() {
  const wrap = $("#gallery-masonry");
  photos.forEach((p, i) => {
    const item = document.createElement("div");
    item.className = "masonry-item reveal";
    item.style.transitionDelay = `${(i % 3) * 100}ms`;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "masonry-btn";
    btn.setAttribute("aria-label", `Phóng to: ${p.alt}`);
    const img = document.createElement("img");
    img.src = p.src;
    img.alt = p.alt;
    img.loading = "lazy";
    img.style.aspectRatio = String(p.ratio);
    btn.appendChild(img);
    item.appendChild(btn);
    wrap.appendChild(item);
    revealIO.observe(item);
    btn.addEventListener("click", () => openLightbox(i));
  });
})();

let lbIndex = null;
function openLightbox(i) {
  lbIndex = i;
  updateLightbox();
  $("#lightbox").hidden = false;
}
function updateLightbox() {
  const p = photos[lbIndex];
  $("#lightbox-img").src = p.src;
  $("#lightbox-img").alt = p.alt;
}
function closeLightbox() {
  lbIndex = null;
  $("#lightbox").hidden = true;
}
function stepLightbox(d) {
  if (lbIndex === null) return;
  lbIndex = (lbIndex + d + photos.length) % photos.length;
  updateLightbox();
}
$("#lb-close").addEventListener("click", closeLightbox);
$("#lb-prev").addEventListener("click", (e) => { e.stopPropagation(); stepLightbox(-1); });
$("#lb-next").addEventListener("click", (e) => { e.stopPropagation(); stepLightbox(1); });
$("#lightbox").addEventListener("click", closeLightbox);

// ===================== LÁ THƯ (viết dần) =====================
(function renderLetter() {
  const lines = $("#letter-lines");
  CONFIG.letter.forEach((line, i) => {
    const p = document.createElement("p");
    const span = document.createElement("span");
    span.className = "write";
    span.style.transitionDelay = `${i * 1.2}s`;
    span.textContent = line.replace("{nickname}", CONFIG.nickname);
    p.appendChild(span);
    lines.appendChild(p);
  });
  const signP = $("#letter-sign");
  const signSpan = document.createElement("span");
  signSpan.className = "write";
  signSpan.style.transitionDelay = `${CONFIG.letter.length * 1.2}s`;
  signSpan.textContent = `— ${CONFIG.sender}`;
  signP.appendChild(signSpan);
})();

const letterIO = new IntersectionObserver(
  ([e]) => {
    if (e.isIntersecting) {
      $("#letter-paper").classList.add("in");
      letterIO.disconnect();
    }
  },
  { threshold: 0.3 }
);
letterIO.observe($("#letter-paper"));

// ===================== BÁNH KEM 3D & THỔI NẾN =====================
let candlesLit = 0;
let candleTotal = 0;
let cake = null; // { fallback, THREE, group, candles, smokes, smokeTex }
let micCtx = null, analyser = null, micData = null, micStream = null;
let micReady = false, micDenied = false, blowHold = 0;
let micBase = 0, micFrames = 0; // hiệu chỉnh ngưỡng theo tiếng ồn nền
let cakeInited = false, cakeVisible = false;

// Texture sọc xoắn cho cây nến (đổi màu theo base)
function candleStripeTexture(THREE, base = "#ff8fb0") {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d");
  g.fillStyle = base;
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
  const pinkL = new THREE.PointLight(0xff8fb0, 45, 40);
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
    { r: 1.78, h: 0.85, y: 0.14, c: 0xffd6e0 },
    { r: 1.34, h: 0.72, y: 0.99, c: 0xffbf9b },
    { r: 0.94, h: 0.56, y: 1.71, c: 0xe9defc },
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

  // Kẹo rắc trang trí trên các tầng bánh
  const sprinkleColors = [0xd93f6e, 0xb79be8, 0xf2c25c, 0x7cc6fe];
  const spots = [
    { y: layers[0].y + layers[0].h, r0: layers[1].r, r1: layers[0].r },
    { y: layers[1].y + layers[1].h, r0: layers[2].r, r1: layers[1].r },
    { y: layers[2].y + layers[2].h, r0: 0, r1: layers[2].r },
  ];
  for (const spot of spots) {
    const nSpr = Math.round((spot.r1 - spot.r0) * 14) + 6;
    for (let i = 0; i < nSpr; i++) {
      const a = Math.random() * Math.PI * 2;
      const rr = spot.r0 + Math.random() * Math.max(0.05, spot.r1 - spot.r0);
      const spr = new THREE.Mesh(
        new THREE.SphereGeometry(0.035, 8, 8),
        new THREE.MeshStandardMaterial({ color: sprinkleColors[i % sprinkleColors.length], roughness: 0.3 })
      );
      spr.position.set(Math.cos(a) * rr, spot.y + 0.05, Math.sin(a) * rr);
      group.add(spr);
    }
  }

  // Nến: số nến theo tuổi, xếp vòng trên mặt bánh (tối đa 12)
  const topY = 2.34;
  const n = CANDLE_COUNT;
  // Nến sọc xoắn, đổi màu theo vòng (xanh / vàng / hồng)
  const stripeTexs = ["#7cc6fe", "#ffd479", "#ff8fb0"].map((c) => candleStripeTexture(THREE, c));
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
      new THREE.MeshStandardMaterial({ map: stripeTexs[i % stripeTexs.length], roughness: 0.5 })
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
    if (moved < 8) {
      const rect = el.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(candleMeshes)[0];
      if (hit && hit.object.userData.candle) {
        extinguishCandle(hit.object.userData.candle); // bấm trúng nến → tắt nến đó
      } else if (raycaster.intersectObjects(group.children, true)[0]) {
        // Chạm vào bánh: tắt nến gần nhất và hai nến bên cạnh
        const v = new THREE.Vector3();
        let best = -1, bestDist = Infinity;
        candles.forEach((c, i) => {
          c.stick.getWorldPosition(v);
          v.project(camera);
          const sx = (v.x * 0.5 + 0.5) * rect.width;
          const sy = (-v.y * 0.5 + 0.5) * rect.height;
          const d = Math.hypot(sx - (e.clientX - rect.left), sy - (e.clientY - rect.top));
          if (d < bestDist) { bestDist = d; best = i; }
        });
        if (best >= 0) {
          [best - 1, best, best + 1].forEach((i) => {
            if (candles[i]) extinguishCandle(candles[i]);
          });
        }
      }
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

  // Vòng lặp render: chỉ chạy khi phần bánh kem đang hiển thị
  let last = performance.now();
  (function loop(now) {
    requestAnimationFrame(loop);
    if (!cakeVisible || document.hidden) return;
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
  const n = CANDLE_COUNT;
  const stripeColors = ["#7cc6fe", "#ffd479", "#ff8fb0"];
  const candles = [];
  for (let i = 0; i < n; i++) {
    const b = document.createElement("button");
    b.className = "candle";
    b.type = "button";
    b.style.setProperty("--c", stripeColors[i % stripeColors.length]);
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
  const wr = $("#wish-reveal");
  wr.textContent = "Điều ước của bạn đã được gửi đi ✨";
  wr.classList.add("show");
  stopMic();
  // Pháo giấy nổ (canvas-confetti)
  if (window.confetti && !reduceMotion) {
    confetti({ particleCount: 130, spread: 80, origin: { y: 0.6 }, colors: CONFETTI_COLORS });
    setTimeout(() => confetti({ particleCount: 70, angle: 60, spread: 60, origin: { x: 0, y: 0.7 }, colors: CONFETTI_COLORS }), 250);
    setTimeout(() => confetti({ particleCount: 70, angle: 120, spread: 60, origin: { x: 1, y: 0.7 }, colors: CONFETTI_COLORS }), 400);
  }
}

// Xin quyền micro để phát hiện tiếng thổi (Web Audio API)
async function tryInitMic() {
  if (micReady || micDenied || !navigator.mediaDevices?.getUserMedia) return;
  try {
    micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    micCtx = micCtx || new (window.AudioContext || window.webkitAudioContext)();
    await micCtx.resume();
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

// Đo cường độ âm thanh liên tục, chỉ chạy khi phần bánh kem đang hiển thị.
// Tự hiệu chỉnh ngưỡng theo tiếng ồn nền (30 khung đầu) để thổi chính xác hơn.
function micLoop() {
  requestAnimationFrame(micLoop);
  if (!micReady || !cakeVisible || candlesLit === 0) {
    blowHold = 0;
    micFrames = 0;
    micBase = 0;
    return;
  }
  analyser.getByteTimeDomainData(micData);
  let sum = 0;
  for (let i = 0; i < micData.length; i++) {
    const v = (micData[i] - 128) / 128;
    sum += v * v;
  }
  const rms = Math.sqrt(sum / micData.length);
  if (micFrames < 30) { // đo tiếng ồn nền ban đầu
    micBase = Math.max(micBase, rms);
    micFrames++;
    return;
  }
  blowHold = rms > Math.max(0.1, micBase * 2.5) ? blowHold + 16 : 0; // ngưỡng thổi, giữ 350ms
  if (blowHold > 350) { blowHold = 0; blowAllCandles(); }
}
micLoop();

// Khởi tạo phần bánh kem khi cuộn tới (lazy — chỉ tải Three.js khi cần)
const cakeIO = new IntersectionObserver(
  ([e]) => {
    cakeVisible = e.isIntersecting;
    if (e.isIntersecting && !cakeInited) {
      cakeInited = true;
      $("#mic-hint").textContent = micDenied
        ? "Không dùng được micro — hãy bấm vào nến để tắt 💡"
        : "Thổi nến đi nào! (hoặc chạm vào bánh / nến)";
      buildCake3d();
      updateCandleUI();
      tryInitMic();
    }
  },
  { threshold: 0.1 }
);
cakeIO.observe($("#cake"));

$("#btn-mic").addEventListener("click", tryInitMic);
$("#btn-relight").addEventListener("click", () => {
  resetCandles();
  $("#wish-reveal").classList.remove("show");
  $("#btn-relight").hidden = true;
  $("#btn-mic").style.display = micReady ? "none" : "";
  $("#mic-hint").textContent = micReady
    ? "🎤 Đang lắng nghe… hãy thổi thật mạnh để tắt nến!"
    : "Thổi nến đi nào! (hoặc chạm vào bánh / nến)";
  updateCandleUI();
});

// ===================== PHÁT LẠI HIỆU ỨNG =====================
$("#btn-replay").addEventListener("click", () => {
  scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  resetCandles();
  $("#wish-reveal").classList.remove("show");
  $("#btn-relight").hidden = true;
  $("#btn-mic").style.display = micReady ? "none" : "";
  updateCandleUI();
  startTypewriter();
  buildBalloons();
  fireConfetti(0.5, 0.5, 130);
  Music.start();
});

// ===================== LỜI CHÚC BÍ MẬT (EASTER EGG) =====================
let secretTimer = null;
function showSecret() {
  $("#secret-text").textContent = CONFIG.secretWish;
  $("#secret-toast").hidden = false;
  fireConfetti(0.5, 0.6, 80);
  clearTimeout(secretTimer);
  secretTimer = setTimeout(() => { $("#secret-toast").hidden = true; }, 9000);
}
$("#secret-btn").addEventListener("click", showSecret);
$("#toast-close").addEventListener("click", () => { $("#secret-toast").hidden = true; });

// Trên điện thoại: gõ trong ô nhập cuối trang (để mở bàn phím)
const secretInput = $("#secret-input");
secretInput.addEventListener("input", () => {
  if (secretInput.value.toLowerCase().slice(-4) === "love") {
    showSecret();
    secretInput.value = "";
    secretInput.blur();
  }
});

// Trên máy tính: gõ "love" ở bất cứ đâu → lời chúc bí mật; phím tắt lightbox
let keyBuf = "";
addEventListener("keydown", (e) => {
  if (e.target === secretInput) return; // ô nhập đã xử lý riêng ở trên
  keyBuf = (keyBuf + e.key.toLowerCase()).slice(-4);
  if (keyBuf === "love") showSecret();
  if (lbIndex !== null) {
    if (e.key === "Escape") closeLightbox();
    else if (e.key === "ArrowRight") stepLightbox(1);
    else if (e.key === "ArrowLeft") stepLightbox(-1);
  }
});
