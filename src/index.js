// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFunctions, httpsCallable } from 'firebase/functions'


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB7vzVQHcSvpnZ5fHRUjGnXaTSpk7f1-gc",
  authDomain: "fir-functions-19822.firebaseapp.com",
  projectId: "fir-functions-19822",
  storageBucket: "fir-functions-19822.appspot.com",
  messagingSenderId: "446866241484",
  appId: "1:446866241484:web:826b61e0bf74c3820bcf69",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const functions = getFunctions(app)
//request elements
const requestModal = document.querySelector(".new-request");
const requestLink = document.querySelector(".add-request");
const requestForm = document.querySelector(".new-request form");

// open request modal
requestLink.addEventListener("click", () => {
  requestModal.classList.add("open");
});

// close request modal
requestModal.addEventListener("click", (e) => {
  if (e.target.classList.contains("new-request")) {
    requestModal.classList.remove("open");
  }
});



//auth modals
const authSwitchLinks = document.querySelectorAll('.switch')
const authModals = document.querySelectorAll('.auth .modal')
const authWrapper = document.querySelector('.auth')

//toggle auth modals
authSwitchLinks.forEach((link) => {
    link.addEventListener('click', () => {
        authModals.forEach( modal => modal.classList.toggle('active'))
    })
})

// add request
requestForm.addEventListener('submit',async (e) => {
    e.preventDefault()
    const request = requestForm.request.value
    try {
        const addRequest = httpsCallable(functions, 'addRequest');
        await addRequest({
            text: request
        })
        requestForm.reset()
        requestModal.classList.remove('open')
        requestForm.querySelector('.error').textContent = ''
    } catch (err) {
        requestForm.querySelector('.error').textContent = err.message
    }
})


const notification = document.querySelector('.notification')
const showNotification = (message) => {
  notification.textContent = message
  notification.classList.add('active')
  setTimeout(() => {
    notification.classList.remove('active')
    notification.textContent = ""
  }, 3500)
}

export { app, showNotification }