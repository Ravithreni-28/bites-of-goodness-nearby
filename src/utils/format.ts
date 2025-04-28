
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
 * Format a date as a readable string
 */
export const formatDate = (date: string | Date): string => {
  // Validate the date before formatting
  if (!date) return 'Invalid date';
  
  try {
    const dateObj = new Date(date);
    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }
    
    return dateObj.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    return 'Invalid date';
  }
};

/**
 * Format a timestamp in relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (timestamp: string | Date | null | undefined): string => {
  // Handle null, undefined or invalid date values
  if (!timestamp) return 'Unknown time';
  
  try {
    const now = new Date();
    const date = new Date(timestamp);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
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
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return 'Unknown time';
  }
};
