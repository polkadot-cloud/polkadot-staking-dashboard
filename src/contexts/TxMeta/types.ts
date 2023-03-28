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
  getTxPayload: (u: number) => AnyJson;
  setTxPayload: (s: AnyJson, u: number) => void;
  removeTxPayload: (u: number) => void;
  getTxSignature: () => AnyJson;
  setTxSignature: (s: AnyJson) => void;
}
