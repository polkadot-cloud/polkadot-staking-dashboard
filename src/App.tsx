// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { DEFAULT_NETWORK } from 'consts';
import { Providers } from 'Providers';
import { ThemesProvider } from 'contexts/Themes';
import { ErrorBoundary } from 'react-error-boundary';

const App: React.FC = () => {
  let network = localStorage.getItem('network');

  if (network === null) {
    network = DEFAULT_NETWORK;
    localStorage.setItem('network', network);
  }

  if (!localStorage) throw new Error('LocalStorage Is Not Supported');

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
      resetKeys={[network]}
    >
      <ThemesProvider>
        <Providers />
      </ThemesProvider>
    </ErrorBoundary>
  );
};

const ErrorFallback = ({
  error,
  resetErrorBoundary,
}: {
  error: any;
  resetErrorBoundary: any;
}) => (
  <div>
    <p>Opps, Something Went Wrong:</p>
    <pre>{error.message}</pre>
    <button type="button" onClick={resetErrorBoundary}>
      Click to reload!
    </button>
  </div>
);

export default App;
