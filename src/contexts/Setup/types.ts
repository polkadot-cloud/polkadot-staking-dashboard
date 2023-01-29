// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { MaybeAccount, MaybeString } from 'types';

export type SetupType = 'pool' | 'stake';

export type PayeeConfig = 'Staked' | 'Stash' | 'Account';

export interface NominatorSetup {
  payee: PayeeSetup;
  nominations: Array<any>;
  bond: MaybeString;
  section: number;
}

export interface PayeeSetup {
  destination: PayeeConfig | null;
  account: MaybeAccount;
}

export interface PoolSetup {
  metadata: string;
  bond: string;
  nominations: Array<any>;
  roles: any;
  section: number;
}

export interface SetupContextInterface {
  getSetupProgress: (t: SetupType, a: MaybeAccount) => any;
  getNominatorSetupPercent: (a: MaybeAccount) => number;
  getPoolSetupPercent: (a: MaybeAccount) => number;
  setActiveAccountSetup: (t: SetupType, p: any) => void;
  setActiveAccountSetupSection: (t: SetupType, s: number) => void;
  setOnNominatorSetup: (v: boolean) => void;
  setOnPoolSetup: (v: boolean) => void;
  onNominatorSetup: boolean;
  onPoolSetup: boolean;
}
