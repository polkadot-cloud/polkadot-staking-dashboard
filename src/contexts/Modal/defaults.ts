// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ModalContextInterface } from './types';

export const defaultModalContext: ModalContextInterface = {
  status: 'closed',
  // eslint-disable-next-line
  setStatus: (status) => {},
  // eslint-disable-next-line
  openModalWith: (m, c, s) => {},
  // eslint-disable-next-line
  replaceModalWith: (m, c, s) => {},
  // eslint-disable-next-line
  setModalHeight: (v) => {},
  // eslint-disable-next-line
  setModalRef: (v) => {},
  // eslint-disable-next-line
  setHeightRef: (v) => {},
  setResize: () => {},
  modalMaxHeight: () => 0,
  modal: '',
  config: {},
  size: 'large',
  height: 0,
  resize: 0,
};
