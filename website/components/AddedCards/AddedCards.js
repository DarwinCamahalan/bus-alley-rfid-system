import styles from './addedCards.module.scss'
import ErrorMessage from '../ErrorMessage/ErrorMessage'
import { db } from '../firebaseConfig'
import { ref, onValue, remove, update } from 'firebase/database'
import { useState, useEffect } from 'react'
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai'
import SuccessMessage from '../SuccessMessage/SuccessMessage'
import { IoCloseSharp } from 'react-icons/io5'
import { useSelector } from 'react-redux'

const AddedCards = () => {
  const [errorMsg, setErrorMsg] = useState('')
  const [error, setError] = useState(false)
  const [edited, setEdited] = useState(false)
  const [deleted, setDeleted] = useState(false)
  const [toDelete, setToDelete] = useState([])
  const [modalEdit, setModalEdit] = useState(false)
  const [cardID, setCardID] = useState('')
  const [plateNumber, setPlatenumber] = useState('')
  const [busCompany, setBusCompany] = useState('-')
  const [cardsData, setCardsData] = useState([])
  const [prompt, setPrompt] = useState(false)

  const { toggleDelete, toggleEdit } = useSelector((state) => state.toggle)

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

  const sendUpdate = () => {
    if (busCompany === '-' || plateNumber === '') {
      setError(!error)
      setErrorMsg('Enter Bus Company or Plate Number.')
      setTimeout(() => {
        setError(false)
      }, 2500)
    } else {
      update(ref(db, `/addedCards/${cardID}`), {
        plateNumber,
        busCompany,
      })
      setCardID('')
      setPlatenumber('')
      setBusCompany('-')
      setModalEdit(!modalEdit)
      setEdited(true)
      setTimeout(() => {
        setEdited(false)
      }, 2500)
    }
  }

  const handleDelete = (cardData) => {
    setPrompt(!prompt)
    setToDelete(cardData)
  }

  const deleteCard = (cardData) => {
    remove(ref(db, `/addedCards/${cardData.cardID}`))
    setDeleted(!deleted)
    setTimeout(() => {
      setDeleted(false)
    }, 2500)
  }

  let i = 0
  let j = cardsData.length + 1
  const [sortField, setSortField] = useState('id')
  const [sortDirection, setSortDirection] = useState(1)
  const [numberClicked, setNumberClicked] = useState(false)

  const sortedData = cardsData.slice().sort((a, b) => {
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
    <>
      <div className={styles.tableBg}>
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
              handleSort('date')
            }}
          >
            Date Created
          </li>
          <li
            onClick={() => {
              setNumberClicked(!numberClicked)
              handleSort('time')
            }}
          >
            Time Created
          </li>
        </ul>

        <table>
          <tbody>
            {sortedData.map((cardData) => (
              <>
                {/* WARNING ON KEY */}
                <tr className={styles.data} key={cardData.id}>
                  <>
                    <td>{numberClicked ? (j = j - 1) : (i = i + 1)}</td>
                    <td>{cardData.cardID}</td>
                    <td>{cardData.busCompany}</td>
                    <td>{cardData.plateNumber}</td>
                    <td>{cardData.date}</td>
                    <td>{cardData.time}</td>
                  </>
                  {toggleDelete ? (
                    <td
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(cardData)}
                    >
                      {/* WARNING ON INVALID CHILD OF TD */}
                      <p>
                        <AiOutlineDelete />
                      </p>
                    </td>
                  ) : (
                    <div></div>
                  )}
                  {toggleEdit ? (
                    <td
                      className={styles.editBtn}
                      onClick={() => handleEdit(cardData)}
                    >
                      {/* WARNING ON INVALID CHILD OF TD */}
                      <p>
                        <AiOutlineEdit />
                      </p>
                    </td>
                  ) : (
                    <div></div>
                  )}
                </tr>
              </>
            ))}
          </tbody>
        </table>
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

      {toggleDelete ? (
        <SuccessMessage>
          {deleted ? 'Card Removed Successfully' : 'Select Card to Remove'}
        </SuccessMessage>
      ) : (
        <div></div>
      )}

      {toggleEdit ? (
        <SuccessMessage>
          {edited ? 'Card Updated Successfully' : 'Select Card to Edit'}
        </SuccessMessage>
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
              <h1>Edit Card</h1>
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
                <option value="Super five">Super five</option>
              </select>

              <label htmlFor="plateNumber">Plate Number</label>
              <input
                type="text"
                value={plateNumber}
                onChange={handlePlateNumberChange}
              />

              <div className={styles.btnContainer}>
                <div className={styles.btn} onClick={sendUpdate}>
                  Update
                </div>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </>
  )
}

export default AddedCards
