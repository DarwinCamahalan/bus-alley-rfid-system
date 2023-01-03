import { MdAdminPanelSettings } from 'react-icons/md'
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5'
import { useState } from 'react'
import styles from '../styles/login.module.scss'
import Link from 'next/link'

const Login = () => {
  const [show, setShow] = useState(false)
  return (
    <div className={styles.body}>
      <div className={styles.signinBox}>
        <form action="">
          <div className={styles.logo}>
            <MdAdminPanelSettings /> <span>RFID Management System</span>
          </div>
          <p>Sign in</p>
          <input id="username" type="text" placeholder="Enter username" />
          <div className={styles.showContainer}>
            <div className={styles.showIcon} onClick={() => setShow(!show)}>
              {show ? <IoEyeOffOutline /> : <IoEyeOutline />}
            </div>
            <input
              id="password"
              type={show ? 'password' : 'text'}
              placeholder="Enter password"
            />
          </div>

          <div className={styles.createAcc}>
            No account?<Link href={'/'}> Create one!</Link>
          </div>
          <div className={styles.btnContainer}>
            <input type="button" value="Sign in" className={styles.btn} />
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
