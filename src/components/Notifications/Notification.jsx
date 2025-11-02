import React, { useEffect, useState } from 'react';
import './Notification.css';

// Iconos SVG como componentes
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
  </svg>
);

const ErrorIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>
);

// Eliminados InfoIcon y WarningIcon para dejar solo éxito y error

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg>
);

const Notification = ({ 
  id,
  type = 'success',
  title,
  message,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const DURATION_MS = 5000;

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    const hideTimer = setTimeout(() => {
      handleClose();
    }, DURATION_MS);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.(id);
    }, 300); // Esperar a que termine la animación
  };

  const getIcon = () => {
    if (type === 'error') return <ErrorIcon />;
    return <CheckIcon />;
  };

  const notificationClass = `notification notification--${type} ${isVisible ? 'show' : 'hide'}`;

  return (
    <div
      className={notificationClass}
    >
      <div className="notification__icon">
        {getIcon()}
      </div>
      
      <div className="notification__content">
        {title && <h4 className="notification__title">{title}</h4>}
        {message && <p className="notification__message">{message}</p>}
      </div>
      
      <button 
        className="notification__close"
        onClick={handleClose}
        aria-label="Cerrar notificación"
      >
        <CloseIcon />
      </button>
      
      <div className="notification__progress">
        <div className="notification__progress-bar" />
      </div>
    </div>
  );
};

export default Notification;
