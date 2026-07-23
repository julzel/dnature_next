import { FlaskConical, Heart, Leaf, Beef } from "lucide-react";

import styles from "./HeroBenefits.module.scss";

const benefits = [
  {
    icon: Beef,
    title: "Ingredientes",
    description: "100% naturales",
  },
  {
    icon: Leaf,
    title: "Ni preservantes",
    description: "ni colorantes",
  },
  {
    icon: FlaskConical,
    title: "Balanceadas",
    description: "personalizadas",
  },
  {
    icon: Heart,
    title: "Hecho con amor",
    description: "para tu mascota",
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
