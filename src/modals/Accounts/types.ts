// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Ledger } from 'contexts/Accounts/Ledgers/types';
import type { ExtensionAccount } from 'contexts/Extensions/types';
import type { MaybeAccount } from 'types';

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
