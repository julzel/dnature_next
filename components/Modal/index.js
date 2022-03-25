import React, { useRef, useEffect, useState } from 'react'

// local imports
// styles
import styles from './Modal.module.scss'

const Modal = ({ children, show, onModalClose }) => {
    const modalElement = useRef(null)
    const style = {
        left: show ? '100vw' : '0'
    }

    useEffect(() => {
        modalElement.current.classList.add(show ? 'slideIn' : 'slideOut')
        void modalElement.current.offsetWidth
        modalElement.current.classList.remove(show ? 'slideOut' : 'slideIn')
    }, [show])


    return (
        <div
            ref={modalElement}
            className={`${styles.modal}`}
            style={style}
        >
            <button
                onClick={onModalClose}
                className={styles.modalClose}
            >
                &times;
            </button>
            {children}
        </div>
    )
}
 
export default Modal