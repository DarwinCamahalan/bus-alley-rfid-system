import styles from './addedCards.module.scss'
import { db } from '../firebaseConfig'
import { ref, onValue } from 'firebase/database'
import { useState, useEffect } from 'react'
const AddedCards = () => {
  const [cardsData, setCardsData] = useState([])

  useEffect(() => {
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
  return (
    <div className={styles.tableBg}>
      <table>
        <tbody>
          <tr className={styles.tableHead}>
            <th>No.</th>
            <th>Card ID</th>
            <th>Company Name</th>
            <th>Plate Number</th>
            <th>Date Added</th>
            <th>Time Added</th>
          </tr>
          {cardsData.map((cardData, key) => (
            <tr className={styles.data} key={key}>
              <>
                <td>{key + 1}</td>
                <td>{cardData.cardID}</td>
                <td>{cardData.busCompany}</td>
                <td>{cardData.plateNumber}</td>
                <td>{cardData.date}</td>
                <td>{cardData.time}</td>
              </>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AddedCards
