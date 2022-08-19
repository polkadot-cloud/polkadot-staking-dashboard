// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

export interface ModalContextInterface extends ModalContextState {
  setStatus: (status: number) => void;
  openModalWith: (modal: string, config?: ModalConfig, size?: string) => void;
  setModalHeight: (v: number) => void;
  setResize: () => void;
}

export interface ModalContextState {
  status: number;
  modal: string;
  config: ModalConfig;
  size: string;
  height: number;
  resize: number;
  CloseButton?: any;
}

export type ModalConfig = Record<string, string | any>;
