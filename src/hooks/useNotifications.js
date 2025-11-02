import { useNotification } from '../contexts/NotificationContext';

/**
 * Hook personalizado para facilitar el uso de notificaciones
 * Proporciona métodos de conveniencia para mostrar diferentes tipos de notificaciones
 */
export const useNotifications = () => {
  const notificationContext = useNotification();

  return {
    showSuccess: notificationContext.showSuccess,
    showError: notificationContext.showError,
    clearAll: notificationContext.clearAllNotifications,
  };
};

export default useNotifications;
