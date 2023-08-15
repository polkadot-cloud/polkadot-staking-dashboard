// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

import type { ModalContextInterface } from './types';

export const defaultModalContext: ModalContextInterface = {
  status: 'closed',
  setStatus: (status) => {},
  openModalWith: (m, c, s) => {},
  replaceModalWith: (m, c, s) => {},
  setModalHeight: (v) => {},
  setModalRef: (v) => {},
  setHeightRef: (v) => {},
  setResize: () => {},
  modalMaxHeight: () => 0,
  modal: '',
  config: {},
  size: 'large',
  height: 0,
  resize: 0,
};
