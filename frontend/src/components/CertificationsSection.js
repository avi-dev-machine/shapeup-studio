'use client';
import styles from './CertificationsSection.module.css';

const certifications = [
  { id: '1', fileName: 'IMG_20260504_115019.png' },
  { id: '2', fileName: 'IMG_20260504_115029.png' },
  { id: '3', fileName: 'IMG_20260504_115057.png' },
  { id: '4', fileName: 'IMG_20260504_115111.png' },
  { id: '5', fileName: 'IMG_20260504_115122.png' },
  { id: '6', fileName: 'IMG_20260504_115145.png' },
  { id: '7', fileName: 'IMG_20260504_115157.png' },
  { id: '8', fileName: 'IMG_20260504_115209.png' },
];

export default function CertificationsSection() {
  // Duplicate the list for seamless marquee effect
  const marqueeList = [...certifications, ...certifications, ...certifications];

  return (
    <section className={styles.section} id="certifications">
      <div className="section-title">
        <h2>OUR <span className="text-glow">CERTIFICATIONS</span></h2>
        <div className="accent-line"></div>
      </div>

      <div className={styles.marqueeContainer}>
        <div className={styles.marqueeContent}>
          {marqueeList.map((cert, index) => (
            <div key={`${cert.id}-${index}`} className={styles.certCard}>
              <img
                src={`/certs/${cert.fileName}`}
                alt="Certification"
                className={styles.certImage}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
