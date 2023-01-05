import styles from './form.module.scss'

const Form = ({ title }) => {
  return (
    <form className={styles.formBox}>
      <h1>{title}</h1>
      <input id="username" type="text" placeholder="Enter username" />
    </form>
  )
}

export default Form
