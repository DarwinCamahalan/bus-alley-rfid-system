const toggleSideBar = document.querySelector('.sidebar')
const menuIcon = document.querySelector('.menu')
const modal = document.querySelector('.modal-container')

const timeDisplay = document.getElementById('time')
const errorMsg = document.querySelector('.msg')
const success = document.querySelector('.successMsg')

const cardID = document.querySelector('#card-id')
const companyName = document.querySelector('#company')
const plateNumber = document.querySelector('#plate-number')

const addCard = () => {
  if (cardID.value === 'SCAN CARD') {
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
    success.style.display = 'block'
    hideModal()
    setTimeout(() => {
      success.style.display = 'none'
    }, 3000)
  }
  setTimeout(() => {
    errorMsg.innerHTML = ''
    errorMsg.className = 'msg'
  }, 3000)
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
    cardID.value = 'SCAN CARD'
    cardID.style = 'animation-name: notify;'
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
