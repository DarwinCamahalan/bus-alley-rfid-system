import styles from './DepartedBus.module.scss'
import { FiSearch } from 'react-icons/fi'
import { db } from '../firebaseConfig'
import { ref, onValue } from 'firebase/database'
import { useState, useEffect } from 'react'
const DepartedBus = () => {
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
      <div className={styles.tableMenu}>
        <p>Departed Bus</p>

        <div className={styles.sortCompany}>
          <label for="company">Sort by: </label>
          <select name="company" id="company" value="-">
            <option value="-">-</option>
            <option value="Rural Transit">Rural Transit</option>
            <option value="Super five">Super five</option>
          </select>
        </div>

        <div className={styles.datePicker}>
          <label for="date">Date: </label>
          <input type="date" id="date" name="date"></input>
          <span> to </span>
          <input type="date" id="to" name="to"></input>
        </div>

        <div className={styles.search}>
          <input type="text" id="search" name="search"></input>
          <FiSearch />
        </div>
      </div>
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

export default DepartedBus
