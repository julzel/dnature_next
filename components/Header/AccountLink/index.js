'use client';

import { UserRound } from 'lucide-react';
import Link from 'next/link';

import styles from './AccountLink.module.scss';

const AccountLink = () => (
  <Link className={styles.accountLink} href='/cuenta' aria-label='Mi cuenta'>
    <UserRound aria-hidden='true' size={24} strokeWidth={1.8} />
  </Link>
);

export default AccountLink;
