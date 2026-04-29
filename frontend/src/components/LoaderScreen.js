'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import styles from './LoaderScreen.module.css';

const LETTERS_SHAPE = ['S', 'H', 'A', 'P', 'E'];
const LETTERS_UP = ['U', 'P'];

export default function LoaderScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState('loading'); // loading | reveal | exit
  const [progressText, setProgressText] = useState('INITIALIZING');
  const containerRef = useRef(null);
  const linesRef = useRef([]);
  const counterRef = useRef(null);

  const PHASES = [
    { at: 10, text: 'LOADING ASSETS' },
    { at: 30, text: 'CALIBRATING PERFORMANCE' },
    { at: 55, text: 'BUILDING YOUR EXPERIENCE' },
    { at: 80, text: 'ALMOST THERE' },
    { at: 100, text: 'LETS GO' },
  ];

  useEffect(() => {
    // Animate scan lines with GSAP
    if (linesRef.current.length > 0) {
      gsap.fromTo(
        linesRef.current,
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1,
          opacity: 1,
          duration: 1.5,
          stagger: 0.08,
          ease: 'expo.out',
          delay: 0.2,
        }
      );
    }

    // Progress counter
    const duration = 2800; // ms
    const interval = 20;
    const steps = duration / interval;
    let current = 0;

    const timer = setInterval(() => {
      current += 100 / steps;
      const rounded = Math.min(Math.round(current), 100);
      setProgress(rounded);

      const found = [...PHASES].reverse().find((p) => rounded >= p.at);
      if (found) setProgressText(found.text);

      if (rounded >= 100) {
        clearInterval(timer);
        setTimeout(() => setPhase('reveal'), 300);
        setTimeout(() => {
          setPhase('exit');
          setTimeout(() => onComplete?.(), 900);
        }, 1200);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {phase !== 'exit' && (
        <motion.div
          ref={containerRef}
          className={styles.loader}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
        >
          {/* Grid scan lines */}
          <div className={styles.linesGrid}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                ref={(el) => (linesRef.current[i] = el)}
                className={styles.scanLine}
                style={{ top: `${(i / 11) * 100}%` }}
              />
            ))}
          </div>

          {/* Vertical lines */}
          <div className={styles.vertLines}>
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                className={styles.vertLine}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 1.2, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                style={{ left: `${(i / 5) * 100}%` }}
              />
            ))}
          </div>

          {/* Corner brackets */}
          <div className={`${styles.corner} ${styles.cornerTL}`} />
          <div className={`${styles.corner} ${styles.cornerTR}`} />
          <div className={`${styles.corner} ${styles.cornerBL}`} />
          <div className={`${styles.corner} ${styles.cornerBR}`} />

          {/* Center content */}
          <div className={styles.center}>
            {/* SHAPE text */}
            <div className={styles.logoRow}>
              {LETTERS_SHAPE.map((l, i) => (
                <motion.span
                  key={i}
                  className={styles.letterWhite}
                  initial={{ opacity: 0, y: 60, rotateX: -90 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{
                    duration: 0.7,
                    delay: 0.3 + i * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {l}
                </motion.span>
              ))}
              <span className={styles.letterSpacer} />
              {LETTERS_UP.map((l, i) => (
                <motion.span
                  key={i}
                  className={styles.letterYellow}
                  initial={{ opacity: 0, y: 60, rotateX: -90 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{
                    duration: 0.7,
                    delay: 0.7 + i * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {l}
                </motion.span>
              ))}
            </div>

            {/* Tagline */}
            <motion.p
              className={styles.tagline}
              initial={{ opacity: 0, letterSpacing: '20px' }}
              animate={{ opacity: 1, letterSpacing: '6px' }}
              transition={{ duration: 1.2, delay: 1.2, ease: 'easeOut' }}
            >
              PREMIUM FITNESS STUDIO · EST. 2001
            </motion.p>

            {/* Animated divider */}
            <motion.div
              className={styles.divider}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Progress bar */}
            <div className={styles.progressWrap}>
              <div className={styles.progressBar}>
                <motion.div
                  className={styles.progressFill}
                  style={{ width: `${progress}%` }}
                />
                <motion.div
                  className={styles.progressGlow}
                  style={{ left: `${progress}%` }}
                />
              </div>

              <div className={styles.progressMeta}>
                <motion.span
                  className={styles.progressStatus}
                  key={progressText}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3 }}
                >
                  {progressText}
                </motion.span>
                <span className={styles.progressNum} ref={counterRef}>
                  {String(progress).padStart(3, '0')}%
                </span>
              </div>
            </div>
          </div>

          {/* Reveal flash */}
          {phase === 'reveal' && (
            <motion.div
              className={styles.revealFlash}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            />
          )}

          {/* Ambient orbs */}
          <div className={styles.orb1} />
          <div className={styles.orb2} />

          {/* Animated particles */}
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className={styles.particle}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                width: `${2 + Math.random() * 3}px`,
                height: `${2 + Math.random() * 3}px`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
