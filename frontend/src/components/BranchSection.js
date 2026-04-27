'use client';
import { useEffect, useState, useRef } from 'react';
import { api, getUploadUrl } from '@/utils/api';
import { MapPin } from 'lucide-react';
import styles from './BranchSection.module.css';

export default function BranchSection() {
  const [branches, setBranches] = useState([]);
  const gridRef = useRef(null);

  useEffect(() => {
    api.getBranches().then(setBranches).catch(console.error);
  }, []);

  useEffect(() => {
    const loadGSAP = async () => {
      const gsap = (await import('gsap')).default;
      const ScrollTrigger = (await import('gsap/ScrollTrigger')).default;
      gsap.registerPlugin(ScrollTrigger);

      if (gridRef.current && gridRef.current.children.length > 0) {
        gsap.fromTo(
          gridRef.current.children,
          { opacity: 0, y: 30 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.8, 
            stagger: 0.15, 
            ease: "power3.out",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 80%"
            }
          }
        );
      }
    };
    loadGSAP();
  }, [branches.length]);

  return (
    <section className={`section ${styles.section}`} id="locations">
      <div className="container">
        <div className="section-title">
          <h2>Our <span className="text-glow">Locations</span></h2>
          <div className="accent-line"></div>
        </div>

        <div className={styles.grid} ref={gridRef}>
          {branches.map((branch) => (
            <a
              key={branch.id}
              href={branch.maps_url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.card} hover-pop`}
            >
              {branch.photo_url ? (
                <div className={styles.branchImageWrapper}>
                  <img src={getUploadUrl(branch.photo_url)} alt={branch.name} className={styles.branchImage} />
                </div>
              ) : (
                <div className={styles.icon}><MapPin size={48} color="var(--color-primary)" /></div>
              )}
              <h3 className={styles.branchName}>{branch.name}</h3>
              <p className={styles.address}>{branch.address}</p>
              <span className={styles.mapLink}>
                View on Google Maps →
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
