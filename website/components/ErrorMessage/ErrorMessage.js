import styles from './error.module.scss'

const ErrorMessage = ({ children }) => {
  return (
    <div className={styles.errorBg}>
      <span>{children}</span>
    </div>
  )
}

export default ErrorMessage
