import styles from './smallSidebar.module.scss'

import { GiHamburgerMenu } from 'react-icons/gi'
import { IoMdArrowDropright } from 'react-icons/io'
import { TbMathFunction } from 'react-icons/tb'
import { AiOutlineLineChart } from 'react-icons/ai'
import { RiBusFill } from 'react-icons/ri'
import { CgDollar } from 'react-icons/cg'
import { useDispatch } from 'react-redux'
import { SET_MENU_CHOICE } from '../../redux/reducers/menu'
import { useRouter } from 'next/router'

const SmallSideBar = ({ close, showMenu }) => {
  const dispatch = useDispatch()

  return (
    <div className={styles.smallSidebarBg}>
      <GiHamburgerMenu onClick={() => close()} className={styles.menuIcon} />
      <div className={styles.menuContainer}>
        <ul>
          <li
            onClick={() => {
              dispatch(SET_MENU_CHOICE('1'))
              showMenu()
            }}
          >
            <IoMdArrowDropright className={styles.icons} />
            <span>RFID Card Settings</span>
          </li>
          <li
            onClick={() => {
              dispatch(SET_MENU_CHOICE('2'))
            }}
          >
            <AiOutlineLineChart className={styles.icons} />
            <span>Data Analytics</span>
          </li>
          <li
            onClick={() => {
              dispatch(SET_MENU_CHOICE('3'))
            }}
          >
            <RiBusFill className={styles.icons} />
            <span>Departed Bus</span>
          </li>
          <li
            onClick={() => {
              dispatch(SET_MENU_CHOICE('4'))
            }}
          >
            <TbMathFunction className={styles.icons} />
            <span>Compute Revenue</span>
          </li>
          <li
            onClick={() => {
              dispatch(SET_MENU_CHOICE('5'))
            }}
          >
            <CgDollar className={styles.icons} />
            <span>Billing Statement</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default SmallSideBar
