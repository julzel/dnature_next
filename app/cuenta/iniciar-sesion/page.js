import { redirect } from 'next/navigation';

import { createPageMetadata } from '../../../constants/seo';
import { SignIn } from '../../../features/Account';
import {
  getAccountContext,
  safeNextPath,
} from '../../../features/Account/server';

export const metadata = createPageMetadata({
  title: 'Ingresá a Mi DNAture',
  description:
    'Creá o ingresá a tu cuenta de cliente DNAture.',
  path: '/cuenta/iniciar-sesion',
  robots: { index: false, follow: false },
});

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const SignInPage = async ({ searchParams }) => {
  const params = await searchParams;
  const nextPath = safeNextPath(params?.siguiente);
  const context = await getAccountContext();

  if (context.identity) {
    redirect(nextPath);
  }

  return (
    <SignIn
      configured={context.configured}
      initialError={params?.error || ''}
      nextPath={nextPath}
      registrationMode={
        process.env.ACCOUNT_REGISTRATION_MODE === 'public'
          ? 'public'
          : 'invitation'
      }
    />
  );
};

export default SignInPage;
