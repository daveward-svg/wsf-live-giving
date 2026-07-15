import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

import {
  getDatabase,
  ref,
  onValue,
  set
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

import {
  firebaseConfig,
  campaignPath
} from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const campaignRef = ref(database, campaignPath);

const loginPanel = document.getElementById("loginPanel");
const dashboardPanel = document.getElementById("dashboardPanel");

const loginForm = document.getElementById("loginForm");
const campaignForm = document.getElementById("campaignForm");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const raisedInput = document.getElementById("raised");
const goalInput = document.getElementById("goal");
const campaignNameInput = document.getElementById("name");
const subtitleInput = document.getElementById("subtitle");
const givingUrlInput = document.getElementById("givingUrl");

const loginMessage = document.getElementById("loginMessage");
const saveMessage = document.getElementById("saveMessage");
const liveTotal = document.getElementById("liveTotal");
const logoutButton = document.getElementById("logoutButton");

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  loginMessage.textContent = "Signing in…";

  try {
    await signInWithEmailAndPassword(
      auth,
      emailInput.value.trim(),
      passwordInput.value
    );

    loginMessage.textContent = "";
  } catch (error) {
    console.error(error);

    if (error.code === "auth/invalid-credential") {
      loginMessage.textContent = "The email or password is incorrect.";
    } else {
      loginMessage.textContent = `Could not sign in: ${error.message}`;
    }
  }
});

logoutButton.addEventListener("click", async () => {
  await signOut(auth);
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    loginPanel.classList.add("hidden");
    dashboardPanel.classList.remove("hidden");
  } else {
    loginPanel.classList.remove("hidden");
    dashboardPanel.classList.add("hidden");
  }
});

campaignForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  saveMessage.textContent = "Saving…";

  try {
    await set(campaignRef, {
      raised: Number(raisedInput.value),
      goal: Number(goalInput.value),
      name: campaignNameInput.value.trim(),
      subtitle: subtitleInput.value.trim(),
      givingUrl: givingUrlInput.value.trim(),
      updatedAt: Date.now(),
      updatedBy: auth.currentUser?.email || "unknown"
    });

    saveMessage.textContent =
      "Saved. Every open display has updated.";
  } catch (error) {
    console.error(error);
    saveMessage.textContent = `Could not save: ${error.message}`;
  }
});

document.querySelectorAll("[data-add]").forEach((button) => {
  button.addEventListener("click", () => {
    const currentAmount = Number(raisedInput.value) || 0;
    const amountToAdd = Number(button.dataset.add) || 0;

    raisedInput.value = currentAmount + amountToAdd;
  });
});

onValue(
  campaignRef,
  (snapshot) => {
    const campaign = snapshot.val() || {
      raised: 0,
      goal: 10000,
      name: "Rainforest Falls",
      subtitle:
        "The Nature of God • Vacation Bible School 2026",
      givingUrl: "https://wsfirst.com/"
    };

    raisedInput.value = Number(campaign.raised) || 0;
    goalInput.value = Number(campaign.goal) || 10000;
    campaignNameInput.value =
      campaign.name || "Rainforest Falls";
    subtitleInput.value =
      campaign.subtitle ||
      "The Nature of God • Vacation Bible School 2026";
    givingUrlInput.value =
      campaign.givingUrl || "https://wsfirst.com/";

    liveTotal.textContent = money.format(
      Number(campaign.raised) || 0
    );
  },
  (error) => {
    console.error(error);
    saveMessage.textContent =
      `Database connection error: ${error.message}`;
  }
);
