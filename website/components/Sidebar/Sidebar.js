import styles from './sidebar.module.scss'
import Modal from '../Modal/Modal'
import { GiHamburgerMenu } from 'react-icons/gi'
import { IoMdArrowDropdown, IoMdAdd } from 'react-icons/io'
import { TbMathFunction } from 'react-icons/tb'
import {
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineLineChart,
} from 'react-icons/ai'
import { RiBusFill } from 'react-icons/ri'
import { CgDollar } from 'react-icons/cg'
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
  const [help, setHelp] = useState(true)
  const id = 'NO CARD DETECTED'

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
                </ul>
              </div>
            ) : (
              <></>
            )}
            <li
              onClick={() => {
                setMenu(false)
                dispatch(SET_MENU_CHOICE('2'))
              }}
            >
              <AiOutlineLineChart className={styles.icons} />
              Data Analytics
            </li>
            <li
              onClick={() => {
                setMenu(false)
                dispatch(SET_MENU_CHOICE('3'))
              }}
            >
              <RiBusFill className={styles.icons} />
              Departed Bus
            </li>
            <li
              onClick={() => {
                setMenu(false)
                dispatch(SET_MENU_CHOICE('4'))
              }}
            >
              <TbMathFunction className={styles.icons} />
              Compute Revenue
            </li>
            <li
              onClick={() => {
                setMenu(false)
                dispatch(SET_MENU_CHOICE('5'))
              }}
            >
              <CgDollar className={styles.icons} />
              Billing Statement
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
