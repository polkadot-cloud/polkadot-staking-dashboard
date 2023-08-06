// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { RefObject } from 'react';
import type { AnyJson } from 'types';

export type ModalSize = 'small' | 'large' | 'xl';

export type ModalStatus =
  | 'closed'
  | 'opening'
  | 'open'
  | 'closing'
  | 'replacing';

export interface ModalContextInterface {
  setStatus: (status: ModalStatus) => void;
  openModalWith: (modal: string, options?: ModalConfig, size?: string) => void;
  replaceModalWith: (
    modal: string,
    options?: ModalConfig,
    size?: string
  ) => void;
  setModalHeight: (v: number) => void;
  setResize: () => void;
  modalMaxHeight: () => number;
  setModalRef: (v: RefObject<HTMLDivElement>) => void;
  setHeightRef: (v: RefObject<HTMLDivElement>) => void;
  status: ModalStatus;
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
