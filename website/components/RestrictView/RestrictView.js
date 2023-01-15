import styles from './restrictview.module.scss'
import Image from 'next/image'
import noPhone from '../../public/images/no-phone.png'
const RestrictView = () => {
  return (
    <div className={styles.view}>
      <div className={styles.container}>
        <div className={styles.box}>
          <h1>Notice</h1>
          <p>
            This system is <b>prohibited</b> to be viewed on mobile or small
            screens.
          </p>
          <div className={styles.display}>
            <Image src={noPhone} alt="Restricted in Phone" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default RestrictView
