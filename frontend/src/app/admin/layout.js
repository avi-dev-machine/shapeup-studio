'use client';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import styles from './admin.module.css';

const ADMIN_NAV = [
  { label: 'Dashboard', href: '/admin', icon: '📊' },
  { label: 'Trainers', href: '/admin/trainers', icon: '🏋️' },
  { label: 'Branches', href: '/admin/branches', icon: '📍' },
  { label: 'Pricing', href: '/admin/pricing', icon: '💰' },
  { label: 'Gallery', href: '/admin/gallery', icon: '📷' },
  { label: 'Reviews', href: '/admin/reviews', icon: '⭐' },
  { label: 'Owner', href: '/admin/owner', icon: '👤' },
  { label: 'Logo', href: '/admin/logo', icon: '🎨' },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    // Skip auth check on login page
    if (pathname === '/admin/login') {
      setAuthenticated(true);
      return;
    }

    const token = localStorage.getItem('shapeup_token');
    if (!token) {
      router.push('/admin/login');
    } else {
      setAuthenticated(true);
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('shapeup_token');
    router.push('/admin/login');
  };

  // Login page gets no sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (!authenticated) return null;

  return (
    <div className={styles.layout}>
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : ''}`}>
        <div className={styles.sidebarHeader}>
          <a href="/" className={styles.logo}>
            <span>SHAPE</span> <span className={styles.accent}>UP</span>
          </a>
          <span className={styles.adminBadge}>ADMIN</span>
        </div>

        <nav className={styles.nav}>
          {ADMIN_NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`${styles.navLink} ${pathname === item.href ? styles.active : ''}`}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {item.label}
            </a>
          ))}
        </nav>

        <button onClick={handleLogout} className={styles.logoutBtn}>
          🚪 Logout
        </button>
      </aside>

      <main className={styles.main}>
        <header className={styles.topbar}>
          <button
            className={styles.menuToggle}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
          <h2 className={styles.pageTitle}>
            {ADMIN_NAV.find((n) => n.href === pathname)?.label || 'Admin'}
          </h2>
        </header>
        <div className={styles.content}>
          {children}
        </div>
      </main>
    </div>
  );
}
