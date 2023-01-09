import styles from './success.module.scss'
import { GiCheckMark } from 'react-icons/gi'
const SuccessMessage = ({ children }) => {
  return (
    <div className={styles.successBg}>
      <GiCheckMark />
      <span></span>
      {children}
    </div>
  )
}

export default SuccessMessage
