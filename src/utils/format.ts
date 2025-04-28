
/**
 * Format a number as INR currency
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Check if a value is a valid date
 */
export const isValidDate = (date: any): boolean => {
  if (!date) return false;
  const d = new Date(date);
  // Check if the date is valid and not NaN
  return !isNaN(d.getTime());
};

/**
 * Format a date as a readable string
 */
export const formatDate = (date: string | Date): string => {
  if (!isValidDate(date)) return 'Invalid date';
  
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Format a timestamp in relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (timestamp: string | Date): string => {
  if (!isValidDate(timestamp)) return 'Unknown time';
  
  const now = new Date();
  const date = new Date(timestamp);
  const diffInMilliseconds = now.getTime() - date.getTime();
  
  const seconds = Math.floor(diffInMilliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 7) {
    return formatDate(timestamp);
  } else if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
};
