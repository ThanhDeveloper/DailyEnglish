import { Outlet, Link, useLocation } from 'react-router-dom';
import { HomeIcon, SearchIcon, BookIcon, HeadphonesIcon, MessageCircleIcon } from '../components/Icons';
import styles from './layout.module.css';

const navItems = [
  { to: '/', icon: HomeIcon, label: 'Home' },
  { to: '/search', icon: SearchIcon, label: 'Search' },
  { to: '/flashcards/core-vocab', icon: BookIcon, label: 'Cards' },
  { to: '/podcasts', icon: HeadphonesIcon, label: 'Podcasts' },
  { to: '/conversations', icon: MessageCircleIcon, label: 'Chat' },
];

export function Layout() {
  const { pathname } = useLocation();

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={`container ${styles.headerInner}`}>
          <Link to="/" className={styles.logo}>
            <span className={styles.logoIcon}>E</span>
            DailyEnglish
          </Link>
          <nav className={styles.desktopNav}>
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`${styles.navLink} ${pathname === item.to ? styles.activeLink : ''}`}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className={`container ${styles.main}`}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <div className="container">
          <p>DailyEnglish &mdash; Learn English Every Day</p>
        </div>
      </footer>

      <nav className={styles.mobileNav}>
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`${styles.mobileLink} ${pathname === item.to ? styles.activeMobile : ''}`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
