// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useSetup } from 'contexts/Setup';
import { Create } from './Create';
import { Home } from './Home';

export const Stake = () => {
  const { onPoolSetup } = useSetup();

  return <>{onPoolSetup ? <Create /> : <Home />}</>;
};

export default Stake;
