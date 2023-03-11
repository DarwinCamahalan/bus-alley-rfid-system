import styles from './success.module.scss'

const SuccessMessage = ({ children }) => {
  return (
    <div className={styles.successBg}>
      <span>{children}</span>
    </div>
  )
}

export default SuccessMessage
