import styles from './form.module.scss'
import { uid } from 'uid'
import { db } from '../firebaseConfig'
import { set, ref, onValue } from 'firebase/database'
import { useState, useEffect } from 'react'

const Form = ({ title }) => {
  const [cardID, setCardID] = useState('')
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
      }
    })
  }, [])

  const sendData = () => {
    const uuid = uid()
    set(ref(db, `/addedCards/${uuid}`), {
      cardID,
      plateNumber,
      busCompany,
      time,
      date,
    })
    setBusCompany('-')
    setCardID('SCAN CARD')
    setPlatenumber('')
  }
  return (
    <form className={styles.formBox}>
      <h1>{title}</h1>
      <label htmlFor="cardID">Card ID</label>
      <input
        disabled
        type="text"
        value={cardID}
        onChange={handleCardIDChange}
      />

      <label htmlFor="company">Bus Company Name</label>
      <select
        name="company"
        id="company"
        value={busCompany}
        onChange={handleBusCompanyChange}
      >
        <option value="-">-</option>
        <option value="Rural-RTMI">Rural - RTMI</option>
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
  )
}

export default Form
