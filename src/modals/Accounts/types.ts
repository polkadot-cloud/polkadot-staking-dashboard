// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Ledger } from 'contexts/Accounts/Ledgers/types';
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
  ledger: Ledger;
}

export interface AccountNominating {
  stash: MaybeAccount;
  stashImported: boolean;
}
