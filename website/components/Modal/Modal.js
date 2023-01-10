import styles from './modal.module.scss'
import gif from '../../public/images/rfid_scan.gif'
import Image from 'next/image'
import { IoCloseSharp } from 'react-icons/io5'
import { RiQrScan2Line } from 'react-icons/ri'
const Modal = ({ children, open, closeModal }) => {
  if (!open) return null
  return (
    <div className={styles.modalBg}>
      <div className={styles.modal}>
        <IoCloseSharp className={styles.exit} onClick={() => closeModal()} />
        {children}
      </div>
      <div className={styles.gifBg}>
        <div className={styles.text}>
          <RiQrScan2Line />
          <span></span>
          PLACE CARD
        </div>
        <div className={styles.img}>
          <Image src={gif} alt="my gif" />
        </div>
      </div>
    </div>
  )
}

export default Modal
