// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ModalContextInterface } from './types';

export const defaultModalContext: ModalContextInterface = {
  status: 0,
  // eslint-disable-next-line
  setStatus: (status) => {},
  // eslint-disable-next-line
  openModalWith: (m, c, s) => {},
  // eslint-disable-next-line
  setModalHeight: (v) => {},
  setResize: () => {},
  modal: '',
  config: {},
  size: 'large',
  height: 0,
  resize: 0,
};
