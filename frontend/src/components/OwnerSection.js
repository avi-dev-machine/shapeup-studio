'use client';
import { useEffect, useState } from 'react';
import { api, getUploadUrl } from '@/utils/api';
import styles from './OwnerSection.module.css';

export default function OwnerSection() {
  const [owner, setOwner] = useState(null);

  useEffect(() => {
    api.getOwner().then(setOwner).catch(console.error);
  }, []);

  return (
    <section className={`section ${styles.section}`} id="about">
      <div className={`container ${styles.container}`}>
        <div className="section-title">
          <h2>Meet the <span className="text-glow">Founder</span></h2>
          <div className="accent-line"></div>
        </div>

        <div className={styles.grid}>
          <div className={styles.imageBox}>
            {owner?.photo_url ? (
              <img
                src={getUploadUrl(owner.photo_url)}
                alt={owner.name || 'Debashish Dutta'}
                className={styles.photo}
              />
            ) : (
              <div className={styles.placeholder}>
                <span className={styles.initials}>DD</span>
              </div>
            )}
            <div className={styles.imageBorder}></div>
          </div>

          <div className={styles.info}>
            <h3 className={styles.name}>{owner?.name || 'Debashish Dutta'}</h3>
            <div className={styles.role}>Founder & Head Coach</div>
            <p className={styles.description}>
              {owner?.description ||
                'The visionary behind SHAPE UP, Debashish Dutta has been transforming lives through fitness for over 25 years. His passion for health and wellness has built a community of 1500+ active members across 4 branches in Kolkata.'}
            </p>
            <div className={styles.stats}>
              <div className={styles.miniStat}>
                <span className="text-accent text-glow">25+</span>
                <span>Years</span>
              </div>
              <div className={styles.miniStat}>
                <span className="text-accent text-glow">4</span>
                <span>Branches</span>
              </div>
              <div className={styles.miniStat}>
                <span className="text-accent text-glow">1500+</span>
                <span>Members</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
