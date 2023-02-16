import styles from './departedbus.module.scss'
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
  let j = busDeparted.length + 1
  const [sortField, setSortField] = useState('id')
  const [sortDirection, setSortDirection] = useState(1)
  const [numberClicked, setNumberClicked] = useState(false)

  const sortedData = busDeparted.slice().sort((a, b) => {
    if (a[sortField] < b[sortField]) {
      return -1 * sortDirection
    }
    if (a[sortField] > b[sortField]) {
      return 1 * sortDirection
    }
    return 0
  })

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection * -1)
    } else {
      setSortField(field)
      setSortDirection(1)
    }
  }

  return (
    <div className={styles.recordsBg}>
      <ul>
        <li
          onClick={() => {
            setNumberClicked(!numberClicked)
            handleSort('id')
          }}
        >
          No.
        </li>
        <li
          onClick={() => {
            setNumberClicked(!numberClicked)
            handleSort('cardID')
          }}
        >
          Card ID
        </li>
        <li
          onClick={() => {
            setNumberClicked(!numberClicked)
            handleSort('busCompany')
          }}
        >
          Company Name
        </li>
        <li
          onClick={() => {
            setNumberClicked(!numberClicked)
            handleSort('plateNumber')
          }}
        >
          Plate Number
        </li>
        <li
          onClick={() => {
            setNumberClicked(!numberClicked)
            handleSort('fee')
          }}
        >
          Fee
        </li>
        <li
          onClick={() => {
            setNumberClicked(!numberClicked)
            handleSort('date')
          }}
        >
          Depature Date
        </li>
        <li
          onClick={() => {
            setNumberClicked(!numberClicked)
            handleSort('time')
          }}
        >
          Depature Time
        </li>
      </ul>

      <table>
        <tbody>
          {sortedData.map((busDeparted) => (
            <>
              <tr className={styles.data}>
                <>
                  <td>{numberClicked ? (j = j - 1) : (i = i + 1)}</td>
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
