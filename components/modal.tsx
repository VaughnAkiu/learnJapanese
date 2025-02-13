import React from 'react';
import utilStyles from '../styles/utils.module.css';

const Modal = ({ show, onClose, children }) => {
  if (!show) {
    return null;
  }

  return (
    <div className={utilStyles.modalOverlay}>
      <div className={utilStyles.modal}>
        <button className={utilStyles.modalCloseButton} onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;