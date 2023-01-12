import styles from './success.module.scss'

const SuccessMessage = ({ children }) => {
  return (
    <div className={styles.successBg}>
      <span></span>
      {children}
    </div>
  )
}

export default SuccessMessage
