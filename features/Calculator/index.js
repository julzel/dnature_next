'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowDown,
  Clock3,
  Dog,
  Scale,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

import Button from '../../components/Button';
import CalculatorSteps from './CalculatorSteps';
import styles from './Calculator.module.scss';

const preparationItems = [
  {
    icon: Dog,
    title: 'Su etapa de vida',
    text: 'Si es adulto o todavía está creciendo.',
  },
  {
    icon: Sparkles,
    title: 'Su condición y actividad',
    text: 'Cómo está su cuerpo y cuánto se mueve normalmente.',
  },
  {
    icon: Scale,
    title: 'Su peso actual',
    text: 'En kilogramos; podés utilizar decimales.',
  },
];

const Calculator = () => {
  const [started, setStarted] = useState(false);
  const toolRef = useRef(null);

  useEffect(() => {
    if (!started) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    toolRef.current?.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  }, [started]);

  const start = () => setStarted(true);

  return (
    <main className={styles.calculator}>
      <section className={styles.hero} aria-labelledby="calculator-title">
        <div className={styles.heroShell}>
          <div className={styles.heroCopy}>
            <nav className={styles.breadcrumbs} aria-label="Migas de pan">
              <ol>
                <li><Link href="/">Inicio</Link></li>
                <li aria-current="page">Calculadora de porciones</li>
              </ol>
            </nav>
            <p className={styles.eyebrow}>Calculadora para perros</p>
            <h1 id="calculator-title">Una guía clara para su porción diaria</h1>
            <p className={styles.heroIntro}>
              Completá algunos datos y obtené una estimación inicial para servir
              nuestras Recetas completas DNAture.
            </p>

            <ul className={styles.quickFacts} aria-label="Características de la calculadora">
              <li><Clock3 aria-hidden="true" size={17} /> Toma cerca de 2 minutos</li>
              <li><ShieldCheck aria-hidden="true" size={17} /> No guardamos estos datos</li>
            </ul>

            <Button
              className={styles.startButton}
              variant="primary"
              size="large"
              onClick={start}
              iconEnd={<ArrowDown aria-hidden="true" size={18} />}
            >
              {started ? 'Continuar cálculo' : 'Calcular porción'}
            </Button>
            <p className={styles.dogOnly}>Actualmente disponible únicamente para perros.</p>
          </div>

          <figure className={styles.heroVisual}>
            <Image
              className={styles.heroImage}
              src="/calculator/calculadora.jpg"
              alt="Tazón DNAture con ingredientes de alimentación natural"
              fill
              priority
              sizes="(max-width: 767px) 100vw, 46vw"
            />
            <figcaption>
              <span>Recetas completas</span>
              La estimación se calcula para esta línea de productos.
            </figcaption>
          </figure>
        </div>
      </section>

      <section
        className={styles.toolSection}
        ref={toolRef}
        aria-labelledby={started ? undefined : 'calculator-preparation-title'}
      >
        {started ? (
          <CalculatorSteps />
        ) : (
          <div className={styles.preparation}>
            <div className={styles.preparationHeading}>
              <p className={styles.eyebrow}>Antes de empezar</p>
              <h2 id="calculator-preparation-title">Tené estos datos a mano</h2>
              <p>No necesitás crear una cuenta ni compartir datos de contacto.</p>
            </div>
            <ul className={styles.preparationList}>
              {preparationItems.map(({ icon: Icon, title, text }) => (
                <li key={title}>
                  <span><Icon aria-hidden="true" size={21} /></span>
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                </li>
              ))}
            </ul>
            <Button variant="primary" size="large" onClick={start}>
              Empezar cálculo
            </Button>
          </div>
        )}
      </section>

      <section className={styles.guidance} aria-labelledby="calculator-guidance-title">
        <span><ShieldCheck aria-hidden="true" size={24} /></span>
        <div>
          <h2 id="calculator-guidance-title">Una referencia, no una prescripción</h2>
          <p>
            La porción puede necesitar ajustes según cambios de peso, apetito,
            condición corporal o salud. Si tu perro tiene una condición médica,
            consultá con su médico veterinario antes de modificar su alimentación.
          </p>
        </div>
      </section>
    </main>
  );
};

export default Calculator;
