import styles from './sidebar.module.scss'
import { GiHamburgerMenu } from 'react-icons/gi'
import { MdOutlineAdd } from 'react-icons/md'
import { CiCalculator2 } from 'react-icons/ci'
import { AiOutlineBorderlessTable } from 'react-icons/ai'
import { IoInformationOutline } from 'react-icons/io5'
const Sidebar = () => {
  return (
    <div className={styles.sideBarContainer}>
      <div className={styles.menuIcon}>
        <GiHamburgerMenu className={styles.icons} />
      </div>
      <div className={styles.menuContainer}>
        <ul>
          <li>
            <MdOutlineAdd className={styles.icons} />
            Add RFID Card
          </li>
          <li>
            <CiCalculator2 className={styles.icons} />
            Compute Revenue
          </li>
          <li>
            <IoInformationOutline className={styles.icons} />
            View Information
          </li>
          <li>
            <AiOutlineBorderlessTable className={styles.icons} />
            Recorded Logs
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Sidebar
