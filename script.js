const CONFIG = {
  recipientName: "người đặc biệt",
  senderName: "người luôn mong bạn hạnh phúc",
  heroTitle: "Có một món quà đang đợi bạn mở",
  heroLead: "Chạm vào hộp quà. Mọi điều bên trong được gói bằng sự dịu dàng.",
  bookPages: [
    "Có những ngày chỉ cần bạn mỉm cười, cả thế giới đã dịu lại một chút.",
    "Mong tuổi mới của bạn luôn có đủ bình yên để nghỉ ngơi, đủ can đảm để bước tiếp, và đủ yêu thương để thấy mình được trân trọng.",
    "Những điều tốt đẹp nhất không cần ồn ào. Chúng đến như ánh sáng buổi sáng, nhẹ nhàng nhưng làm lòng người ấm lên.",
    "Hôm nay là ngày của bạn. Hãy nhận lấy tất cả sự quan tâm, những cái ôm, những lời chúc, và cả những điều may mắn đang tới."
  ],
  finalTitle: "Chúc mừng sinh nhật, người đặc biệt",
  finalMessage: [
    "Chúc bạn một tuổi mới thật ấm, thật sáng, và thật hiền với chính mình.",
    "Mong mỗi ngày phía trước đều có một lý do nhỏ để bạn vui, một người sẵn sàng lắng nghe, và một khoảng trời riêng để bạn được là bạn.",
    "Cảm ơn vì bạn đã có mặt trên đời này. Sự hiện diện của bạn là một điều rất đáng được nâng niu."
  ]
};

const stages = [...document.querySelectorAll(".stage")];
const dots = [...document.querySelectorAll(".progress-dots span")];
const sky = document.getElementById("sky");
const ctx = sky.getContext("2d");
const confettiLayer = document.getElementById("confettiLayer");

const openGiftButton = document.getElementById("openGift");
const takeKeyButton = document.getElementById("takeKey");
const openBookButton = document.getElementById("openBook");
const celebrateAgainButton = document.getElementById("celebrateAgain");
const sparkAgainButton = document.getElementById("sparkAgain");
const storybook = document.getElementById("storybook");
const paperText = document.getElementById("paperText");
const paperCount = document.getElementById("paperCount");

let audioContext;
let particles = [];
let fireworks = [];
let shootingStars = [];
let stageName = "gift";

function hydrateCopy() {
  document.getElementById("heroTitle").textContent = CONFIG.heroTitle;
  document.getElementById("heroLead").textContent = CONFIG.heroLead;
  document.getElementById("bookRecipient").textContent = CONFIG.recipientName;
  document.getElementById("finalTitle").textContent = CONFIG.finalTitle;
  document.getElementById("signature").textContent = `- Từ ${CONFIG.senderName}`;

  const warmMessage = document.getElementById("warmMessage");
  warmMessage.innerHTML = "";
  CONFIG.finalMessage.forEach((line) => {
    const paragraph = document.createElement("p");
    paragraph.textContent = line;
    warmMessage.appendChild(paragraph);
  });
}

function showStage(name) {
  stageName = name;
  stages.forEach((stage) => {
    stage.classList.toggle("is-active", stage.dataset.stage === name);
  });
  dots.forEach((dot) => {
    dot.classList.toggle("is-active", dot.dataset.dot === name);
  });
}

function ensureAudio() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function playTone(frequency, start, duration, type = "sine", gainValue = 0.055) {
  if (!audioContext) return;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime + start);
  gain.gain.setValueAtTime(0.0001, audioContext.currentTime + start);
  gain.gain.exponentialRampToValueAtTime(gainValue, audioContext.currentTime + start + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + start + duration);

  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(audioContext.currentTime + start);
  oscillator.stop(audioContext.currentTime + start + duration + 0.04);
}

function playChime(kind = "open") {
  ensureAudio();
  const notes = kind === "final" ? [392, 523.25, 659.25, 783.99, 1046.5] : [329.63, 392, 493.88, 659.25];
  notes.forEach((note, index) => playTone(note, index * 0.09, 0.42, "triangle", 0.048));
  if (kind === "final") {
    playTone(196, 0, 1.3, "sine", 0.035);
  }
}

function resizeSky() {
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  sky.width = Math.floor(window.innerWidth * pixelRatio);
  sky.height = Math.floor(window.innerHeight * pixelRatio);
  sky.style.width = `${window.innerWidth}px`;
  sky.style.height = `${window.innerHeight}px`;
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  particles = Array.from({ length: Math.min(90, Math.floor(window.innerWidth / 18)) }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    radius: Math.random() * 1.8 + 0.4,
    speed: Math.random() * 0.25 + 0.08,
    alpha: Math.random() * 0.45 + 0.18
  }));
}

function spawnFirework(x = Math.random() * window.innerWidth, y = Math.random() * window.innerHeight * 0.52) {
  const palette = ["#f4c95d", "#f5a6bb", "#96c7ef", "#9ad7c2", "#ffffff"];
  for (let i = 0; i < 72; i += 1) {
    const angle = (Math.PI * 2 * i) / 72;
    const speed = Math.random() * 4.2 + 1.7;
    fireworks.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      decay: Math.random() * 0.012 + 0.012,
      color: palette[Math.floor(Math.random() * palette.length)]
    });
  }
}

function spawnShootingStar() {
  shootingStars.push({
    x: Math.random() * window.innerWidth * 0.72,
    y: Math.random() * window.innerHeight * 0.34,
    vx: Math.random() * 7 + 7,
    vy: Math.random() * 3 + 2,
    life: 1
  });
}

function drawSky() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  particles.forEach((particle) => {
    particle.y -= particle.speed;
    particle.x += Math.sin((particle.y + particle.radius) * 0.012) * 0.18;
    if (particle.y < -10) {
      particle.y = window.innerHeight + 10;
      particle.x = Math.random() * window.innerWidth;
    }
    ctx.beginPath();
    ctx.fillStyle = `rgba(255, 255, 255, ${particle.alpha})`;
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fill();
  });

  fireworks = fireworks.filter((spark) => spark.life > 0);
  fireworks.forEach((spark) => {
    spark.vy += 0.045;
    spark.x += spark.vx;
    spark.y += spark.vy;
    spark.life -= spark.decay;
    ctx.globalAlpha = Math.max(spark.life, 0);
    ctx.fillStyle = spark.color;
    ctx.beginPath();
    ctx.arc(spark.x, spark.y, 2.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  });

  shootingStars = shootingStars.filter((star) => star.life > 0);
  shootingStars.forEach((star) => {
    const gradient = ctx.createLinearGradient(star.x, star.y, star.x - 120, star.y - 48);
    gradient.addColorStop(0, "rgba(255, 255, 255, 0.95)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(star.x, star.y);
    ctx.lineTo(star.x - 120, star.y - 48);
    ctx.stroke();
    star.x += star.vx;
    star.y += star.vy;
    star.life -= 0.018;
  });

  requestAnimationFrame(drawSky);
}

function burstConfetti(count = 90) {
  const colors = ["#f4c95d", "#f5a6bb", "#96c7ef", "#9ad7c2", "#9883dd", "#ffffff"];
  for (let i = 0; i < count; i += 1) {
    const piece = document.createElement("i");
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.setProperty("--fall-x", `${Math.random() * 240 - 120}px`);
    piece.style.setProperty("--fall-duration", `${Math.random() * 1300 + 1800}ms`);
    piece.style.transform = `rotate(${Math.random() * 180}deg)`;
    confettiLayer.appendChild(piece);
    window.setTimeout(() => piece.remove(), 3600);
  }
}

function cycleBookPages() {
  let index = 0;
  paperText.textContent = CONFIG.bookPages[index];
  paperCount.textContent = "01";

  const turn = () => {
    index += 1;
    if (index >= CONFIG.bookPages.length) {
      window.setTimeout(() => {
        showStage("final");
        playChime("final");
        burstConfetti(140);
        spawnFirework(window.innerWidth * 0.25, window.innerHeight * 0.34);
        spawnFirework(window.innerWidth * 0.72, window.innerHeight * 0.28);
      }, 1200);
      return;
    }

    storybook.classList.add("is-turning");
    window.setTimeout(() => {
      paperText.textContent = CONFIG.bookPages[index];
      paperCount.textContent = String(index + 1).padStart(2, "0");
    }, 310);
    window.setTimeout(() => storybook.classList.remove("is-turning"), 860);
    window.setTimeout(turn, 2700);
  };

  window.setTimeout(turn, 2300);
}

openGiftButton.addEventListener("click", () => {
  openGiftButton.classList.add("is-open");
  playChime("open");
  burstConfetti(70);
  spawnFirework(window.innerWidth * 0.5, window.innerHeight * 0.38);
  window.setTimeout(() => showStage("key"), 1200);
});

takeKeyButton.addEventListener("click", () => {
  playChime("open");
  spawnShootingStar();
  burstConfetti(45);
  window.setTimeout(() => showStage("book"), 620);
});

openBookButton.addEventListener("click", () => {
  openBookButton.disabled = true;
  storybook.classList.add("is-open");
  playChime("open");
  burstConfetti(55);
  window.setTimeout(cycleBookPages, 780);
});

celebrateAgainButton.addEventListener("click", () => {
  storybook.classList.remove("is-open", "is-turning");
  openGiftButton.classList.remove("is-open");
  openBookButton.disabled = false;
  paperText.textContent = CONFIG.bookPages[0];
  paperCount.textContent = "01";
  showStage("gift");
});

sparkAgainButton.addEventListener("click", () => {
  playChime("final");
  burstConfetti(90);
  spawnFirework(window.innerWidth * 0.28, window.innerHeight * 0.32);
  spawnFirework(window.innerWidth * 0.58, window.innerHeight * 0.24);
  spawnFirework(window.innerWidth * 0.78, window.innerHeight * 0.42);
});

window.addEventListener("resize", resizeSky);
window.setInterval(() => {
  if (stageName !== "gift") spawnShootingStar();
}, 4200);

hydrateCopy();
resizeSky();
drawSky();
