const toggleSideBar = document.querySelector('.sidebar')
const menuIcon = document.querySelector('.menu')
const modal = document.querySelector('.modal-container')

const timeDisplay = document.getElementById('time')

const cardID = document.querySelector('#card-id')
const companyName = document.querySelector('#company')

const plateNumber = document.querySelector('#plate-number')

const errorMsg = document.querySelector('.msg')

const addCard = () => {
  if (cardID.value === '') {
    // CHANGE ME
    errorMsg.innerHTML = 'Place RFID Card to Scanner'
    errorMsg.className = 'errorMsg'
  } else if (companyName.value === '-' || plateNumber.value === '') {
    errorMsg.innerHTML = 'Enter Company Name or Plate Number.'
    errorMsg.className = 'errorMsg'
  } else {
    errorMsg.innerHTML = ''
    errorMsg.className = 'msg'
    companyName.value = '-'
    plateNumber.value = ''
    hideModal()
  }
}

const refreshTime = () => {
  const dateString = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Kuala_Lumpur',
  })
  const formattedString = dateString.replace(', ', ' - ')
  timeDisplay.innerHTML = formattedString
}

setInterval(refreshTime, 1000)

const toggle = () => {
  if (toggleSideBar.style.display === 'none') {
    toggleSideBar.style.display = 'block'
  } else {
    toggleSideBar.style.display = 'none'
  }
}

const displayModal = () => {
  if (modal.style.display === 'none') {
    modal.style.display = 'block'
  } else {
    modal.style.display = 'none'
  }
}

const hideModal = () => {
  modal.style.display = 'none'
}

const logout = () => {
  window.location.href = '../login-page/login.html'
}
