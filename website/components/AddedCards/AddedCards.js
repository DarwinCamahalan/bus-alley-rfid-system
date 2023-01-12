import styles from './addedCards.module.scss'
import { db } from '../firebaseConfig'
import { ref, onValue, remove } from 'firebase/database'
import { useState, useEffect } from 'react'
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai'
import SuccessMessage from '../SuccessMessage/SuccessMessage'

import { useSelector, useDispatch } from 'react-redux'
import { SET_TOGGLE_DELETE } from '../../redux/reducers/toggle'

const AddedCards = () => {
  const [deleted, setDeleted] = useState(false)
  const [toDelete, setToDelete] = useState([])
  const [cardsData, setCardsData] = useState([])
  const [prompt, setPrompt] = useState(false)

  const { toggleDelete, toggleEdit } = useSelector((state) => state.toggle)
  const dispatch = useDispatch()

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

  const handleDelete = (cardData) => {
    setPrompt(!prompt)
    setToDelete(cardData)
  }

  const deleteCard = (cardData) => {
    remove(ref(db, `/addedCards/${cardData.uuid}`))
    setDeleted(!deleted)
    setTimeout(() => {
      setDeleted(false)
    }, 2500)
  }
  let i = 0
  return (
    <>
      <div className={styles.tableBg}>
        <table>
          <tbody>
            <tr className={styles.tableHead}>
              <th>No.</th>
              <th>Card ID</th>
              <th>Company Name</th>
              <th>Plate Number</th>
              <th>Date Created</th>
              <th>Time Created</th>
            </tr>
            {cardsData
              .sort((a, b) => a.id - b.id)
              .map((cardData) => (
                <>
                  {/* WARNING ON KEY */}
                  <tr className={styles.data} key={cardData.id}>
                    <>
                      <td> {(i = i + 1)}</td>
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
                        <AiOutlineDelete />
                      </td>
                    ) : (
                      <div></div>
                    )}
                    {toggleEdit ? (
                      <td
                        className={styles.editBtn}
                        onClick={() => console.log('EDIT MODE')}
                      >
                        {/* WARNING ON INVALID CHILD OF TD */}
                        <AiOutlineEdit />
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
                  dispatch(SET_TOGGLE_DELETE(false))
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

      {deleted ? (
        <SuccessMessage>Card Removed Successfully</SuccessMessage>
      ) : (
        <div></div>
      )}

      {toggleDelete ? (
        <SuccessMessage>Select Card to Remove</SuccessMessage>
      ) : (
        <div></div>
      )}

      {toggleEdit ? (
        <SuccessMessage>Select Card to Edit</SuccessMessage>
      ) : (
        <div></div>
      )}
    </>
  )
}

export default AddedCards
