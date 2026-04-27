'use client';
import { useEffect, useState, useRef } from 'react';
import { api } from '@/utils/api';
import { PACKAGE_CATEGORIES } from '@/utils/constants';
import { getWhatsAppLink } from '@/utils/whatsapp';
import styles from './PricingSection.module.css';

export default function PricingSection() {
  const [packages, setPackages] = useState([]);
  const [hours, setHours] = useState([]);
  const [admission, setAdmission] = useState([]);
  const [activeTab, setActiveTab] = useState('gym');
  const sectionRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    Promise.all([
      api.getPackages(),
      api.getHours(),
      api.getAdmission(),
    ]).then(([pkgs, hrs, adm]) => {
      setPackages(pkgs);
      setHours(hrs);
      setAdmission(adm);
    }).catch(console.error);
  }, []);

  const filteredPackages = packages.filter((p) => p.category === activeTab);

  useEffect(() => {
    const loadGSAP = async () => {
      const gsap = (await import('gsap')).default;
      if (gridRef.current && gridRef.current.children.length > 0) {
        gsap.fromTo(
          gridRef.current.children,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out" }
        );
      }
    };
    loadGSAP();
  }, [activeTab, filteredPackages.length]);

  return (
    <section className={`section ${styles.section}`} id="pricing" ref={sectionRef}>
      <div className="container">
        <div className="section-title">
          <h2>Membership & <span className="text-glow">Pricing</span></h2>
          <div className="accent-line"></div>
        </div>

        {/* Admission Notice */}
        <div className={styles.notice}>
          <h3 className={styles.noticeTitle}>
            <span className="text-glow">⚡</span> ADMISSION CHARGES
            <span className={styles.nonRefund}>(Non-refundable)</span>
          </h3>
          <div className={styles.noticeGrid}>
            {admission.map((charge) => (
              <div key={charge.id} className={styles.noticeItem}>
                <span>{charge.description}</span>
                <span className="text-accent text-glow">₹{charge.amount}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Gym Hours Table */}
        <div className={styles.hoursCard}>
          <h3 className={styles.hoursTitle}>🕐 Gym Hours</h3>
          <div className={styles.hoursGrid}>
            {hours.map((slot) => (
              <div
                key={slot.id}
                className={`${styles.hourSlot} ${slot.is_highlighted ? styles.highlighted : ''}`}
              >
                <span className={styles.slotName}>{slot.slot_name}</span>
                <span className={styles.slotTime}>{slot.time_range}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Tabs */}
        <div className={styles.tabs}>
          {PACKAGE_CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              className={`${styles.tab} ${activeTab === cat.key ? styles.activeTab : ''}`}
              onClick={() => setActiveTab(cat.key)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Package Cards */}
        <div className={styles.packageGrid} ref={gridRef}>
          {filteredPackages.map((pkg) => (
            <div key={pkg.id} className={`${styles.packageCard} hover-pop`}>
              <div className={styles.packageHeader}>
                <h4 className={styles.packageTitle}>{pkg.title}</h4>
                {pkg.duration && (
                  <span className={styles.packageDuration}>{pkg.duration}</span>
                )}
              </div>
              <div className={styles.packagePrice}>
                <span className={styles.currency}>₹</span>
                <span className="text-accent text-glow">{pkg.price.toLocaleString()}</span>
              </div>
              {pkg.notes && <p className={styles.packageNotes}>{pkg.notes}</p>}
              <a
                href={getWhatsAppLink(`${pkg.title} - ₹${pkg.price}`)}
                target="_blank"
                rel="noopener noreferrer"
                className={`btn btn-primary ${styles.bookBtn}`}
              >
                Book Now
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
