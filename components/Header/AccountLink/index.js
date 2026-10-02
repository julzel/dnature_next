'use client';

import { UserRound } from 'lucide-react';
import Link from 'next/link';

const AccountLink = () => (
  <Link href='/cuenta' aria-label='Mi cuenta'>
    <UserRound aria-hidden='true' size={24} strokeWidth={1.8} />
  </Link>
);

export default AccountLink;
