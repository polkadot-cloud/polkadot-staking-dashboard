// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useProviders } from 'useProviders';
import { ThemedRouter } from 'Themes';
import { useApi } from 'contexts/Api';

export const Providers = () => {
  const {
    network: { name },
  } = useApi();

  const ProvidersJSX = useProviders({
    WrappedComponent: ThemedRouter,
    name,
  });

  return <ProvidersJSX />;
};
