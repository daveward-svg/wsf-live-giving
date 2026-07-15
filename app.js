(() => {
  const config = window.DASHBOARD_CONFIG || {};
  const goal = Number(config.goal) || 10000;

  const els = {
    amountRaised: document.getElementById("amountRaised"),
    goalAmount: document.getElementById("goalAmount"),
    percentComplete: document.getElementById("percentComplete"),
    amountRemaining: document.getElementById("amountRemaining"),
    progressFill: document.getElementById("progressFill"),
    progressTrack: document.getElementById("progressTrack"),
    lagoonFill: document.getElementById("lagoonFill"),
    impactMessage: document.getElementById("impactMessage"),
    statusText: document.getElementById("statusText"),
    lastUpdated: document.getElementById("lastUpdated"),
    rainbow: document.getElementById("rainbow"),
    giveButton: document.getElementById("giveButton"),
    birds: [...document.querySelectorAll(".bird")],
    butterflies: [...document.querySelectorAll(".butterfly")],
    canvas: document.getElementById("confettiCanvas")
  };

  let displayedAmount = 0;
  let latestAmount = 0;
  let celebrated100 = false;

  const money = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  });

  function parseCsv(csvText) {
    const rows = csvText.trim().split(/\r?\n/).map(row => row.split(","));
    if (rows.length < 2) throw new Error("The sheet needs a header row and a data row.");

    const headers = rows[0].map(v => v.trim().toLowerCase().replace(/["']/g, ""));
    const values = rows[1].map(v => v.trim().replace(/["'$,\s]/g, ""));

    const raisedIndex = headers.findIndex(h => ["raised", "total", "amount", "current"].includes(h));
    const goalIndex = headers.findIndex(h => h === "goal");

    if (raisedIndex === -1) throw new Error('Could not find a column named "Raised".');

    return {
      raised: Number(values[raisedIndex]),
      goal: goalIndex >= 0 ? Number(values[goalIndex]) : goal
    };
  }

  function selectImpact(percent) {
    const messages = Array.isArray(config.impactMessages) ? config.impactMessages : [];
    return messages
      .filter(item => percent >= Number(item.at))
      .sort((a, b) => Number(b.at) - Number(a.at))[0]?.text
      || "Every gift makes a difference.";
  }

  function animateNumber(target) {
    const start = displayedAmount;
    const delta = target - start;
    const startTime = performance.now();
    const duration = 1400;

    function frame(now) {
      const t = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - t, 4);
      displayedAmount = start + delta * eased;
      els.amountRaised.textContent = money.format(displayedAmount);

      if (t < 1) requestAnimationFrame(frame);
      else {
        displayedAmount = target;
        els.amountRaised.textContent = money.format(target);
      }
    }
    requestAnimationFrame(frame);
  }

  function render(amount, activeGoal = goal) {
    amount = Math.max(0, Number(amount) || 0);
    activeGoal = Math.max(1, Number(activeGoal) || goal);

    latestAmount = amount;
    const rawPercent = (amount / activeGoal) * 100;
    const percent = Math.max(0, Math.min(100, rawPercent));
    const remaining = Math.max(0, activeGoal - amount);

    els.goalAmount.textContent = money.format(activeGoal);
    els.percentComplete.textContent = `${percent.toFixed(percent < 10 ? 1 : 0)}%`;
    els.amountRemaining.textContent = money.format(remaining);
    els.progressFill.style.width = `${percent}%`;
    els.progressTrack.setAttribute("aria-valuenow", String(Math.round(percent)));

    // Keep a small visible lagoon even near zero, then fill to 100%.
    const lagoonPercent = 9 + (percent * 0.91);
    els.lagoonFill.style.height = `${lagoonPercent}%`;

    els.impactMessage.textContent = selectImpact(percent);
    els.rainbow.classList.toggle("visible", percent >= 75);
    els.birds.forEach(el => el.classList.toggle("visible", percent >= 25));
    els.butterflies.forEach(el => el.classList.toggle("visible", percent >= 50));

    animateNumber(amount);

    if (percent >= 100 && !celebrated100) {
      celebrated100 = true;
      launchConfetti();
    } else if (percent < 100) {
      celebrated100 = false;
    }
  }

  async function loadLiveTotal() {
    const url = String(config.sheetCsvUrl || "").trim();

    if (!url) {
      render(config.demoRaised || 0, goal);
      els.statusText.textContent = "Demo mode";
      els.lastUpdated.textContent = "Add your published Google Sheet URL in config.js";
      return;
    }

    try {
      els.statusText.textContent = "Updating live total…";
      const separator = url.includes("?") ? "&" : "?";
      const response = await fetch(`${url}${separator}_=${Date.now()}`, { cache: "no-store" });
      if (!response.ok) throw new Error(`Sheet returned ${response.status}`);

      const data = parseCsv(await response.text());
      if (!Number.isFinite(data.raised)) throw new Error("Raised amount is not a number.");

      render(data.raised, Number.isFinite(data.goal) ? data.goal : goal);
      els.statusText.textContent = "Live from Google Sheets";
      els.lastUpdated.textContent = `Updated ${new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit", second: "2-digit" })}`;
    } catch (error) {
      console.error(error);
      els.statusText.textContent = "Could not update the Google Sheet";
      els.lastUpdated.textContent = `${error.message}. Showing the most recent amount.`;
      if (!latestAmount) render(config.demoRaised || 0, goal);
    }
  }

  function launchConfetti() {
    const canvas = els.canvas;
    const ctx = canvas.getContext("2d");
    const dpr = Math.max(1, window.devicePixelRatio || 1);

    function sizeCanvas() {
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    sizeCanvas();

    const pieces = Array.from({ length: 180 }, () => ({
      x: Math.random() * innerWidth,
      y: -20 - Math.random() * innerHeight * 0.6,
      w: 5 + Math.random() * 8,
      h: 8 + Math.random() * 12,
      vy: 2.5 + Math.random() * 5,
      vx: -1.8 + Math.random() * 3.6,
      rot: Math.random() * Math.PI,
      vr: -0.12 + Math.random() * 0.24,
      hue: Math.random() * 360
    }));

    const started = performance.now();

    function tick(now) {
      ctx.clearRect(0, 0, innerWidth, innerHeight);

      for (const p of pieces) {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = `hsl(${p.hue} 90% 60%)`;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }

      if (now - started < 8000) requestAnimationFrame(tick);
      else ctx.clearRect(0, 0, innerWidth, innerHeight);
    }

    requestAnimationFrame(tick);
    addEventListener("resize", sizeCanvas, { once: true });
  }

  els.giveButton.href = config.givingUrl || "#";
  loadLiveTotal();
  setInterval(loadLiveTotal, Math.max(5000, Number(config.refreshIntervalMs) || 15000));
})();
