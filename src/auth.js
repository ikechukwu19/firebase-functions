import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { app } from ".";
const registerForm = document.querySelector(".register");
const loginForm = document.querySelector(".login");
const signOutBtn = document.querySelector(".sign-out");
const authModals = document.querySelectorAll(".auth .modal");
const authWrapper = document.querySelector(".auth");
const auth = getAuth(app);

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = registerForm.email.value;
  const password = registerForm.password.value;
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    registerForm.reset();
  } catch (err) {
    registerForm.querySelector(".error").textContent = err.message;
  }
});

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = loginForm.email.value;
  const password = loginForm.password.value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    loginForm.reset();
  } catch (err) {
    loginForm.querySelector(".error").textContent = err.message;
  }
});

//auth listener
onAuthStateChanged(auth, (user) => {
  if (user) {
    authWrapper.classList.remove("open");
    authModals.forEach((modal) => modal.classList.remove("active"));
  } else {
    authWrapper.classList.add("open");
    authModals[0].classList.add("active");
  }
});

signOutBtn.addEventListener("click", async () => {
  await signOut(auth);
});
