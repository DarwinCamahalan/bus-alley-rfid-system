import styles from './nav.module.scss'
import Link from 'next/link'
import { MdAdminPanelSettings } from 'react-icons/md'
import { IoMdPower } from 'react-icons/io'
import DateTime from '../DateTime/DateTime'

const Nav = () => {
  return (
    <nav className={styles.navBg}>
      <div className={styles.logo}>
        <MdAdminPanelSettings />{' '}
        <div className={styles.logoName}>
          RFID Management System <span>(Beta version 0.0.1)</span>
        </div>
      </div>
      <div className={styles.status}>
        <div className={styles.dateTime}>
          <DateTime />
        </div>
        <Link href={'/signin'}>
          <IoMdPower />
        </Link>
      </div>
    </nav>
  )
}

export default Nav
