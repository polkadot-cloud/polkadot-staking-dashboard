// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

export const defaultAccountContext = {
  // eslint-disable-next-line
  fetchAccountMetaBatch: (k: string, v: string[], r?: boolean) => {},
  // eslint-disable-next-line
  removeAccountMetaBatch: (k: string) => {},
  meta: {},
};
