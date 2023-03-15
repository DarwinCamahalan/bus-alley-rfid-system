import styles from './departedbus.module.scss'
import { IoSearchOutline } from 'react-icons/io5'
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
  const [selectedDate, setSelectedDate] = useState('')
  const [sortedDate, setSortedDate] = useState('')
  const [searchText, setSearchText] = useState('')

  const sortedData = busDeparted
    .filter((item) => {
      if (searchText === '') return true
      return (
        item.cardID.toLowerCase().includes(searchText.toLowerCase()) ||
        item.busCompany.toLowerCase().includes(searchText.toLowerCase()) ||
        item.plateNumber.toLowerCase().includes(searchText.toLowerCase()) ||
        item.date.toLowerCase().includes(searchText.toLowerCase()) ||
        item.time.toLowerCase().includes(searchText.toLowerCase())
      )
    })

    .filter((item) => {
      if (sortedDate === '') {
        return true
      }
      return item.date === sortedDate
    })

    // .slice()

    .sort((a, b) => {
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

  const handleDateChange = (event) => {
    const date = new Date(event.target.value)
    const year = date.getFullYear().toString()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const formattedDate = `${month}/${day}/${year}`
    setSortedDate(formattedDate)

    const displayDate = `${year}-${month}-${day}`
    setSelectedDate(displayDate)
  }

  const handleTextChange = (e) => {
    setSearchText(e.target.value)
  }

  return (
    <div className={styles.recordsBg}>
      <div className={styles.tableMenu}>
        <p>Departed Buses</p>
        <div className={styles.menuContainer}>
          <input type="date" value={selectedDate} onChange={handleDateChange} />

          <div className={styles.search}>
            <input
              type="text"
              id="text-input"
              value={searchText}
              onChange={handleTextChange}
            />
            <IoSearchOutline className={styles.searchIcon} />
          </div>
        </div>
      </div>
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
            handleSort('cardID')
          }}
        >
          Card ID
        </li>

        <li
          onClick={() => {
            setNumberClicked(!numberClicked)
            handleSort('fee')
          }}
        >
          Fee
        </li>
      </ul>

      <table>
        <tbody>
          {sortedData.map((busDeparted) => (
            <>
              <tr
                className={`${styles.data} ${
                  i % 2 === 0 && j % 2 === 0 ? null : styles.grey
                }`}
              >
                <>
                  <td>{numberClicked ? (j = j - 1) : (i = i + 1)}</td>
                  <td>{busDeparted.date}</td>
                  <td>{busDeparted.time}</td>
                  <td>{busDeparted.busCompany}</td>
                  <td>{busDeparted.plateNumber}</td>
                  <td>{busDeparted.cardID}</td>

                  <td>{`₱ ${busDeparted.fee}`}</td>
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
