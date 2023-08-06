// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ModalContextInterface } from './types';

export const defaultModalContext: ModalContextInterface = {
  status: 0,
  // eslint-disable-next-line
  setStatus: (status) => {},
  // eslint-disable-next-line
  openModalWith: (m, c, s) => {},
  // eslint-disable-next-line
  replaceModalWith: (m, c, s) => {},
  // eslint-disable-next-line
  setModalHeight: (v) => {},
  setResize: () => {},
  modalMaxHeight: () => 0,
  // eslint-disable-next-line
  setModalRef: (v) => {},
  // eslint-disable-next-line
  setHeightRef: (v) => {},
  modal: '',
  config: {},
  size: 'large',
  height: 0,
  resize: 0,
};
