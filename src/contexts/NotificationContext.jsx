import React, { createContext, useContext, useState, useCallback } from 'react';
import NotificationContainer from '../components/Notifications/NotificationContainer';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification debe ser usado dentro de NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      type: 'success',
      ...notification,
    };
    
    setNotifications(prev => [...prev, newNotification]);
    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Métodos básicos
  const showSuccess = useCallback((message) => {
    return addNotification({
      type: 'success',
      title: '¡Éxito!',
      message,
    });
  }, [addNotification]);

  const showError = useCallback((message) => {
    return addNotification({
      type: 'error',
      title: 'Error',
      message,
    });
  }, [addNotification]);

  // Eliminados showInfo y showWarning para simplificar a éxito y error

  // API simplificada: sin métodos de conveniencia adicionales

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    showSuccess,
    showError,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer 
        notifications={notifications} 
        onClose={removeNotification} 
      />
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
