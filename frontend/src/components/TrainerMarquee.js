'use client';
import { useEffect, useState } from 'react';
import { api, getUploadUrl } from '@/utils/api';
import styles from './TrainerMarquee.module.css';

export default function TrainerMarquee() {
  const [trainers, setTrainers] = useState([]);

  useEffect(() => {
    api.getTrainers().then((data) => {
      const marqueeTrainers = data.filter((t) => t.is_in_marquee);
      setTrainers(marqueeTrainers);
    }).catch(console.error);
  }, []);

  // Always maintain at least 5 slots in the base list
  const minSlots = 5;
  const placeholdersNeeded = Math.max(0, minSlots - trainers.length);
  const placeholders = [...Array(placeholdersNeeded)].map((_, i) => ({
    id: `placeholder-${i}`,
    name: 'TRAINER',
    photo_url: null
  }));

  const baseList = [...trainers, ...placeholders];
  
  // Duplicate for seamless loop (2 sets for 50% scroll)
  const marqueeList = [...baseList, ...baseList];

  return (
    <section className={`section ${styles.section}`} id="trainers">
      <div className="section-title">
        <h2>Our <span className="text-glow">Expert Trainers</span></h2>
        <div className="accent-line"></div>
      </div>

      <div className={styles.marqueeContainer}>
        <div className={styles.marqueeContent}>
          {marqueeList.map((trainer, i) => (
            <div key={`${trainer.id}-${i}`} className={styles.trainerSlice}>
              {trainer.photo_url ? (
                <img
                  src={getUploadUrl(trainer.photo_url)}
                  alt={trainer.name}
                  className={styles.trainerImage}
                />
              ) : (
                <div className={styles.imagePlaceholder}>
                  <span>{trainer.name.charAt(0)}</span>
                </div>
              )}
              <div className={styles.sliceOverlay}></div>
              <span className={styles.trainerName}>{trainer.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
