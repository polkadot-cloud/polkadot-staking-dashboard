// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

// import { useUi } from 'contexts/UI';
import { PageProps } from '../types';
import { Home } from './Home';

export const Stake = (props: PageProps) => {
  const { page } = props;
  // const { onNominatorSetup } = useUi();

  return <Home page={page} />;
};

export default Stake;
