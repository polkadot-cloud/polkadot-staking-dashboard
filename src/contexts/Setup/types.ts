// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { MaybeAccount, MaybeString } from 'types';

export type SetupType = 'pool' | 'stake';

export interface StakeSetupProgress {
  controller: MaybeAccount;
  payee: MaybeAccount;
  nominations: Array<any>;
  bond: MaybeString;
  section: number;
}

export interface PoolCreateProgress {
  metadata: string;
  bond: string;
  nominations: Array<any>;
  roles: any;
  section: number;
}

export interface SetupContextInterface {
  getSetupProgress: (t: SetupType, a: MaybeAccount) => any;
  getStakeSetupProgressPercent: (a: MaybeAccount) => number;
  getPoolSetupProgressPercent: (a: MaybeAccount) => number;
  setActiveAccountSetup: (t: SetupType, p: any) => void;
  setActiveAccountSetupSection: (t: SetupType, s: number) => void;
  setOnNominatorSetup: (v: boolean) => void;
  setOnPoolSetup: (v: boolean) => void;
  onNominatorSetup: boolean;
  onPoolSetup: boolean;
}
