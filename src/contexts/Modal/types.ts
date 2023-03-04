// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AnyJson } from 'types';

export type ModalSize = 'small' | 'large' | 'xl';
export interface ModalContextInterface {
  setStatus: (status: number) => void;
  openModalWith: (modal: string, options?: ModalConfig, size?: string) => void;
  replaceModalWith: (
    modal: string,
    options?: ModalConfig,
    size?: string
  ) => void;
  setModalHeight: (v: number) => void;
  setResize: () => void;
  status: number;
  modal: string;
  config: AnyJson;
  size: string;
  height: number;
  resize: number;
}

export interface ModalOptions {
  modal: string;
  config: ModalConfig;
  size: string;
}

export type ModalConfig = Record<string, string | any>;
