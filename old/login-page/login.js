const passForm = document.querySelector('#password')
const usernameForm = document.querySelector('#username')
const showPass = document.querySelector('.reveal-pass')
const loginButton = document.querySelector('.btn')
const errorMsg = document.querySelector('.msg')

const revealPass = () => {
  if (passForm.type === 'password') {
    passForm.type = 'text'
    showPass.innerHTML = 'Hide'
  } else {
    passForm.type = 'password'
    showPass.innerHTML = 'Show'
  }
}

const login = () => {
  if (usernameForm.value === '' || passForm.value === '') {
    errorMsg.innerHTML = 'Please enter username and password'
    errorMsg.className = 'errorMsg'
  } else if (usernameForm.value !== 'admin' || passForm.value !== '123') {
    errorMsg.innerHTML = 'Incorrect username or password.'
    errorMsg.className = 'errorMsg'
  }

  setTimeout(() => {
    errorMsg.innerHTML = ''
    errorMsg.className = 'msg'
  }, 3000)

  if (usernameForm.value == 'admin' || passForm.value == '123') {
    usernameForm.value = ''
    passForm.value = ''
    window.location.href = '../main-page/main-page.html'
  }
}
