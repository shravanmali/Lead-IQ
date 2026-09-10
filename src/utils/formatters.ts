/**
 * Indian Market Number, Currency, and Date Formatters
 */

/**
 * Formats a number into Indian Rupee format with ₹ symbol and en-IN commas.
 * Example: 2450000 -> "₹24,50,000", 75000 -> "₹75,000", 12500000 -> "₹1,25,00,000"
 */
export function formatINR(val: number): string {
  if (isNaN(val)) return '₹0';
  return `₹${Math.round(val).toLocaleString('en-IN')}`;
}

/**
 * Formats large amounts into Lakhs (L) or Crores (Cr) for compact labels and chart axes.
 * Example: 580000 -> "₹5.8L", 2450000 -> "₹24.5L", 12500000 -> "₹1.25 Cr"
 */
export function formatINRShort(val: number): string {
  if (isNaN(val)) return '₹0';
  const absVal = Math.abs(val);

  if (absVal >= 10000000) {
    const cr = (val / 10000000).toFixed(2);
    return `₹${parseFloat(cr)} Cr`;
  }
  if (absVal >= 100000) {
    const lakh = (val / 100000).toFixed(1);
    return `₹${parseFloat(lakh)}L`;
  }
  if (absVal >= 1000) {
    const k = (val / 1000).toFixed(1);
    return `₹${parseFloat(k)}k`;
  }
  return `₹${val.toLocaleString('en-IN')}`;
}

/**
 * Formats dates into Indian standard readable format.
 * Example: "10 Sep 2026"
 */
export function formatIndianDate(dateInput: string | Date): string {
  try {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(date.getTime())) return String(dateInput);

    const day = date.getDate().toString().padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  } catch {
    return String(dateInput);
  }
}

/**
 * Formats date and time into Indian Standard Time (IST).
 * Example: "10 Sep 2026, 2:30 PM IST"
 */
export function formatIndianDateTime(dateInput: string | Date): string {
  try {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(date.getTime())) return String(dateInput);

    const dateStr = formatIndianDate(date);
    const timeStr = date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    return `${dateStr}, ${timeStr} IST`;
  } catch {
    return String(dateInput);
  }
}
