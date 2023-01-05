import styles from './addedCards.module.scss'

const AddedCards = () => {
  const date = new Date().toLocaleDateString() + ''
  const time = new Date().toLocaleTimeString() + ''
  return <div className={styles.tableBg}>TABLE</div>
}

export default AddedCards
