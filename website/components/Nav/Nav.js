import styles from './nav.module.scss'
import Link from 'next/link'
import { BiShieldQuarter } from 'react-icons/bi'
import { IoMdPower } from 'react-icons/io'

const Nav = () => {
  return (
    <nav className={styles.navBg}>
      <div className={styles.logo}>
        <BiShieldQuarter />{' '}
        <div className={styles.logoName}>
          RFID Management System <span>(Beta version 0.6.9)</span>
        </div>
      </div>
      <div className={styles.status}>
        <div className={styles.dateTime}>TIME</div>
        <Link href={'/signin'}>
          <IoMdPower />
        </Link>
      </div>
    </nav>
  )
}

export default Nav
