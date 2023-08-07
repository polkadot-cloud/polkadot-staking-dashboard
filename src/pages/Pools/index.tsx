// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useSetup } from 'contexts/Setup';
import { Create } from './Create';
import { Home } from './Home';

export const Pools = () => {
  const { onPoolSetup } = useSetup();
  return <>{onPoolSetup ? <Create /> : <Home />}</>;
};
