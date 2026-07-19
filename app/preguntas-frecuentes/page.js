import Faq from '../../features/Faq';
import { createPageMetadata } from '../../constants/seo';

export const metadata = createPageMetadata({
  title: 'Preguntas frecuentes',
  description:
    'Encuentra respuestas sobre la alimentación natural y los productos DNAture.',
  path: '/preguntas-frecuentes',
});

const FaqPage = () => <Faq />;

export default FaqPage;
