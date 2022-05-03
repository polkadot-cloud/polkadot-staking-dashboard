// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Providers } from './Providers';
import { DEFAULT_NETWORK } from './constants';
import { ThemesProvider } from './contexts/Themes';

const App = () => {

  let network = localStorage.getItem('network');

  if (network === null) {
    network = DEFAULT_NETWORK;
    localStorage.setItem('network', network);
  }

  return (
    <ThemesProvider>
      <Providers />
    </ThemesProvider>
  );
}

export default App;
