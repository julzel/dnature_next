import { Beef, FlaskConical, Heart, Leaf } from "../../../../components/Icon";

const benefits = [
  {
    icon: Beef,
    title: 'Ingredientes',
    description: 'naturales',
  },
  {
    icon: Leaf,
    title: 'Sin preservantes',
    description: 'ni colorantes',
  },
  {
    icon: FlaskConical,
    title: 'Recetas',
    description: 'formuladas',
  },
  {
    icon: Heart,
    title: 'Hecho con cariño',
    description: 'en Costa Rica',
  },
];

const HeroBenefits = () => (
  <ul aria-label="Beneficios de nuestros productos">
    {benefits.map(({ icon: Icon, title, description }) => (
      <li key={title}>
        <Icon
          aria-hidden="true"
          strokeWidth={1}
        />
        <span>
          <span>{title}</span>{' '}
          <span>{description}</span>
        </span>
      </li>
    ))}
  </ul>
);

export default HeroBenefits;
