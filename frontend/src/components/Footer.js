'use client';
import { PHONE_NUMBERS, EMAIL, EMAIL_LINK } from '@/utils/dialer';
import { getWhatsAppEnquiryLink } from '@/utils/whatsapp';
import { Phone, Mail, MessageCircle } from 'lucide-react';
import styles from './Footer.module.css';

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const YoutubeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
  </svg>
);

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
            <div className={styles.socialIcons}>
              <a href="https://www.facebook.com/share/1KrZFtZHxT/" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <FacebookIcon />
              </a>
              <a href="https://www.instagram.com/shapeupfitnes?igsh=ejd5YWRoem0xcXJp" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <InstagramIcon />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className={`${styles.socialLink} ${styles.disabled}`}>
                <YoutubeIcon />
              </a>
            </div>
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
