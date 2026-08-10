import { AccountProvider } from '../../../features/Account/state';
import { loadCurrentAccount } from '../../../features/Account/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const AuthenticatedAccountLayout = async ({ children }) => {
  const account = await loadCurrentAccount();

  return <AccountProvider account={account}>{children}</AccountProvider>;
};

export default AuthenticatedAccountLayout;

