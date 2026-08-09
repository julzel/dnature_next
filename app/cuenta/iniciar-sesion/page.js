import { createPageMetadata } from '../../../constants/seo';
import SignInDemo from '../../../features/AccountDemo/SignInDemo';

export const metadata = createPageMetadata({
  title: 'Ingresá a Mi DNAture',
  description:
    'Demostración de la experiencia de cuentas para clientes de DNAture.',
  path: '/cuenta/iniciar-sesion',
  robots: { index: false, follow: false },
});

const SignInPage = () => <SignInDemo />;

export default SignInPage;
