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
import { firebaseConfig, campaignPath } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const campaignRef = ref(db, campaignPath);

const loginPanel = document.getElementById("loginPanel");
const dashboardPanel = document.getElementById("dashboardPanel");
const loginForm = document.getElementById("loginForm");
const campaignForm = document.getElementById("campaignForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginMessage = document.getElementById("loginMessage");
const saveMessage = document.getElementById("saveMessage");
const logoutButton = document.getElementById("logoutButton");
const liveTotal = document.getElementById("liveTotal");

const raisedInput = document.getElementById("raised");
const goalInput = document.getElementById("goal");
const campaignNameInput = document.getElementById("campaignNameInput");
const subtitleInput = document.getElementById("subtitleInput");
const givingUrlInput = document.getElementById("givingUrlInput");

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
    passwordInput.value = "";
  } catch (error) {
    console.error(error);
    loginMessage.textContent = friendlyAuthError(error.code, error.message);
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
    dashboardPanel.classList.add("hidden");
    loginPanel.classList.remove("hidden");
  }
});

campaignForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  saveMessage.textContent = "Saving…";

  try {
    if (!auth.currentUser) {
      throw new Error("You must be signed in before saving.");
    }

    await set(campaignRef, {
      raised: Number(raisedInput.value),
      goal: Number(goalInput.value),
      name: campaignNameInput.value.trim(),
      subtitle: subtitleInput.value.trim(),
      givingUrl: givingUrlInput.value.trim(),
      updatedAt: Date.now(),
      updatedBy: auth.currentUser.email || "unknown"
    });

    saveMessage.textContent = "Saved. Every open display has updated.";
  } catch (error) {
    console.error(error);
    saveMessage.textContent = `Could not save: ${error.message}`;
  }
});

document.querySelectorAll("[data-add]").forEach((button) => {
  button.addEventListener("click", () => {
    const current = Number(raisedInput.value) || 0;
    raisedInput.value = current + Number(button.dataset.add || 0);
  });
});

onValue(
  campaignRef,
  (snapshot) => {
    const campaign = snapshot.val() || {
      raised: 0,
      goal: 10000,
      name: "Rainforest Falls",
      subtitle: "The Nature of God • Vacation Bible School 2026",
      givingUrl: "https://wsfirst.com/"
    };

    raisedInput.value = Number(campaign.raised) || 0;
    goalInput.value = Number(campaign.goal) || 10000;
    campaignNameInput.value = campaign.name || "Rainforest Falls";
    subtitleInput.value =
      campaign.subtitle || "The Nature of God • Vacation Bible School 2026";
    givingUrlInput.value = campaign.givingUrl || "https://wsfirst.com/";
    liveTotal.textContent = money.format(Number(campaign.raised) || 0);
  },
  (error) => {
    console.error(error);
    saveMessage.textContent = `Database connection error: ${error.message}`;
  }
);

function friendlyAuthError(code, message) {
  if (code === "auth/invalid-credential") return "The email or password is incorrect.";
  if (code === "auth/too-many-requests") return "Too many attempts. Wait a moment and try again.";
  if (code === "auth/user-disabled") return "This admin account has been disabled.";
  if (code === "auth/operation-not-allowed") return "Email/password sign-in is not enabled in Firebase.";
  if (code === "auth/unauthorized-domain") return "This Netlify domain is not authorized in Firebase.";
  return `Could not sign in: ${message}`;
}
