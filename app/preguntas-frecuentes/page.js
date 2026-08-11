import Faq from '../../features/Faq';
import {
  FAQ_DESCRIPTION,
  FAQ_PATH,
  FAQ_TITLE,
  createFaqStructuredData,
  serializeStructuredData,
} from '../../features/Faq/server';
import { createPageMetadata } from '../../constants/seo';

export const metadata = createPageMetadata({
  title: FAQ_TITLE,
  description: FAQ_DESCRIPTION,
  path: FAQ_PATH,
  image: '/faq/faq.jpg',
  imageAlt: 'Perro sosteniendo un hueso carnoso al aire libre',
  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
    'max-video-preview': -1,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
});

const faqStructuredData = createFaqStructuredData();

const FaqPage = () => (
  <>
    <Faq />
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: serializeStructuredData(faqStructuredData),
      }}
    />
  </>
);

export default FaqPage;
