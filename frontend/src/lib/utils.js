import { clsx } from 'clsx';

/**
 * Merge class names conditionally using clsx
 */
export function cn(...inputs) {
  return clsx(inputs);
}

/**
 * Format price for INR display
 */
export function formatPrice(paise) {
  const rupees = paise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(rupees);
}

/**
 * Get error message from API error
 */
export function getErrorMessage(error) {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.message) {
    return error.message;
  }
  return 'Something went wrong';
}
