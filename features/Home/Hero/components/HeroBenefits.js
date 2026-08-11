import { Beef, FlaskConical, Heart, Leaf } from 'lucide-react';

import styles from "./HeroBenefits.module.scss";

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
  <ul className={styles.benefits} aria-label="Beneficios de nuestros productos">
    {benefits.map(({ icon: Icon, title, description }) => (
      <li className={styles.benefit} key={title}>
        <Icon
          aria-hidden="true"
          className={styles.icon}
          strokeWidth={1}
        />
        <span className={styles.copy}>
          <span className={styles.title}>{title}</span>
          <span className={styles.description}>{description}</span>
        </span>
      </li>
    ))}
  </ul>
);

export default HeroBenefits;
