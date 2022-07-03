// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

export interface ModalContextInterface {
  status: number;
  setStatus: (status: number) => void;
  openModalWith: (modal: string, config?: any, size?: string) => void;
  setModalHeight: (v: any) => void;
  setResize: () => void;
  modal: string;
  config: any;
  size: string;
  height: any;
  resize: number;
}
