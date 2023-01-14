import styles from './smallSidebar.module.scss'

import { GiHamburgerMenu } from 'react-icons/gi'
import { IoMdArrowDropright } from 'react-icons/io'
import { TbMathFunction } from 'react-icons/tb'
import { AiOutlinePrinter } from 'react-icons/ai'
import { IoInformationOutline } from 'react-icons/io5'
import { BiListUl } from 'react-icons/bi'
import { useDispatch } from 'react-redux'
import { SET_MENU_CHOICE } from '../../redux/reducers/menu'
import { useRouter } from 'next/router'

const SmallSideBar = ({ close, showMenu }) => {
  const dispatch = useDispatch()
  const router = useRouter()
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
          <li onClick={() => router.push('/developing')}>
            <IoInformationOutline className={styles.icons} />
            <span>View Information</span>
          </li>
          <li onClick={() => dispatch(SET_MENU_CHOICE('3'))}>
            <BiListUl className={styles.icons} />
            <span>Recorded Logs</span>
          </li>
          <li onClick={() => router.push('/developing')}>
            <TbMathFunction className={styles.icons} />
            <span>Compute Revenue</span>
          </li>
          <li onClick={() => router.push('/developing')}>
            <AiOutlinePrinter className={styles.icons} />
            <span>Print Report</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default SmallSideBar
