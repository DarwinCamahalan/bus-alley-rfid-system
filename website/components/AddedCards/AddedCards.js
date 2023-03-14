import styles from './addedCards.module.scss'
import ErrorMessage from '../ErrorMessage/ErrorMessage'
import SuccessMessage from '../SuccessMessage/SuccessMessage'
import { db } from '../firebaseConfig'
import { ref, onValue, remove, update } from 'firebase/database'
import { useState, useEffect } from 'react'
import { IoCloseSharp, IoSearchOutline } from 'react-icons/io5'

const AddedCards = () => {
  const [errorMsg, setErrorMsg] = useState('')
  const [error, setError] = useState(false)
  const [deleted, setDeleted] = useState(false)
  const [updated, setUpdated] = useState(false)
  const [toDelete, setToDelete] = useState([])
  const [modalEdit, setModalEdit] = useState(false)
  const [cardID, setCardID] = useState('')
  const [plateNumber, setPlatenumber] = useState('')
  const [busCompany, setBusCompany] = useState('-')
  const [cardsData, setCardsData] = useState([])
  const [prompt, setPrompt] = useState(false)

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

  const handlePlateNumberChange = (e) => {
    setPlatenumber(e.target.value)
  }

  const handleBusCompanyChange = (e) => {
    setBusCompany(e.target.value)
  }

  const handleEdit = (cardData) => {
    setModalEdit(!modalEdit)
    setCardID(cardData.cardID)
    setPlatenumber(cardData.plateNumber)
    setBusCompany(cardData.busCompany)
  }

  let plateNumberExist = false

  const sendUpdate = () => {
    Object.values(cardsData).map((cardDatas) => {
      if (plateNumber === cardDatas.plateNumber) {
        plateNumberExist = true
      }
    })
    if (busCompany === '-' || plateNumber === '') {
      setError(!error)
      setErrorMsg('Enter Bus Company or Plate Number.')
    } else if (plateNumberExist === true) {
      setError(!error)
      setErrorMsg('Plate Number Already exist.')
    } else {
      update(ref(db, `/addedCards/${cardID}`), {
        plateNumber,
        busCompany,
      })
      setCardID('')
      setPlatenumber('')
      setBusCompany('-')
      setModalEdit(!modalEdit)
      setUpdated(true)
    }
    setTimeout(() => {
      setError(false)
      setUpdated(false)
    }, 2000)
  }

  const handleDelete = (cardID) => {
    setPrompt(!prompt)
    setToDelete(cardID)
  }

  const deleteCard = (toDelete) => {
    remove(ref(db, `/addedCards/${toDelete}`))
    setDeleted(true)
    setTimeout(() => {
      setDeleted(false)
    }, 2000)
  }

  const [sortField, setSortField] = useState('id')
  const [sortDirection, setSortDirection] = useState(1)
  const [selectedDate, setSelectedDate] = useState('')
  const [sortedDate, setSortedDate] = useState('')
  const [searchText, setSearchText] = useState('')

  const sortedData = cardsData
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

    .sort((a, b) => {
      if (a[sortField] < b[sortField]) {
        return -1 * sortDirection
      }
      if (a[sortField] > b[sortField]) {
        return 1 * sortDirection
      }
      return 0
    })

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

  let i = 0
  return (
    <>
      <div className={styles.cardContainerBg}>
        <div className={styles.cardMenu}>
          <p>Authenticated Cards</p>
          <div className={styles.menuContainer}>
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
            />

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

        <div className={styles.cardBg}>
          {sortedData.map((cardData) => (
            <div
              className={`${styles.card} ${
                cardData.busCompany === 'Rural Transit'
                  ? styles.rtmi
                  : styles.superfive
              }`}
              onClick={() => handleEdit(cardData)}
            >
              <>
                <span className={styles.number}>{(i = i + 1)}</span>
                <span className={styles.company}>{cardData.busCompany}</span>

                <span className={styles.cardID}>
                  ID: <p>{cardData.cardID}</p>
                </span>
                <span className={styles.plateNumber}>
                  Plate No.: <p>{cardData.plateNumber}</p>
                </span>
                <span>
                  Date: <p>{cardData.date}</p>
                </span>
                <span>
                  Time: <p>{cardData.time}</p>
                </span>
              </>
            </div>
          ))}
        </div>
      </div>

      {prompt ? (
        <div className={styles.promptBg}>
          <div className={styles.prompt}>
            <h1>Remove Card</h1>
            <h5> Are you sure? </h5>
            <div className={styles.btnContainer}>
              <p
                onClick={() => {
                  setPrompt(!prompt)
                }}
              >
                No
              </p>
              <p
                onClick={() => {
                  deleteCard(toDelete)
                  setPrompt(!prompt)
                  setModalEdit(false)
                }}
              >
                Yes
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}

      {modalEdit ? (
        <div className={styles.editBg}>
          <div className={styles.form}>
            <IoCloseSharp
              className={styles.exit}
              onClick={() => setModalEdit(false)}
            />
            <form className={styles.formBox}>
              <h1>Manage Card</h1>
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
                className={styles.cardID}
                value={cardID}
              />

              <label htmlFor="company">Bus Company Name</label>
              <select
                name="company"
                id="company"
                value={busCompany}
                onChange={handleBusCompanyChange}
              >
                <option value="-">-</option>
                <option value="Rural Transit">Rural Transit</option>
                <option value="Super Five">Super Five</option>
              </select>

              <label htmlFor="plateNumber">Plate Number</label>
              <input
                type="text"
                value={plateNumber}
                onChange={handlePlateNumberChange}
              />

              <div className={styles.btnContainer}>
                <div
                  className={styles.remove}
                  onClick={() => {
                    handleDelete(cardID)
                  }}
                >
                  Remove
                </div>
                <div className={styles.update} onClick={sendUpdate}>
                  Update
                </div>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div></div>
      )}

      {updated ? (
        <SuccessMessage>Updated Successfully</SuccessMessage>
      ) : (
        <div></div>
      )}

      {deleted ? (
        <SuccessMessage>Removed Successfully</SuccessMessage>
      ) : (
        <div></div>
      )}
    </>
  )
}

export default AddedCards
