// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type BigNumber from 'bignumber.js';
import type { AnyJson, MaybeAddress } from 'types';

export interface TxMetaContextInterface {
  controllerSignerAvailable: (
    a: MaybeAddress,
    b: boolean
  ) => 'controller_not_imported' | 'read_only' | 'ok';
  txFees: BigNumber;
  notEnoughFunds: boolean;
  setTxFees: (f: BigNumber) => void;
  resetTxFees: () => void;
  sender: MaybeAddress;
  setSender: (s: MaybeAddress) => void;
  txFeesValid: boolean;
  incrementPayloadUid: () => number;
  getPayloadUid: () => number;
  getTxPayload: () => AnyJson;
  setTxPayload: (s: AnyJson, u: number) => void;
  resetTxPayloads: () => void;
  getTxSignature: () => AnyJson;
  setTxSignature: (s: AnyJson) => void;
  addPendingNonce: (nonce: string) => void;
  removePendingNonce: (nonce: string) => void;
  pendingNonces: string[];
}
