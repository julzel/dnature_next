'use client';

import {
  HeartHandshake,
  House,
  LogOut,
  Menu,
  PawPrint,
  ShieldCheck,
  ShoppingBasket,
  Stethoscope,
  UserRound,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

import Button from '../../../components/Button';
import { accountStyles as styles } from '../../Account';
import { useAccountDemo } from '../model/account-demo-context';
import DemoNotice from './DemoNotice';

const navigationItems = [
  { href: '/cuenta', label: 'Inicio', icon: House },
  { href: '/cuenta/mascotas', label: 'Mis mascotas', icon: PawPrint },
  { href: '/cuenta/red-veterinaria', label: 'Red Veterinaria', icon: Stethoscope },
  { href: '/cuenta/carritos', label: 'Mis carritos', icon: ShoppingBasket },
  { href: '/cuenta/perfil', label: 'Mi perfil', icon: UserRound },
];

const DemoAccountShell = ({ children, eyebrow, title, description, action }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isReady, profile, signOut } = useAccountDemo();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = () => {
    signOut();
    router.push('/cuenta/iniciar-sesion');
  };

  if (!isReady) {
    return (
      <div className={styles.accountPage}>
        <div className={styles.loadingCard} role='status'>
          <span className={styles.loadingMark} aria-hidden='true' />
          Preparando tu cuenta…
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className={styles.accountPage}>
        <div className={styles.signedOutWrap}>
          <DemoNotice />
          <section className={styles.signedOutCard}>
            <span className={styles.roundIcon} aria-hidden='true'>
              <ShieldCheck size={32} />
            </span>
            <p className={styles.eyebrow}>Espacio de demostración</p>
            <h1>Iniciá la demostración para continuar</h1>
            <div className={styles.buttonRowCentered}>
              <Button href='/cuenta/iniciar-sesion'>Ir al acceso</Button>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.accountPage}>
      <div className={styles.accountContainer}>
        <DemoNotice compact />
        <div className={styles.accountGrid}>
          <aside className={styles.sidebar}>
            <div className={styles.sidebarIdentity}>
              <span className={styles.avatar} aria-hidden='true'>
                {(profile.firstName || 'C').charAt(0).toUpperCase()}
              </span>
              <div>
                <span>Cuenta de</span>
                <strong>{profile.firstName || 'Cliente'}</strong>
              </div>
              <HeartHandshake aria-hidden='true' size={21} />
            </div>

            <button
              type='button'
              className={styles.mobileMenuButton}
              aria-expanded={isMenuOpen}
              aria-controls='demo-account-navigation'
              onClick={() => setIsMenuOpen((open) => !open)}
            >
              {isMenuOpen ? <X aria-hidden='true' /> : <Menu aria-hidden='true' />}
              {isMenuOpen ? 'Cerrar menú' : 'Menú del demo'}
            </button>

            <nav
              id='demo-account-navigation'
              className={`${styles.accountNavigation} ${
                isMenuOpen ? styles.accountNavigationOpen : ''
              }`}
              aria-label='Cuenta de demostración'
            >
              {navigationItems.map(({ href, label, icon: Icon }) => {
                const isActive =
                  href === '/cuenta' ? pathname === href : pathname.startsWith(href);

                return (
                  <Link
                    href={href}
                    key={href}
                    className={isActive ? styles.navLinkActive : styles.navLink}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon aria-hidden='true' size={20} />
                    {label}
                  </Link>
                );
              })}
              <button type='button' className={styles.signOutLink} onClick={handleSignOut}>
                <LogOut aria-hidden='true' size={20} />
                Cerrar demo
              </button>
            </nav>
          </aside>

          <div className={styles.accountContent}>
            <header className={styles.pageHeading}>
              <div>
                {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
                <h1>{title}</h1>
                {description ? <p>{description}</p> : null}
              </div>
              {action ? <div className={styles.headingAction}>{action}</div> : null}
            </header>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoAccountShell;
