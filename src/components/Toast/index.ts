type ToastType = 'success' | 'error' | 'info';

class ToastService {
  success(message: string) {
    this.show(message, 'success');
  }

  error(message: string) {
    this.show(message, 'error');
  }

  info(message: string) {
    this.show(message, 'info');
  }

  private show(message: string, type: ToastType) {
    // Pour l'instant, on utilise une simple alerte
    // À remplacer par une vraie implémentation de toast
    alert(`${type.toUpperCase()}: ${message}`);
  }
}

export const toast = new ToastService(); 