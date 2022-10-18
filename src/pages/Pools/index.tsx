// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

// import { useUi } from 'contexts/UI';
import { useUi } from 'contexts/UI';
import { Create } from './Create';
import { Home } from './Home';

export const Stake = () => {
  const { onPoolSetup } = useUi();

  return <>{onPoolSetup ? <Create /> : <Home />}</>;
};

export default Stake;
