import styles from './sidebar.module.scss'
import Modal from '../Modal/Modal'
import { GiHamburgerMenu } from 'react-icons/gi'
import { IoMdArrowDropdown, IoMdAdd } from 'react-icons/io'
import { TbMathFunction } from 'react-icons/tb'
import {
  AiOutlineBorderlessTable,
  AiOutlinePrinter,
  AiOutlineDelete,
} from 'react-icons/ai'
import { IoInformationOutline } from 'react-icons/io5'
import { RiEdit2Line } from 'react-icons/ri'
import { useState } from 'react'

const Sidebar = () => {
  const [menu, setMenu] = useState(false)
  const [open, showModal] = useState(false)
  return (
    <>
      <div className={styles.sideBarContainer}>
        <div className={styles.menuIcon}>
          <GiHamburgerMenu className={styles.icons} />
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
                  <li onClick={() => showModal(!open)}>
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
            <li>
              <IoInformationOutline className={styles.icons} />
              View Information
            </li>
            <li>
              <AiOutlineBorderlessTable className={styles.icons} />
              Recorded Logs
            </li>
            <li>
              <TbMathFunction className={styles.icons} />
              Compute Revenue
            </li>
            <li>
              <AiOutlinePrinter className={styles.icons} />
              Print Report
            </li>
          </ul>
        </div>
      </div>

      <div>
        <Modal
          open={open}
          closeModal={() => {
            showModal(false)
          }}
        >
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates
          voluptate, a dolorum obcaecati nesciunt tempora aliquid alias nam,
          culpa neque vel laborum aperiam. Itaque commodi doloribus illo
          perferendis possimus accusamus velit sed totam iusto eos, dignissimos
          nesciunt, quaerat asperiores esse obcaecati facere odio molestias
          dolorum quis modi corrupti eligendi soluta?
        </Modal>
      </div>
    </>
  )
}

export default Sidebar
