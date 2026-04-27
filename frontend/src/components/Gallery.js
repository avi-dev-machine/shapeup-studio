'use client';
import { useEffect, useState } from 'react';
import { api, getUploadUrl } from '@/utils/api';
import styles from './Gallery.module.css';

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    api.getGallery().then(setItems).catch(console.error);
  }, []);

  const openLightbox = (item) => setLightbox(item);
  const closeLightbox = () => setLightbox(null);

  return (
    <section className={`section ${styles.section}`} id="gallery">
      <div className="container">
        <div className="section-title">
          <h2>Our <span className="text-glow">Gallery</span></h2>
          <div className="accent-line"></div>
        </div>

        {items.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>📷</div>
            <p>Gallery coming soon! The admin can upload photos and videos.</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {items.map((item) => (
              <div
                key={item.id}
                className={styles.card}
                onClick={() => openLightbox(item)}
              >
                {item.media_type === 'video' ? (
                  <video
                    src={getUploadUrl(item.url)}
                    className={styles.media}
                    muted
                  />
                ) : (
                  <img
                    src={getUploadUrl(item.url)}
                    alt={item.caption || 'Gallery image'}
                    className={styles.media}
                    loading="lazy"
                  />
                )}
                <div className={styles.overlay}>
                  <span className={styles.icon}>
                    {item.media_type === 'video' ? '▶' : '🔍'}
                  </span>
                  {item.caption && <p className={styles.caption}>{item.caption}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox */}
        {lightbox && (
          <div className={styles.lightbox} onClick={closeLightbox}>
            <button className={styles.closeBtn} onClick={closeLightbox}>✕</button>
            <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
              {lightbox.media_type === 'video' ? (
                <video
                  src={getUploadUrl(lightbox.url)}
                  controls
                  autoPlay
                  className={styles.lightboxMedia}
                />
              ) : (
                <img
                  src={getUploadUrl(lightbox.url)}
                  alt={lightbox.caption || 'Full view'}
                  className={styles.lightboxMedia}
                />
              )}
              {lightbox.caption && (
                <p className={styles.lightboxCaption}>{lightbox.caption}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
