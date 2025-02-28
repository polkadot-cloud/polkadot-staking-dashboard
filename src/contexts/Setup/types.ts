// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { PoolRoles } from 'contexts/Pools/ActivePools/types';
import type { ValidatorPrefs } from 'contexts/Validators/types';
import type { AnyJson, BondFor, MaybeAddress, MaybeString } from 'types';

export type PayeeOptions =
  | 'Staked'
  | 'Stash'
  | 'Controller'
  | 'Account'
  | 'None';

export type NominatorSetups = Record<string, NominatorSetup>;

export interface NominatorSetup {
  section: number;
  progress: NominatorProgress;
}

export interface NominatorProgress {
  payee: PayeeConfig;
  nominations: AnyJson[];
  bond: MaybeString;
}

export interface PayeeConfig {
  destination: PayeeOptions | null;
  account: MaybeAddress;
}

export type PoolSetups = Record<string, PoolSetup>;

export interface PoolSetup {
  section: number;
  progress: PoolProgress;
}

export interface PoolProgress {
  metadata: string;
  bond: string;
  nominations: { address: string; prefs: ValidatorPrefs }[];
  roles: PoolRoles | null;
}

export interface SetupContextInterface {
  getSetupProgress: (t: BondFor, a: MaybeAddress) => PoolSetup | NominatorSetup;
  removeSetupProgress: (t: BondFor, a: MaybeAddress) => void;
  getNominatorSetupPercent: (a: MaybeAddress) => number;
  getPoolSetupPercent: (a: MaybeAddress) => number;
  setActiveAccountSetup: (
    t: BondFor,
    p: NominatorProgress | PoolProgress
  ) => void;
  setActiveAccountSetupSection: (t: BondFor, s: number) => void;
  setOnNominatorSetup: (v: boolean) => void;
  setOnPoolSetup: (v: boolean) => void;
  onNominatorSetup: boolean;
  onPoolSetup: boolean;
  getNominatorSetup: (address: MaybeAddress) => NominatorSetup;
  getPoolSetup: (address: MaybeAddress) => PoolSetup;
}
