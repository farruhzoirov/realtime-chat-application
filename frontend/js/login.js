const socket = io()


const loginForm = document.getElementById("auth-login");
const email = loginForm.querySelector('#login-email');
const password = loginForm.querySelector('#login-password');
const actionDisplay = loginForm.querySelector('#action-display-login');

// clearText Function
function clearText(text) {
  return text.trim()
}

loginForm.addEventListener('submit', async e => {
  try {
    e.preventDefault();
    const formData = new FormData()
    formData.append('email', clearText(email.value))
    formData.append('password', password.value)

    let response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      body: formData
    })
    response = await response.json();

    if (response.ok) {
      localStorage.setItem('currentUserId', response.user._id)
      actionDisplay.innerHTML = `
            <div class="success-text">${response.message}</div>
         `
      window.location.href = '/';
    }
    if (!response.ok) {
      actionDisplay.innerHTML = `
            <div class="alert">${response.message}</div>
         `
    }
    if (response.errorMessage) {
      actionDisplay.innerHTML = `
            <div class="alert">${response.errorMessage}</div>
         `
    }
  } catch (e) {
    console.log(e)
  }
});





