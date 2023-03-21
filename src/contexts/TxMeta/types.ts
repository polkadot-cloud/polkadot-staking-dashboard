// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BigNumber from 'bignumber.js';
import type { AnyJson, MaybeAccount } from 'types';

export interface TxMetaContextInterface {
  txFees: BigNumber;
  notEnoughFunds: boolean;
  setTxFees: (f: BigNumber) => void;
  resetTxFees: () => void;
  sender: MaybeAccount;
  setSender: (s: MaybeAccount) => void;
  txFeesValid: boolean;
  signedTx: AnyJson;
  setSignedTx: (s: AnyJson) => void;
}
