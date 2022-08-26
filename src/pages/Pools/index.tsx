// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

// import { useUi } from 'contexts/UI';
import { useUi } from 'contexts/UI';
import { PageProps } from '../types';
import { Home } from './Home';
import { Create } from './Create';

export const Stake = (props: PageProps) => {
  const { page } = props;
  const { onPoolSetup } = useUi();

  return <>{onPoolSetup ? <Create /> : <Home page={page} />}</>;
};

export default Stake;
