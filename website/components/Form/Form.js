import styles from './form.module.scss'

const Form = ({ title }) => {
  return (
    <form className={styles.formBox}>
      <h1>{title}</h1>
      <label htmlFor="cardID">Card ID</label>
      <input type="text" value="SCAN CARD" disabled />

      <label htmlFor="company">Bus Company Name</label>
      <select name="company" id="company">
        <option value="-">-</option>
        <option value="Rural-RTMI">Rural - RTMI</option>
        <option value="Superfive">Superfive</option>
      </select>

      <label htmlFor="plateNumber">Plate Number</label>
      <input type="text" />

      <div className={styles.btnContainer}>
        <input type="submit" value="Add" className={styles.btn} />
      </div>
    </form>
  )
}

export default Form
