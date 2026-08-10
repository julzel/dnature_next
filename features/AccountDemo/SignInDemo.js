'use client';

import { faFacebookF, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Check,
  HeartHandshake,
  LockKeyhole,
  Mail,
  PawPrint,
  ShoppingBasket,
  Stethoscope,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import Button from '../../components/Button';
import { accountStyles as styles } from '../Account';
import { useAccountDemo } from './model/account-demo-context';
import DemoNotice from './components/DemoNotice';

const DEMO_CODE = '123456';

const benefits = [
  'Porciones y planes de compra para cada mascota',
  'Carritos frecuentes listos para volver a usar',
  'Acceso a una red de veterinarias y pet shops aliados',
];

const valueCards = [
  {
    icon: PawPrint,
    title: 'Perfiles que sí ayudan',
    description: 'Peso, etapa y actividad reunidos para orientar cada compra.',
  },
  {
    icon: ShoppingBasket,
    title: 'Compras más sencillas',
    description: 'Una referencia de cuánto alimento necesitás para 7, 14 o 30 días.',
  },
  {
    icon: Stethoscope,
    title: 'Una red de apoyo',
    description: 'Aliados, servicios y beneficios para cuidarles más fácilmente.',
  },
];

const SignInDemo = () => {
  const router = useRouter();
  const {
    isAuthenticated,
    isReady,
    loadSampleAccount,
    profile,
    signIn,
    signOut,
  } = useAccountDemo();
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const finishSignIn = (provider, providerEmail, firstName = 'Cliente') => {
    signIn({ provider, email: providerEmail, firstName });
    router.push('/cuenta');
  };

  const handleEmailRequest = (event) => {
    event.preventDefault();
    setError('');

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Ingresá un correo electrónico válido.');
      return;
    }

    setStep('code');
  };

  const handleCode = (event) => {
    event.preventDefault();
    setError('');

    if (code !== DEMO_CODE) {
      setError('El código de demostración es 123456.');
      return;
    }

    finishSignIn('email', email);
  };

  const exploreSample = () => {
    loadSampleAccount();
    router.push('/cuenta');
  };

  return (
    <div className={styles.signInPage}>
      <div className={styles.signInContainer}>
        <DemoNotice />

        <div className={styles.signInGrid}>
          <section className={styles.signInHero}>
            <p className={styles.eyebrow}>Mi DNAture</p>
            <h1>Todo lo que necesitás para cuidarles mejor.</h1>
            <p>
              Un espacio sencillo para reunir los perfiles de tus mascotas,
              calcular sus necesidades y hacer que cada compra sea más fácil.
            </p>
            <ul className={styles.heroBenefits}>
              {benefits.map((benefit) => (
                <li key={benefit}>
                  <Check aria-hidden='true' size={20} />
                  {benefit}
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.signInPanel} aria-labelledby='access-title'>
            {isReady && isAuthenticated ? (
              <>
                <span className={styles.smallIcon} aria-hidden='true'>
                  <HeartHandshake size={22} />
                </span>
                <h2 id='access-title'>¡Hola de nuevo, {profile.firstName || 'Cliente'}!</h2>
                <p>Tu sesión de demostración sigue activa en este dispositivo.</p>
                <Button href='/cuenta' fullWidth>
                  Ir a mi cuenta
                </Button>
                <Button
                  fullWidth
                  variant='tertiary'
                  onClick={signOut}
                  className={styles.buttonRow}
                >
                  Usar otra cuenta
                </Button>
              </>
            ) : (
              <>
                <h2 id='access-title'>Entrá a tu cuenta</h2>
                <p>Elegí la forma más cómoda. Este acceso es solo una simulación.</p>

                <div className={styles.providerStack}>
                  <button
                    type='button'
                    className={styles.providerButton}
                    onClick={() =>
                      finishSignIn('google', 'cliente.google@ejemplo.com')
                    }
                  >
                    <FontAwesomeIcon aria-hidden='true' icon={faGoogle} />
                    Continuar con Google
                  </button>
                  <button
                    type='button'
                    className={styles.providerButton}
                    onClick={() =>
                      finishSignIn('facebook', 'cliente.facebook@ejemplo.com')
                    }
                  >
                    <FontAwesomeIcon aria-hidden='true' icon={faFacebookF} />
                    Continuar con Facebook
                  </button>
                </div>

                <div className={styles.divider}>o con tu correo</div>

                {step === 'email' ? (
                  <form onSubmit={handleEmailRequest} noValidate>
                    <div className={styles.field}>
                      <label htmlFor='demo-email'>Correo electrónico</label>
                      <input
                        id='demo-email'
                        name='email'
                        type='email'
                        autoComplete='email'
                        placeholder='vos@ejemplo.com'
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        aria-describedby={error ? 'sign-in-error' : undefined}
                      />
                    </div>
                    {error ? (
                      <p id='sign-in-error' className={styles.formError} role='alert'>
                        {error}
                      </p>
                    ) : null}
                    <Button
                      type='submit'
                      fullWidth
                      iconStart={<Mail aria-hidden='true' size={18} />}
                      className={styles.buttonRow}
                    >
                      Enviarme un código
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleCode} noValidate>
                    <div className={styles.field}>
                      <label htmlFor='demo-code'>Código de acceso</label>
                      <input
                        id='demo-code'
                        name='code'
                        inputMode='numeric'
                        autoComplete='one-time-code'
                        maxLength={6}
                        value={code}
                        onChange={(event) => setCode(event.target.value.replace(/\D/g, ''))}
                        aria-describedby='demo-code-help'
                      />
                    </div>
                    <p id='demo-code-help' className={styles.demoCode}>
                      No enviamos ningún correo. Para probar el flujo usá el código{' '}
                      <strong>{DEMO_CODE}</strong>.
                    </p>
                    {error ? (
                      <p className={styles.formError} role='alert'>
                        {error}
                      </p>
                    ) : null}
                    <Button
                      type='submit'
                      fullWidth
                      iconStart={<LockKeyhole aria-hidden='true' size={18} />}
                    >
                      Verificar y entrar
                    </Button>
                    <Button
                      fullWidth
                      variant='tertiary'
                      onClick={() => {
                        setStep('email');
                        setCode('');
                        setError('');
                      }}
                    >
                      Cambiar correo
                    </Button>
                  </form>
                )}

                <div className={styles.sampleCta}>
                  <h3>¿Querés ver la experiencia completa?</h3>
                  <p>
                    Abrí una cuenta con mascotas y carritos de ejemplo, ideal para
                    presentar la propuesta.
                  </p>
                  <Button variant='accent' fullWidth onClick={exploreSample}>
                    Explorar cuenta con datos de ejemplo
                  </Button>
                </div>
              </>
            )}
          </section>
        </div>

        <section className={styles.benefitGrid} aria-label='Beneficios de la cuenta'>
          {valueCards.map(({ icon: Icon, title, description }) => (
            <article className={styles.benefitCard} key={title}>
              <Icon aria-hidden='true' size={25} />
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
};

export default SignInDemo;
