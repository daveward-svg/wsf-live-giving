import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
import { firebaseConfig, campaignPath } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const campaignRef = ref(db, campaignPath);

const els = {
  campaignName: document.getElementById("campaignName"),
  campaignSubtitle: document.getElementById("campaignSubtitle"),
  amountRaised: document.getElementById("amountRaised"),
  goalAmount: document.getElementById("goalAmount"),
  percentage: document.getElementById("percentage"),
  remaining: document.getElementById("remaining"),
  progressTrack: document.getElementById("progressTrack"),
  progressFill: document.getElementById("progressFill"),
  waterLevel: document.getElementById("waterLevel"),
  rainbow: document.getElementById("rainbow"),
  birds: [...document.querySelectorAll(".bird")],
  butterflies: [...document.querySelectorAll(".butterfly")],
  message: document.getElementById("message"),
  status: document.getElementById("status"),
  updated: document.getElementById("updated"),
  giveButton: document.getElementById("giveButton"),
  canvas: document.getElementById("confetti")
};

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});

let animatedAmount = 0;
let celebrated = false;

onValue(
  campaignRef,
  (snapshot) => {
    const data = snapshot.val() || {
      raised: 0,
      goal: 10000,
      name: "Rainforest Falls",
      subtitle: "The Nature of God • Vacation Bible School 2026",
      givingUrl: "https://wsfirst.com/"
    };

    render(data);

    els.status.textContent = snapshot.exists()
      ? "Live from Firebase"
      : "Waiting for first admin update";

    els.updated.textContent = snapshot.exists()
      ? `Updated ${new Date().toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit"
        })}`
      : "Open /admin.html and save the first campaign total.";
  },
  (error) => {
    console.error(error);
    els.status.textContent = "Firebase connection error";
    els.updated.textContent = error.message;
  }
);

function render(data) {
  const raised = Math.max(0, Number(data.raised) || 0);
  const goal = Math.max(1, Number(data.goal) || 10000);
  const percent = Math.min(100, (raised / goal) * 100);
  const remaining = Math.max(0, goal - raised);

  els.campaignName.textContent = data.name || "Rainforest Falls";
  els.campaignSubtitle.textContent =
    data.subtitle || "The Nature of God • Vacation Bible School 2026";
  els.goalAmount.textContent = money.format(goal);
  els.percentage.textContent = `${percent.toFixed(percent < 10 ? 1 : 0)}%`;
  els.remaining.textContent = money.format(remaining);
  els.progressFill.style.width = `${percent}%`;
  els.progressTrack.setAttribute("aria-valuenow", String(Math.round(percent)));
  els.waterLevel.style.height = `${8 + percent * 0.92}%`;
  els.rainbow.classList.toggle("visible", percent >= 75);
  els.birds.forEach((el) => el.classList.toggle("visible", percent >= 25));
  els.butterflies.forEach((el) => el.classList.toggle("visible", percent >= 50));
  els.message.textContent = impactMessage(percent);
  els.giveButton.href = data.givingUrl || "https://wsfirst.com/";

  animateAmount(raised);

  if (percent >= 100 && !celebrated) {
    celebrated = true;
    launchConfetti();
  } else if (percent < 100) {
    celebrated = false;
  }
}

function impactMessage(percent) {
  if (percent >= 100) return "Goal reached! Thank you, Winston Salem First!";
  if (percent >= 75) return "The rainbow is shining—our goal is within reach!";
  if (percent >= 50) return "Halfway there! Thank you for helping VBS come to life.";
  if (percent >= 25) return "We reached our first milestone. Keep the waterfall flowing!";
  return "Every gift helps children discover the wonder of God's creation.";
}

function animateAmount(target) {
  const start = animatedAmount;
  const delta = target - start;
  const began = performance.now();
  const duration = 1200;

  function frame(now) {
    const t = Math.min(1, (now - began) / duration);
    const eased = 1 - Math.pow(1 - t, 4);
    animatedAmount = start + delta * eased;
    els.amountRaised.textContent = money.format(animatedAmount);

    if (t < 1) requestAnimationFrame(frame);
    else {
      animatedAmount = target;
      els.amountRaised.textContent = money.format(target);
    }
  }

  requestAnimationFrame(frame);
}

function launchConfetti() {
  const canvas = els.canvas;
  const ctx = canvas.getContext("2d");
  const dpr = Math.max(1, window.devicePixelRatio || 1);

  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const pieces = Array.from({ length: 180 }, () => ({
    x: Math.random() * innerWidth,
    y: -30 - Math.random() * innerHeight * 0.5,
    w: 5 + Math.random() * 8,
    h: 8 + Math.random() * 12,
    vx: -2 + Math.random() * 4,
    vy: 3 + Math.random() * 5,
    rotation: Math.random() * Math.PI,
    rotationVelocity: -0.12 + Math.random() * 0.24,
    hue: Math.random() * 360
  }));

  const began = performance.now();

  function draw(now) {
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for (const piece of pieces) {
      piece.x += piece.vx;
      piece.y += piece.vy;
      piece.rotation += piece.rotationVelocity;

      ctx.save();
      ctx.translate(piece.x, piece.y);
      ctx.rotate(piece.rotation);
      ctx.fillStyle = `hsl(${piece.hue} 90% 60%)`;
      ctx.fillRect(-piece.w / 2, -piece.h / 2, piece.w, piece.h);
      ctx.restore();
    }

    if (now - began < 8000) requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, innerWidth, innerHeight);
  }

  requestAnimationFrame(draw);
}
