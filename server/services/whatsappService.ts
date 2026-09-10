/**
 * WhatsApp Manual Communication Service
 * As instructed in PART 5:
 * Generates official click-to-chat deep-links (https://wa.me/{phone}?text={encoded})
 * with prefilled contact and AI-generated message.
 */

export function sanitizePhoneNumberForWhatsApp(phone: string): string {
  if (!phone) return '';
  // Remove all non-digits
  let digits = phone.replace(/\D/g, '');
  
  // If 10 digits (standard Indian mobile starting with 6, 7, 8, 9), prefix 91
  if (digits.length === 10 && /^[6-9]/.test(digits)) {
    digits = '91' + digits;
  }
  
  return digits;
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  const cleanPhone = sanitizePhoneNumberForWhatsApp(phone);
  const encoded = encodeURIComponent(message.trim());
  if (!cleanPhone) {
    // If no phone number available, open generic WhatsApp share
    return `https://wa.me/?text=${encoded}`;
  }
  return `https://wa.me/${cleanPhone}?text=${encoded}`;
}
