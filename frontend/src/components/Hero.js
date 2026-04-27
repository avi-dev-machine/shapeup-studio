'use client';
import { useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { getWhatsAppEnquiryLink } from '@/utils/whatsapp';
import styles from './Hero.module.css';

export default function Hero() {
  const heroRef = useRef(null);
  const headingRef = useRef(null);
  const subRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const loadGSAP = async () => {
      const gsap = (await import('gsap')).default;
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(headingRef.current, { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 1 })
        .fromTo(subRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.5')
        .fromTo(ctaRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.4');
    };
    loadGSAP();
  }, []);

  return (
    <section className={styles.hero} id="hero" ref={heroRef}>
      <div className={styles.overlay}></div>

      <div className={styles.flankLeft}>
        <img src="/images/hero_left.png" alt="Athlete working out" className={styles.flankImg} />
        <div className={styles.flankGlow}></div>
      </div>
      
      <div className={styles.flankRight}>
        <img src="/images/hero_right.png" alt="Heavy weights" className={styles.flankImg} />
        <div className={styles.flankGlow}></div>
      </div>

      <div className={`container ${styles.content}`}>
        <div className={styles.badge}>PREMIUM FITNESS STUDIO</div>
        <h1 className={styles.heading} ref={headingRef}>
          <span className={styles.line1}>YOUR</span>
          <span className={styles.line2}>TRANSFORMATION</span>
          <span className={styles.line3}>
            STARTS <span className="text-glow">HERE</span>
          </span>
        </h1>
        <p className={styles.subtitle} ref={subRef}>
          With premium gyms in Kasba, Ballygunge, Triborno, and Nandibagan, we bring you <span className="text-glow" style={{fontWeight: 600, color: '#fff'}}>one of the best fitness experiences in South Kolkata.</span>
        </p>
        <div className={styles.ctas} ref={ctaRef}>
          <a
            href={getWhatsAppEnquiryLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary hover-pop"
            id="hero-book-now"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.96 7.96 0 01-4.11-1.14l-.29-.174-3.01.79.81-2.95-.19-.3A7.96 7.96 0 014 12c0-4.42 3.58-8 8-8s8 3.58 8 8-3.58 8-8 8z"/>
            </svg>
            Book Now
          </a>
        </div>
      </div>

      <div className={styles.scrollIndicator}>
        <span>SCROLL DOWN</span>
        <ChevronDown size={32} className={styles.scrollArrow} />
      </div>
    </section>
  );
}
