import { useEffect, useRef } from 'react';
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import styles from './Drower.module.scss'

const Drower = ({ children, close }) => {
    const drawerRef = useRef(null);
    const closeRef = useRef(close);

    useEffect(() => {
        closeRef.current = close;
    }, [close]);

    useEffect(() => {
        const previousActiveElement = document.activeElement;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        drawerRef.current?.focus();
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                closeRef.current();
                return;
            }

            if (event.key !== 'Tab') return;

            const focusableElements = [...drawerRef.current.querySelectorAll(
                'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
            )];
            const first = focusableElements[0];
            const last = focusableElements[focusableElements.length - 1];

            if (!first) {
                event.preventDefault();
                drawerRef.current.focus();
            } else if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = previousOverflow;
            if (previousActiveElement?.isConnected) {
                previousActiveElement.focus();
            }
        };
    }, []);

    return (
        <div className={styles.drower} role="presentation">
            <div className={styles.drowerContainer} ref={drawerRef} role="dialog" aria-modal="true" aria-label="Calculadora de porciones" tabIndex={-1}>
                <div className={styles.drowerContainerHeader}>
                    <button type="button" onClick={close} aria-label="Cerrar calculadora">
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}
 
export default Drower;
