// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ModalContextInterface } from './types';

export const defaultModalContext: ModalContextInterface = {
  status: 0,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setStatus: (status) => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  openModalWith: (m, c, s) => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setModalHeight: (v) => {},
  setResize: () => {},
  modal: 'ConnectAccounts',
  config: {},
  size: 'large',
  height: 0,
  resize: 0,
};
