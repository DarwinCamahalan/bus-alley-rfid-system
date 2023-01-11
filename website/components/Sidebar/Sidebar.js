import styles from './sidebar.module.scss'
import Modal from '../Modal/Modal'
import { GiHamburgerMenu } from 'react-icons/gi'
import { IoMdArrowDropdown, IoMdAdd } from 'react-icons/io'
import { TbMathFunction } from 'react-icons/tb'
import { AiOutlinePrinter, AiOutlineDelete } from 'react-icons/ai'
import { IoInformationOutline } from 'react-icons/io5'
import { BiListUl } from 'react-icons/bi'
import { RiEdit2Line } from 'react-icons/ri'
import { MdOutlineArrowForwardIos } from 'react-icons/md'
import { db } from '../firebaseConfig'
import { set, ref } from 'firebase/database'
import { useState } from 'react'
import { useRouter } from 'next/router'
import Form from '../Form/Form'
import SuccessMessage from '../SuccessMessage/SuccessMessage'

const Sidebar = ({ openSideBar, closeSideBar }) => {
  const [menu, setMenu] = useState(false)
  const [open, showModal] = useState(false)
  const [successMsg, setSuccessMsg] = useState(false)
  const [help, setHelp] = useState(false)
  const id = 'NO CARD DETECTED'
  const router = useRouter()

  if (!openSideBar)
    return (
      <div className={styles.showSideBar} onClick={() => closeSideBar()}>
        <MdOutlineArrowForwardIos />
      </div>
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
            <li onClick={() => setMenu(!menu)}>
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
                    }}
                  >
                    <IoMdAdd className={styles.icons} />
                    Add Card
                  </li>
                  <li>
                    <RiEdit2Line className={styles.icons} />
                    Edit Card
                  </li>
                  <li>
                    <AiOutlineDelete className={styles.icons} />
                    Remove Card
                  </li>
                </ul>
              </div>
            ) : (
              <></>
            )}
            <li onClick={() => router.push('/developing')}>
              <IoInformationOutline className={styles.icons} />
              View Information
            </li>
            <li onClick={() => router.push('/developing')}>
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
