// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useProviders } from 'useProviders';
import { ThemedRouter } from 'Themes';
import { useNetwork } from 'contexts/Network';

export const Providers = () => {
  const { network } = useNetwork();

  const ProvidersJSX = useProviders({
    WrappedComponent: ThemedRouter,
    name: network,
  });

  return <ProvidersJSX />;
};
