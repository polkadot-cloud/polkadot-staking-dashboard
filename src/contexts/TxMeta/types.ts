// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type BigNumber from 'bignumber.js';
import type { AnyJson, MaybeAccount } from 'types';

export interface TxMetaContextInterface {
  controllerSignerAvailable: (
    a: MaybeAccount,
    b: boolean
  ) => 'controller_not_imported' | 'read_only' | 'ok';
  txFees: BigNumber;
  notEnoughFunds: boolean;
  setTxFees: (f: BigNumber) => void;
  resetTxFees: () => void;
  sender: MaybeAccount;
  setSender: (s: MaybeAccount) => void;
  txFeesValid: boolean;
  incrementPayloadUid: () => number;
  getPayloadUid: () => number;
  getTxPayload: () => AnyJson;
  setTxPayload: (s: AnyJson, u: number) => void;
  resetTxPayloads: () => void;
  getTxSignature: () => AnyJson;
  setTxSignature: (s: AnyJson) => void;
}
