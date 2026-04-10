import styles from './Modal.module.scss';

interface ModalProps {
    title: string
    body: string
    confirmText: string
    closeModal: () => void
    confirmAction: () => void
}

const Modal = ({ title, body, confirmText, closeModal, confirmAction }: ModalProps) => {
    return (
      <div className={`${styles['modal']}`}>
        <h2>{title}</h2>
        <p>{body}</p>
        <div className={`${styles['modal__buttons']}`}>
          <button onClick={confirmAction}>{confirmText}</button>
          <button onClick={closeModal}>Cancel</button>
        </div>
      </div>
    )
}

export default Modal;