'use client';
import { useEffect, useRef, useState } from 'react';
import { STATS } from '@/utils/constants';
import styles from './StatsCounter.module.css';

export default function StatsCounter() {
  const sectionRef = useRef(null);
  const [counts, setCounts] = useState(STATS.map(() => 0));
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateCounters();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  const animateCounters = () => {
    const duration = 2000;
    const startTime = performance.now();

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setCounts(STATS.map((stat) => Math.floor(eased * stat.value)));

      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  return (
    <section className={styles.section} ref={sectionRef}>
      <div className={`container ${styles.grid}`}>
        {STATS.map((stat, i) => (
          <div key={i} className={styles.statCard}>
            <div className={styles.value}>
              <span className="text-accent text-glow">{counts[i].toLocaleString()}</span>
              <span className={styles.suffix}>{stat.suffix}</span>
            </div>
            <div className={styles.label}>{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
