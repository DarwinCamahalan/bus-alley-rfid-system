import styles from './modal.module.scss'
import gif from '../../public/images/rfid_scan.gif'
import Image from 'next/image'
import { IoCloseSharp } from 'react-icons/io5'
import { BiScan } from 'react-icons/bi'
const Modal = ({ children, open, closeModal, help }) => {
  if (!open) return null
  return (
    <div className={styles.modalBg}>
      <div className={styles.modal}>
        <IoCloseSharp className={styles.exit} onClick={() => closeModal()} />
        {children}
        {help ? (
          <div className={styles.gifBg}>
            <div className={styles.text}>
              <BiScan />
              <span></span>
              SCAN CARD
            </div>
            <div className={styles.img}>
              <Image src={gif} alt="my gif" />
            </div>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  )
}

export default Modal
