import { notFound } from 'next/navigation';

import AvifyDiagnostics from '../../features/AvifyDiagnostics';

export const metadata = {
  title: 'Pruebas de Avify',
  robots: {
    index: false,
    follow: false,
  },
};

const AvifyTestPage = () => {
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }

  return <AvifyDiagnostics />;
};

export default AvifyTestPage;
