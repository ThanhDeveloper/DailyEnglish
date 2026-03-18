import { Outlet, Link, useLocation } from 'react-router-dom';
import { HomeIcon, SearchIcon, BookIcon, HeadphonesIcon, HeartFilledIcon, PencilIcon } from '../components/Icons';
import { useAccent } from '../hooks/useAccent';
import styles from './layout.module.css';

const navItems = [
  { to: '/', icon: HomeIcon, label: 'Home' },
  { to: '/search', icon: SearchIcon, label: 'Search' },
  { to: '/flashcards', icon: BookIcon, label: 'Cards' },
  { to: '/podcasts', icon: HeadphonesIcon, label: 'Podcasts' },
  { to: '/saved', icon: HeartFilledIcon, label: 'Saved' },
  { to: '/grammar', icon: PencilIcon, label: 'Grammar' },
];

export function Layout() {
  const { pathname } = useLocation();
  const { accent, toggleAccent } = useAccent();

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={`container ${styles.headerInner}`}>
          <Link to="/" className={styles.logo}>
            <span className={styles.logoIcon}>E</span>
            DailyEnglish
          </Link>
          <div className={styles.headerRight}>
          <button
            className={styles.accentToggle}
            onClick={toggleAccent}
            title={`Switch to ${accent === 'us' ? 'UK' : 'US'} English`}
            aria-label={`Current accent: ${accent === 'us' ? 'US' : 'UK'} English. Click to switch.`}
          >
            <span className={styles.accentLabel}>{accent === 'us' ? 'US' : 'UK'}</span>
          </button>
          <nav className={styles.desktopNav}>
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`${styles.navLink} ${(item.to === '/' ? pathname === '/' : pathname.startsWith(item.to)) ? styles.activeLink : ''}`}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            ))}
          </nav>
          </div>
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
            className={`${styles.mobileLink} ${(item.to === '/' ? pathname === '/' : pathname.startsWith(item.to)) ? styles.activeMobile : ''}`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
