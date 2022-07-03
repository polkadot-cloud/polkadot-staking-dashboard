// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ModalContextInterface } from '.';

export const defaultModalContext: ModalContextInterface = {
  status: 0,
  // eslint-disable-next-line
  setStatus: (status) => {},
  // eslint-disable-next-line
  openModalWith: (modal: string, _config?: any, size?: string) => {},
  // eslint-disable-next-line
  setModalHeight: (v: any) => {},
  setResize: () => {},
  modal: 'ConnectAccounts',
  config: {},
  size: 'large',
  height: 0,
  resize: 0,
};
