// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/types';
import type BigNumber from 'bignumber.js';
import type { MaybeAddress } from 'types';

export interface TxMetaContextInterface {
  sender: MaybeAddress;
  setSender: (s: MaybeAddress) => void;
  txFees: BigNumber;
  txFeesValid: boolean;
  setTxFees: (f: BigNumber) => void;
  resetTxFees: () => void;
  notEnoughFunds: boolean;
  getPayloadUid: () => number;
  getTxPayload: () => AnyJson;
  setTxPayload: (s: AnyJson, u: number) => void;
  incrementPayloadUid: () => number;
  resetTxPayload: () => void;
  getTxSignature: () => AnyJson;
  setTxSignature: (s: AnyJson) => void;
  pendingNonces: string[];
  addPendingNonce: (nonce: string) => void;
  removePendingNonce: (nonce: string) => void;
  controllerSignerAvailable: (
    a: MaybeAddress,
    b: boolean
  ) => 'controller_not_imported' | 'read_only' | 'ok';
}
