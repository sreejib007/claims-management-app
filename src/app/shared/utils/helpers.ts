/**
 * Utility helper functions for the FNOL application
 */

/**
 * Get initials from a name
 */
export function getInitials(name: string | null): string {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

/**
 * Format currency value
 */
export function formatCurrency(value: number, currency: string = '£', decimals: number = 0): string {
  if (value === null || value === undefined) return '';
  return `${currency}${value.toLocaleString('en-GB', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })}`;
}

/**
 * Format date to locale string
 */
export function formatDate(dateString: string, options?: Intl.DateTimeFormatOptions): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', options || { day: '2-digit', month: 'short', year: 'numeric' });
}

/**
 * Get days difference from a date
 */
export function getDaysSince(dateString: string): number {
  if (!dateString) return 0;
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Get days until a future date
 */
export function getDaysUntil(dateString: string): number {
  if (!dateString) return 0;
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Normalize string for CSS class usage
 */
export function toKebabCase(str: string): string {
  return str.toLowerCase().replace(/\s+/g, '-');
}

/**
 * Get status severity for PrimeNG Tag component
 */
export function getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
  const severityMap: { [key: string]: 'success' | 'info' | 'warn' | 'danger' | 'secondary' } = {
    'new': 'info',
    'in review': 'warn',
    'referred': 'danger',
    'approved': 'success',
    'closed': 'secondary',
    'active': 'success',
    'expired': 'danger',
    'cancelled': 'secondary',
    'stp': 'success',
    'refer': 'warn',
    'request-docs': 'info'
  };
  return severityMap[status.toLowerCase()] || 'secondary';
}

/**
 * Get icon for loss type
 */
export function getLossTypeIcon(lossType: string): string {
  const iconMap: { [key: string]: string } = {
    'accident': 'pi pi-car',
    'theft': 'pi pi-lock',
    'water damage': 'pi pi-cloud',
    'waterdamage': 'pi pi-cloud',
    'fire': 'pi pi-bolt',
    'wind damage': 'pi pi-sun',
    'winddamage': 'pi pi-sun',
    'other': 'pi pi-question-circle'
  };
  return iconMap[lossType.toLowerCase()] || 'pi pi-exclamation-triangle';
}

/**
 * Get icon for product/policy type
 */
export function getProductTypeIcon(productType: string): string {
  const iconMap: { [key: string]: string } = {
    'motor': 'pi pi-car',
    'home': 'pi pi-home'
  };
  return iconMap[productType.toLowerCase()] || 'pi pi-file';
}
