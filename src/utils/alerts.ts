// src/utils/alerts.ts
import Swal from 'sweetalert2';

export const AppAlert = Swal.mixin({
  background: '#111114',
  color: '#fff',
  confirmButtonColor: '#7C3AED',
  cancelButtonColor: '#3f3f46',
  reverseButtons: true,
  customClass: {
    popup: 'rounded-[2rem] border border-gray-800 shadow-2xl',
    title: 'text-2xl font-black italic uppercase tracking-tight',
    htmlContainer: 'text-gray-400 font-medium',
    confirmButton: 'px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-sm',
    cancelButton: 'px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-sm',
  }
});

// Um Toast para mensagens rápidas (ex: "Senhas não coincidem")
export const AppToast = AppAlert.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});