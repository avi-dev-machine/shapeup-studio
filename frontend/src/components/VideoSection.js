'use client';
import { useEffect, useState, useRef } from 'react';
import { api } from '@/utils/api';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import styles from './VideoSection.module.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function VideoSection() {
  const [videos, setVideos] = useState([]);
  const sectionRef = useRef(null);

  useEffect(() => {
    api.getVideos()
      .then(setVideos)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (videos.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo('.video-card',
        { y: 50, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'back.out(1.5)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [videos]);

  if (videos.length === 0) return null;

  // Helper function to extract YouTube ID or return original URL if not YT
  const getEmbedUrl = (url) => {
    if (!url) return '';
    const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = url.match(ytRegex);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}?rel=0&modestbranding=1`;
    }
    return url;
  };

  const isYouTube = (url) => {
    return /(?:youtube\.com|youtu\.be)/i.test(url);
  };

  return (
    <section className={styles.section} ref={sectionRef} id="videos">
      <h2 className={styles.title}>WORKOUT <span>VIDEOS</span></h2>
      <div className={styles.videoGrid}>
        {videos.map((video) => {
          const embedUrl = getEmbedUrl(video.video_url);
          const yt = isYouTube(video.video_url);

          return (
            <div key={video.id} className={`${styles.videoCard} video-card`}>
              <div className={styles.iframeWrapper}>
                {yt ? (
                  <iframe 
                    src={embedUrl} 
                    title={video.title} 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen 
                  />
                ) : (
                  <video src={embedUrl} controls preload="metadata" />
                )}
              </div>
              <div className={styles.videoInfo}>
                <h3 className={styles.videoTitle}>{video.title}</h3>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
