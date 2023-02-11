import styles from './recordedlogs.module.scss'
import { db } from '../firebaseConfig'
import { ref, onValue } from 'firebase/database'
import { useState, useEffect } from 'react'
const RecordedLogs = () => {
  const [busDeparted, setBusDeparted] = useState([])
  useEffect(() => {
    onValue(ref(db, '/departed'), (snapshot) => {
      setBusDeparted([])
      const data = snapshot.val()
      if (data !== null) {
        Object.values(data).map((busDeparted) => {
          setBusDeparted((oldArray) => [...oldArray, busDeparted])
        })
      }
    })
  }, [])
  let i = 0
  return (
    <div className={styles.recordsBg}>
      <table>
        <tbody>
          <tr>
            <th>No.</th>
            <th>Card ID</th>
            <th>Company Name</th>
            <th>Plate Number</th>
            <th>Fee</th>
            <th>Depature Date</th>
            <th>Depature Time</th>
          </tr>

          {busDeparted.map((busDeparted) => (
            <>
              <tr className={styles.data}>
                <>
                  <td> {(i = i + 1)}</td>
                  <td>{busDeparted.cardID}</td>
                  <td>{busDeparted.busCompany}</td>
                  <td>{busDeparted.plateNumber}</td>
                  <td>{`₱ ${busDeparted.fee}`}</td>
                  <td>{busDeparted.date}</td>
                  <td>{busDeparted.time}</td>
                </>
              </tr>
            </>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default RecordedLogs
