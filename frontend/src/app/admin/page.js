'use client';
import { useEffect, useState } from 'react';
import { api } from '@/utils/api';
import styles from './dashboard.module.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    trainers: 0,
    packages: 0,
    reviews: 0,
    gallery: 0,
    branches: 0,
  });

  useEffect(() => {
    Promise.all([
      api.getTrainers(),
      api.getPackages(),
      api.getReviews(),
      api.getGallery(),
      api.getBranches(),
    ]).then(([trainers, packages, reviews, gallery, branches]) => {
      setStats({
        trainers: trainers.length,
        packages: packages.length,
        reviews: reviews.length,
        gallery: gallery.length,
        branches: branches.length,
      });
    }).catch(console.error);
  }, []);

  const cards = [
    { label: 'Trainers', value: stats.trainers, icon: '🏋️', href: '/admin/trainers' },
    { label: 'Packages', value: stats.packages, icon: '💰', href: '/admin/pricing' },
    { label: 'Reviews', value: stats.reviews, icon: '⭐', href: '/admin/reviews' },
    { label: 'Gallery Items', value: stats.gallery, icon: '📷', href: '/admin/gallery' },
    { label: 'Branches', value: stats.branches, icon: '📍', href: '/admin/branches' },
  ];

  return (
    <div>
      <h1 className={styles.welcome}>Welcome back, <span className="text-glow">Admin</span></h1>
      <p className={styles.subtitle}>Manage your SHAPE UP platform from here.</p>

      <div className={styles.grid}>
        {cards.map((card) => (
          <a key={card.label} href={card.href} className={styles.card}>
            <span className={styles.icon}>{card.icon}</span>
            <span className={`text-accent text-glow ${styles.value}`}>{card.value}</span>
            <span className={styles.label}>{card.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
