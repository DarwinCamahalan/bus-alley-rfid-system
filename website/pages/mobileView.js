import styles from '../styles/developing.module.scss'

import Image from 'next/image'
import noPhone from '../public/images/no-phone.png'
const mobileView = () => {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.box}>
          <h1>Notice</h1>
          <p>
            This system is <b>prohibited</b> to be acess on mobile or small
            screens.
          </p>
          <div className={styles.display}>
            <Image src={noPhone} alt="Restricted in Phone" />
          </div>
        </div>
      </div>
    </>
  )
}

export default mobileView
