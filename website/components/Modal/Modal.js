import styles from './modal.module.scss'

import { IoCloseSharp } from 'react-icons/io5'
const Modal = ({ children, open, closeModal }) => {
  if (!open) return null
  return (
    <div className={styles.modalBg}>
      <div className={styles.modal}>
        <IoCloseSharp className={styles.exit} onClick={() => closeModal()} />
        {children}
      </div>
    </div>
  )
}

export default Modal
