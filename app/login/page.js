import React from 'react';
import Page from '../../components/Page';
import Login from '../../features/Login';

export const metadata = {
  title: 'Login - DNAture',
  description: 'Login DNAture',
};

export default function LoginPage() {
  return (
    <Page>
      <Login headTitle={'Login'} />
    </Page>
  );
}
