'use client';

import { UserRound } from 'lucide-react';
import Link from 'next/link';

import { useAccountDemo } from '../../../features/AccountDemo/model/account-demo-context';
import styles from './AccountLink.module.scss';

const AccountLink = () => {
  const { isAuthenticated, isReady, profile } = useAccountDemo();
  const href = isReady && isAuthenticated ? '/cuenta' : '/cuenta/iniciar-sesion';
  const label =
    isReady && isAuthenticated
      ? profile.firstName
        ? `Hola, ${profile.firstName}`
        : 'Mi cuenta'
      : 'Iniciar sesión';

  return (
    <Link className={styles.accountLink} href={href} aria-label={label}>
      <UserRound aria-hidden='true' size={24} strokeWidth={1.8} />
      <span>{label}</span>
    </Link>
  );
};

export default AccountLink;
