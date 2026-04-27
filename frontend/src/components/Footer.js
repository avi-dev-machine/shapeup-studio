'use client';
import { PHONE_NUMBERS, EMAIL, EMAIL_LINK } from '@/utils/dialer';
import { getWhatsAppEnquiryLink } from '@/utils/whatsapp';
import { Phone, Mail, MessageCircle } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer} id="contact">
      <div className={`container ${styles.container}`}>
        <div className={styles.grid}>
          {/* Brand */}
          <div className={styles.brand}>
            <div className={styles.logo}>
              <span className={styles.logoText}>SHAPE</span>
              <span className={styles.logoAccent}>UP</span>
            </div>
            <p className={styles.tagline}>
              Your transformation starts here. Premium fitness. Professional trainers.
              Proven results since 2001.
            </p>
          </div>

          {/* Quick Links */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Quick Links</h4>
            <a href="#about" className={styles.footerLink}>About Us</a>
            <a href="#trainers" className={styles.footerLink}>Our Trainers</a>
            <a href="#pricing" className={styles.footerLink}>Membership</a>
            <a href="#gallery" className={styles.footerLink}>Gallery</a>
            <a href="#reviews" className={styles.footerLink}>Reviews</a>
          </div>

          {/* Contact */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Contact Us</h4>
            {PHONE_NUMBERS.map((p) => (
              <a key={p.number} href={p.tel} className={styles.footerLink} style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                <Phone size={14} /> {p.number}
              </a>
            ))}
            <a href={EMAIL_LINK} className={styles.footerLink} style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
              <Mail size={14} /> {EMAIL}
            </a>
          </div>

          {/* WhatsApp CTA */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Get Started</h4>
            <a
              href={getWhatsAppEnquiryLink()}
              target="_blank"
              rel="noopener noreferrer"
              className={`btn btn-primary ${styles.whatsappBtn}`}
            >
              <MessageCircle size={20} fill="currentColor" />
              Chat on WhatsApp
            </a>
            <p className={styles.whatsappNote}>
              Click to enquire about memberships, schedules, or any questions!
            </p>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© {new Date().getFullYear()} SHAPE UP Fitness Studio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
