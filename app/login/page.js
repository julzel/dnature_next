import Login from '../../features/Login';

export const metadata = {
  title: 'Login',
  alternates: { canonical: '/login' },
  robots: {
    index: false,
    follow: false,
  },
};

const LoginPage = () => <Login />;

export default LoginPage;
