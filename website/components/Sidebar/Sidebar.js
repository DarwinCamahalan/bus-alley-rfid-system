import styles from './sidebar.module.scss'
import Modal from '../Modal/Modal'
import { GiHamburgerMenu } from 'react-icons/gi'
import { IoMdArrowDropdown, IoMdAdd } from 'react-icons/io'
import { TbMathFunction } from 'react-icons/tb'
import {
  AiOutlinePrinter,
  AiOutlineDelete,
  AiOutlineEdit,
} from 'react-icons/ai'
import { IoInformationOutline } from 'react-icons/io5'
import { BiListUl } from 'react-icons/bi'
import { db } from '../firebaseConfig'
import { set, ref } from 'firebase/database'
import { useState } from 'react'
import { useRouter } from 'next/router'
import Form from '../Form/Form'
import SuccessMessage from '../SuccessMessage/SuccessMessage'
import SmallSidebar from './SmallSideBar'
import { useSelector, useDispatch } from 'react-redux'
import { SET_TOGGLE_DELETE, SET_TOGGLE_EDIT } from '../../redux/reducers/toggle'
import { SET_MENU_CHOICE } from '../../redux/reducers/menu'

const Sidebar = ({ openSideBar, closeSideBar }) => {
  const [menu, setMenu] = useState(false)
  const [open, showModal] = useState(false)
  const [successMsg, setSuccessMsg] = useState(false)
  const [help, setHelp] = useState(false)
  const id = 'NO CARD DETECTED'
  const router = useRouter()

  const { toggleDelete, toggleEdit } = useSelector((state) => state.toggle)
  const dispatch = useDispatch()
  if (!openSideBar)
    return (
      <SmallSidebar
        showMenu={() => {
          setMenu(true)
          closeSideBar()
        }}
        close={() => {
          closeSideBar()
        }}
      />
    )

  const sendData = () => {
    set(ref(db, `/card`), {
      id,
    })
  }

  return (
    <>
      <div className={styles.sideBarContainer}>
        <div className={styles.menuIcon}>
          <GiHamburgerMenu
            className={styles.icons}
            onClick={() => closeSideBar()}
          />
        </div>
        <div className={styles.menuContainer}>
          <ul>
            <li
              onClick={() => {
                dispatch(SET_MENU_CHOICE('1'))
                setMenu(!menu)
              }}
            >
              <IoMdArrowDropdown className={styles.icons} />
              RFID Card Settings
            </li>
            {menu ? (
              <div className={styles.choices}>
                <ul>
                  <li
                    onClick={() => {
                      sendData()
                      showModal(!open)
                      dispatch(SET_TOGGLE_DELETE(false))
                      dispatch(SET_TOGGLE_EDIT(false))
                    }}
                  >
                    <IoMdAdd className={styles.icons} />
                    Add Card
                  </li>
                  <li
                    onClick={() => {
                      dispatch(SET_TOGGLE_DELETE(false))
                      dispatch(SET_TOGGLE_EDIT(!toggleEdit))
                    }}
                    style={toggleEdit ? { backgroundColor: '#0067b8' } : {}}
                  >
                    <AiOutlineEdit className={styles.icons} />
                    {toggleEdit ? 'Edit Mode' : 'Edit Card'}
                  </li>
                  <li
                    onClick={() => {
                      dispatch(SET_TOGGLE_DELETE(!toggleDelete))
                      dispatch(SET_TOGGLE_EDIT(false))
                    }}
                    style={toggleDelete ? { backgroundColor: 'red' } : {}}
                  >
                    <AiOutlineDelete className={styles.icons} />
                    {toggleDelete ? 'Delete Mode' : 'Remove Card'}
                  </li>
                </ul>
              </div>
            ) : (
              <></>
            )}
            <li
              onClick={() => {
                router.push('/developing')
                // dispatch(SET_MENU_CHOICE('2'))
              }}
            >
              <IoInformationOutline className={styles.icons} />
              View Information
            </li>
            <li
              onClick={() => {
                setMenu(false)
                dispatch(SET_MENU_CHOICE('3'))
              }}
            >
              <BiListUl className={styles.icons} />
              Recorded Logs
            </li>
            <li onClick={() => router.push('/developing')}>
              <TbMathFunction className={styles.icons} />
              Compute Revenue
            </li>
            <li onClick={() => router.push('/developing')}>
              <AiOutlinePrinter className={styles.icons} />
              Print Report
            </li>
          </ul>
        </div>
      </div>

      <div>
        <Modal
          help={help}
          open={open}
          closeModal={() => {
            showModal(false)
          }}
        >
          <Form
            title="Add Card"
            closeModal={() => {
              showModal(false)
            }}
            success={() => {
              setSuccessMsg(true)
              setTimeout(() => {
                setSuccessMsg(false)
              }, 2500)
            }}
            help={() => {
              setHelp(!help)
            }}
          />
        </Modal>
      </div>

      <div>
        {successMsg ? (
          <SuccessMessage>Card Added Successfully</SuccessMessage>
        ) : (
          <div> </div>
        )}
      </div>
    </>
  )
}

export default Sidebar
