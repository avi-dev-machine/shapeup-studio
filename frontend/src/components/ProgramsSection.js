'use client';
import { useEffect, useState } from 'react';
import { api } from '@/utils/api';
import { Zap } from 'lucide-react';
import styles from './ProgramsSection.module.css';

export default function ProgramsSection() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getPrograms()
      .then(setPrograms)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || programs.length === 0) return null;

  return (
    <section id="programs" className={styles.section}>
      <div className="container">
        <h2 className="section-title">
          Special <span className="text-accent">Programs</span>
        </h2>
        
        <div className={styles.grid}>
          {programs.map((prog, index) => (
            <div key={prog.id} className={`${styles.card} hover-pop`} style={{ animationDelay: `${index * 0.1}s` }}>
              <div className={styles.indexNum}>{(index + 1).toString().padStart(2, '0')}</div>
              <div className={styles.content}>
                <div className={styles.iconWrapper}>
                  <Zap size={24} className={styles.icon} />
                </div>
                <h3 className={styles.name}>{prog.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
