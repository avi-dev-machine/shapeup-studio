'use client';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import styles from './admin.module.css';

import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Dumbbell, 
  MapPin, 
  Video, 
  ListTodo, 
  Clock, 
  LogOut, 
  Menu,
  Image as ImageIcon,
  Star,
  User,
  Palette
} from 'lucide-react';

const ADMIN_NAV = [
  { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={20} /> },
  { label: 'Trainers', href: '/admin/trainers', icon: <Users size={20} /> },
  { label: 'Pricing', href: '/admin/pricing', icon: <CreditCard size={20} /> },
  { label: 'Branches', href: '/admin/branches', icon: <MapPin size={20} /> },
  { label: 'Programs', href: '/admin/programs', icon: <ListTodo size={20} /> },
  { label: 'Gym Hours', href: '/admin/hours', icon: <Clock size={20} /> },
  { label: 'Videos', href: '/admin/videos', icon: <Video size={20} /> },
  { label: 'Gallery', href: '/admin/gallery', icon: <ImageIcon size={20} /> },
  { label: 'Reviews', href: '/admin/reviews', icon: <Star size={20} /> },
  { label: 'Owner', href: '/admin/owner', icon: <User size={20} /> },
  { label: 'Logo', href: '/admin/logo', icon: <Palette size={20} /> },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) setSidebarOpen(true);
      else setSidebarOpen(false);
    };
    
    // Initial check
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
              onClick={() => { if (isMobile) setSidebarOpen(false); }}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {item.label}
            </a>
          ))}
        </nav>

        <button onClick={handleLogout} className={styles.logoutBtn}>
          <LogOut size={20} /> Logout
        </button>
      </aside>

      {/* Backdrop overlay for mobile */}
      {isMobile && sidebarOpen && (
        <div 
          className={styles.backdrop} 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className={styles.main}>
        <header className={styles.topbar}>
          <button
            className={styles.menuToggle}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu size={24} />
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
