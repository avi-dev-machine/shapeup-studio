/**
 * WhatsApp deep-linking utility.
 * Opens WhatsApp with pre-filled booking message.
 */

const WHATSAPP_NUMBER = '919239756202';  // +91 92397 56202

/**
 * Generate a WhatsApp deep-link URL.
 * @param {string} packageName - Name of the selected package
 * @param {string} userName - User's name (optional)
 * @returns {string} WhatsApp URL
 */
export function getWhatsAppLink(packageName = '', userName = '') {
  const message = userName
    ? `Hi! I'm ${userName} and I'm interested in the "${packageName}" package at SHAPE UP. Please share more details.`
    : `Hi! I'm interested in the "${packageName}" package at SHAPE UP. Please share more details.`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Generate a general WhatsApp enquiry link.
 * @returns {string} WhatsApp URL
 */
export function getWhatsAppEnquiryLink() {
  const message = "Hi! I'd like to know more about SHAPE UP fitness studio. Please share details about your membership plans.";
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
