'use client';

import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Check,
  LockKeyhole,
  Mail,
  PawPrint,
  ShieldCheck,
  ShoppingBasket,
  UserRound,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import Button from '../../components/Button';
import { createClient } from '../../services/supabase/client';
import styles from './Account.module.scss';

const benefits = [
  'Perfiles y datos esenciales de tus mascotas',
  'Carritos frecuentes listos para volver a usar',
  'Tu información organizada en un espacio seguro',
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
    description: 'Guardá selecciones frecuentes y retomá tu carrito fácilmente.',
  },
  {
    icon: UserRound,
    title: 'Todo en un mismo lugar',
    description: 'Mantené tus datos y direcciones listos cuando los necesités.',
  },
];

const SignIn = ({
  configured,
  initialError = '',
  initialMode,
  nextPath = '/cuenta',
  registrationMode = 'invitation',
}) => {
  const router = useRouter();
  const publicRegistration = registrationMode === 'public';
  const [mode, setMode] = useState(
    publicRegistration && initialMode === 'signin'
      ? 'signin'
      : publicRegistration
        ? 'signup'
        : 'signin'
  );
  const [step, setStep] = useState('email');
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [error, setError] = useState(
    initialError === 'oauth'
      ? 'No pudimos completar el acceso con Google. Intentá nuevamente.'
      : ''
  );
  const [message, setMessage] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(0);

  useEffect(() => {
    if (!resendSeconds) return undefined;
    const timer = window.setInterval(() => {
      setResendSeconds((seconds) => Math.max(0, seconds - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [resendSeconds]);

  const validateEmailStep = () => {
    if (mode === 'signup' && !firstName.trim()) {
      return 'Ingresá tu nombre.';
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return 'Ingresá un correo electrónico válido.';
    }
    if (mode === 'signup' && !ageConfirmed) {
      return 'Confirmá que tenés al menos 18 años.';
    }
    return '';
  };

  const handleEmailRequest = async (event) => {
    event?.preventDefault();
    setError('');
    setMessage('');
    const validationError = validateEmailStep();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsPending(true);
    try {
      const supabase = createClient();
      const { error: requestError } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          shouldCreateUser: mode === 'signup',
          ...(mode === 'signup'
            ? {
                data: {
                  age_confirmed: true,
                  first_name: firstName.trim(),
                },
              }
            : {}),
        },
      });

      if (requestError) {
        setError(
          'No pudimos enviar el código. Revisá los datos o intentá nuevamente en unos minutos.'
        );
        return;
      }

      setStep('code');
      setResendSeconds(60);
      setMessage(`Enviamos un código de 6 dígitos a ${email.trim()}.`);
    } catch {
      setError(
        'No pudimos conectarnos para enviar el código. Revisá tu conexión e intentá nuevamente.'
      );
    } finally {
      setIsPending(false);
    }
  };

  const handleCode = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!/^\d{6}$/.test(code)) {
      setError('Ingresá el código de 6 dígitos que recibiste.');
      return;
    }

    setIsPending(true);
    try {
      const supabase = createClient();
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: code,
        type: 'email',
      });

      if (verifyError) {
        setError('El código no es válido o ya venció. Solicitá uno nuevo.');
        return;
      }

      router.replace(nextPath);
      router.refresh();
    } catch {
      setError(
        'No pudimos verificar el código. Revisá tu conexión e intentá nuevamente.'
      );
    } finally {
      setIsPending(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setMessage('');
    if (mode === 'signup' && !ageConfirmed) {
      setError('Confirmá que tenés al menos 18 años.');
      return;
    }

    setIsPending(true);
    const callback = new URL('/auth/callback', window.location.origin);
    callback.searchParams.set('siguiente', nextPath);
    if (mode === 'signup') callback.searchParams.set('edad', 'confirmada');

    try {
      const supabase = createClient();
      const { error: providerError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: callback.toString() },
      });

      if (!providerError) return;

      setIsPending(false);
      setError('No pudimos iniciar el acceso con Google. Intentá nuevamente.');
    } catch {
      setIsPending(false);
      setError(
        'No pudimos conectarnos con Google. Revisá tu conexión e intentá nuevamente.'
      );
    }
  };

  const changeMode = (nextMode) => {
    setMode(nextMode);
    setStep('email');
    setCode('');
    setError('');
    setMessage('');
  };

  return (
    <div className={styles.signInPage}>
      <div className={styles.signInContainer}>
        <div className={styles.signInGrid}>
          <section className={styles.signInHero}>
            <p className={styles.eyebrow}>Mi DNAture</p>
            <h1>Todo lo que necesitás para cuidarles mejor.</h1>
            <p>
              Un espacio sencillo para reunir los perfiles de tus mascotas y
              hacer que cada compra sea más fácil.
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
            {!configured ? (
              <div className={styles.configurationState} role='status'>
                <span className={styles.smallIcon} aria-hidden='true'>
                  <ShieldCheck size={22} />
                </span>
                <h2 id='access-title'>Mi DNAture estará disponible pronto</h2>
                <p>
                  Estamos preparando el acceso seguro para clientes. El resto
                  del sitio continúa disponible normalmente.
                </p>
                <Button href='/' fullWidth>
                  Volver al inicio
                </Button>
              </div>
            ) : (
              <>
                {publicRegistration ? (
                  <div className={styles.authModeTabs} aria-label='Tipo de acceso'>
                    <button
                      type='button'
                      aria-pressed={mode === 'signup'}
                      onClick={() => changeMode('signup')}
                    >
                      Crear cuenta
                    </button>
                    <button
                      type='button'
                      aria-pressed={mode === 'signin'}
                      onClick={() => changeMode('signin')}
                    >
                      Iniciar sesión
                    </button>
                  </div>
                ) : (
                  <p className={styles.pilotBadge}>Piloto por invitación</p>
                )}

                <h2 id='access-title'>
                  {mode === 'signup' ? 'Creá tu cuenta' : 'Ingresá a Mi DNAture'}
                </h2>
                <p>
                  {mode === 'signup'
                    ? 'Empezá con tu correo o continuá con Google.'
                    : publicRegistration
                      ? 'Ingresá con el mismo método que usaste al registrarte.'
                      : 'Durante el piloto, el acceso está disponible para personal y personas invitadas.'}
                </p>

                {mode === 'signup' ? (
                  <label className={styles.ageConfirmation}>
                    <input
                      type='checkbox'
                      checked={ageConfirmed}
                      onChange={(event) => setAgeConfirmed(event.target.checked)}
                    />
                    <span>Confirmo que tengo al menos 18 años.</span>
                  </label>
                ) : null}

                <div className={styles.providerStack}>
                  <button
                    type='button'
                    className={styles.providerButton}
                    onClick={handleGoogle}
                    disabled={isPending}
                  >
                    <FontAwesomeIcon aria-hidden='true' icon={faGoogle} />
                    Continuar con Google
                  </button>
                </div>

                <div className={styles.divider}>o con tu correo</div>

                {step === 'email' ? (
                  <form onSubmit={handleEmailRequest} noValidate>
                    {mode === 'signup' ? (
                      <div className={styles.field}>
                        <label htmlFor='account-first-name'>Nombre</label>
                        <input
                          id='account-first-name'
                          name='given-name'
                          autoComplete='given-name'
                          maxLength={80}
                          value={firstName}
                          onChange={(event) => setFirstName(event.target.value)}
                        />
                      </div>
                    ) : null}
                    <div className={styles.field}>
                      <label htmlFor='account-email'>Correo electrónico</label>
                      <input
                        id='account-email'
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
                      disabled={isPending}
                      iconStart={<Mail aria-hidden='true' size={18} />}
                      className={styles.buttonRow}
                    >
                      {isPending ? 'Enviando…' : 'Enviarme un código'}
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleCode} noValidate>
                    <div className={styles.field}>
                      <label htmlFor='account-code'>Código de acceso</label>
                      <input
                        id='account-code'
                        name='code'
                        inputMode='numeric'
                        autoComplete='one-time-code'
                        maxLength={6}
                        value={code}
                        onChange={(event) =>
                          setCode(event.target.value.replace(/\D/g, ''))
                        }
                        aria-describedby='account-code-help'
                      />
                    </div>
                    <p id='account-code-help' className={styles.demoCode}>
                      {message || `Revisá el correo enviado a ${email}.`}
                    </p>
                    {error ? (
                      <p className={styles.formError} role='alert'>
                        {error}
                      </p>
                    ) : null}
                    <Button
                      type='submit'
                      fullWidth
                      disabled={isPending}
                      iconStart={<LockKeyhole aria-hidden='true' size={18} />}
                    >
                      {isPending ? 'Verificando…' : 'Verificar y entrar'}
                    </Button>
                    <Button
                      fullWidth
                      variant='tertiary'
                      disabled={isPending || resendSeconds > 0}
                      onClick={() => handleEmailRequest()}
                    >
                      {resendSeconds > 0
                        ? `Reenviar en ${resendSeconds} s`
                        : 'Reenviar código'}
                    </Button>
                    <Button
                      fullWidth
                      variant='tertiary'
                      disabled={isPending}
                      onClick={() => {
                        setStep('email');
                        setCode('');
                        setError('');
                        setMessage('');
                        setResendSeconds(0);
                      }}
                    >
                      Cambiar correo
                    </Button>
                  </form>
                )}

                {message && step === 'email' ? (
                  <p className={styles.formMessage} role='status'>
                    {message}
                  </p>
                ) : null}
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

export default SignIn;
