// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BalanceLedger } from 'contexts/Balances/types';
import { ExtensionAccount } from 'contexts/Extensions/types';
import { MaybeAccount } from 'types';

export interface AccountItemProps {
  meta: ExtensionAccount | null;
  address?: MaybeAccount;
  label?: Array<string>;
  disconnect?: boolean;
  asElement?: boolean;
}

export interface ControllerAccount {
  address: string;
  ledger: BalanceLedger;
}

export interface AccountNominating {
  stash: MaybeAccount;
  stashImported: boolean;
}
