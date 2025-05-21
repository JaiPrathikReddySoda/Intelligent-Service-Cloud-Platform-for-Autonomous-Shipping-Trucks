
import { useState } from 'react';

// Define the types for our toast
export type ToastVariant = 'default' | 'destructive' | 'success';

export interface ToastProps {
  title?: string;
  description: string;
  variant?: ToastVariant;
  duration?: number;
}

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const toast = ({ title, description, variant = 'default', duration = 5000 }: ToastProps) => {
    // Add new toast to the array
    setToasts((prevToasts) => [...prevToasts, { title, description, variant, duration }]);
    
    // Remove toast after duration
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((_, index) => index !== 0));
    }, duration);
  };

  return { toast, toasts };
};

// Singleton for direct toast calls
export const toast = ({ title, description, variant = 'default', duration = 5000 }: ToastProps) => {
  // This function can be called directly without the hook
  console.log(`Toast: ${variant} - ${title} - ${description}`);
  
  // Create toast element
  const toastElement = document.createElement('div');
  toastElement.className = `fixed bottom-4 right-4 p-4 rounded-md shadow-md ${
    variant === 'destructive' ? 'bg-red-500' : 
    variant === 'success' ? 'bg-green-500' : 'bg-blue-500'
  } text-white max-w-xs z-50`;
  
  // Add title if provided
  if (title) {
    const titleElement = document.createElement('h4');
    titleElement.className = 'font-bold text-sm';
    titleElement.textContent = title;
    toastElement.appendChild(titleElement);
  }
  
  // Add description
  const descElement = document.createElement('p');
  descElement.className = 'text-sm';
  descElement.textContent = description;
  toastElement.appendChild(descElement);
  
  // Add to DOM
  document.body.appendChild(toastElement);
  
  // Remove after duration
  setTimeout(() => {
    if (document.body.contains(toastElement)) {
      document.body.removeChild(toastElement);
    }
  }, duration);
};
