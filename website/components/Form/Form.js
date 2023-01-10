import styles from './form.module.scss'
import ErrorMessage from '../ErrorMessage/ErrorMessage'
import { uid } from 'uid'
import { db } from '../firebaseConfig'
import { set, ref, onValue } from 'firebase/database'
import { useState, useEffect } from 'react'

const Form = ({ title, closeModal, success }) => {
  let exist = false
  const [scanned, setScanned] = useState(false)
  const [cardsData, setCardsData] = useState([])
  const [error, setError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [cardID, setCardID] = useState('NO CARD DETECTED')
  const [plateNumber, setPlatenumber] = useState('')
  const [busCompany, setBusCompany] = useState('-')
  const date = new Date().toLocaleDateString() + ''
  const time = new Date().toLocaleTimeString() + ''

  const handleCardIDChange = (e) => {
    setCardID(e.target.value)
  }

  const handlePlateNumberChange = (e) => {
    setPlatenumber(e.target.value)
  }

  const handleBusCompanyChange = (e) => {
    setBusCompany(e.target.value)
  }

  useEffect(() => {
    onValue(ref(db, `card/id`), (snapshot) => {
      const ID = snapshot.val()
      if (ID !== null) {
        setCardID(ID)
        if (ID !== 'NO CARD DETECTED') {
          setScanned(true)
        }
      }
    })

    onValue(ref(db, '/addedCards'), (snapshot) => {
      setCardsData([])
      const data = snapshot.val()
      if (data !== null) {
        Object.values(data).map((cardData) => {
          setCardsData((oldArray) => [...oldArray, cardData])
        })
      }
    })
  }, [])
  const sendData = () => {
    // CARD VALIDATION
    // Object.values(cardsData).map((cardData) => {
    //   if (cardID === cardData.cardID) {
    //     exist = true
    //   }
    // })

    if (plateNumber === '' || busCompany === '-') {
      setError(!error)
      setErrorMsg('Enter Bus Company or Plate Number.')
    } else if (cardID === 'NO CARD DETECTED') {
      setError(!error)
      setErrorMsg('Scan RFID Card.')
    } else if (exist === true) {
      setError(!error)
      setErrorMsg('Card ID Already exist.')
    } else {
      const uuid = uid()
      const id = cardsData.length
      set(ref(db, `/addedCards/${uuid}`), {
        id,
        uuid,
        cardID,
        plateNumber,
        busCompany,
        time,
        date,
      })
      setBusCompany('-')
      setCardID('NO CARD DETECTED')
      setPlatenumber('')
      closeModal()
      success()
    }
  }

  const getStyle = () => {
    if (scanned) return styles.scanned
    else return styles.cardID
  }

  return (
    <>
      <form className={styles.formBox}>
        <h1>{title}</h1>
        {error ? (
          <div className={styles.errorBox}>
            <ErrorMessage>{errorMsg}</ErrorMessage>
          </div>
        ) : (
          <div></div>
        )}
        <label htmlFor="cardID">Card ID</label>
        <input
          disabled
          type="text"
          value={cardID}
          onChange={handleCardIDChange}
          className={getStyle()}
        />

        <label htmlFor="company">Bus Company Name</label>
        <select
          name="company"
          id="company"
          value={busCompany}
          onChange={handleBusCompanyChange}
        >
          <option value="-">-</option>
          <option value="Rural">Rural</option>
          <option value="Superfive">Superfive</option>
        </select>

        <label htmlFor="plateNumber">Plate Number</label>
        <input
          type="text"
          value={plateNumber}
          onChange={handlePlateNumberChange}
        />

        <div className={styles.btnContainer}>
          <div className={styles.btn} onClick={sendData}>
            Add
          </div>
        </div>
      </form>
    </>
  )
}

export default Form
