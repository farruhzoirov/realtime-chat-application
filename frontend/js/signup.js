'use strict'
const port = 5000;

const signupForm = document.getElementById("auth-signup");
const avatarImgElement = signupForm.querySelector('.avatar > img');

const avatarImgInput = signupForm.querySelector('#avatar');
const nameInput = signupForm.querySelector('#first-name');
const email = signupForm.querySelector('#signup-email');
const password = signupForm.querySelector('#signup-password');
const confirmPassword = signupForm.querySelector('#signup-confirm-password');

const actionDisplay = signupForm.querySelector('#action-display-signup');

// Functions

function clearText(text) {
  return text.trim()
}

avatarImgInput.addEventListener('change', e => {
  if (e.target.files && e.target.files[0]) {
    let reader = new FileReader();
    reader.onload = function (e) {
      avatarImgElement.src = e.target.result
    }
    reader.readAsDataURL(e.target.files[0])
  }
})


signupForm.addEventListener('submit', async e => {
  e.preventDefault()
  const formData = new FormData()

  formData.append('avatar', avatarImgInput.files[0])
  formData.append('name', clearText(nameInput.value))
  formData.append('email', clearText(email.value))
  formData.append('password', password.value)
  formData.append('confirmPassword',confirmPassword.value)

  let response = await fetch(`/signup`, {
    method: 'POST',
    body: formData
  })
  response = await response.json()

  if (response.ok) {
   window.location.href = '/login';
   return actionDisplay.innerHTML = `
            <div class="success-text">You signed up successfully</div>
         `
  }
  if (actionDisplay) {
    actionDisplay.innerHTML = `
            <div class="alert">${response.errorMessage}</div>
         `
  }
})