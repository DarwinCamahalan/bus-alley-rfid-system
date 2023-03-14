import styles from './success.module.scss'
import cardImage from '../../public/images/card.png'
import Image from 'next/image'
import { GiCheckMark } from 'react-icons/gi'
const SuccessMessage = ({ children, choice }) => {
  return (
    <div className={styles.successBg}>
      <span>
        <GiCheckMark className={styles.logo} />
        <p>{children}</p>
        <Image src={cardImage} alt="Card Image" placeholder="blur" />
        <div className={styles.loadingBar}></div>
      </span>
    </div>
  )
}

export default SuccessMessage
