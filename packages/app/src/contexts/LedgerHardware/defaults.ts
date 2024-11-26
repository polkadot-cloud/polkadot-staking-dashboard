// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

import type { LedgerHardwareContextInterface } from './types';

export const defaultFeedback = {
  message: null,
  helpKey: null,
};

export const defaultLedgerHardwareContext: LedgerHardwareContextInterface = {
  transportResponse: null,
  integrityChecked: false,
  setIntegrityChecked: (checked) => {},
  checkRuntimeVersion: async (txMetadataChainId) =>
    new Promise((resolve) => resolve()),
  setStatusCode: (a, s) => {},
  setIsExecuting: (b) => {},
  getIsExecuting: () => false,
  getStatusCode: () => null,
  resetStatusCode: () => {},
  getFeedback: () => defaultFeedback,
  setFeedback: (s, h) => {},
  resetFeedback: () => {},
  handleUnmount: () => {},
  handleErrors: (err) => {},
  handleGetAddress: (txMetadataChainId, accountIndex, ss58Prefix) =>
    new Promise((resolve) => resolve()),
  handleSignTx: (txMetadataChainId, uid, index, payload, txMetadata) =>
    new Promise((resolve) => resolve()),
  handleResetLedgerTask: () => {},
  runtimesInconsistent: false,
};
