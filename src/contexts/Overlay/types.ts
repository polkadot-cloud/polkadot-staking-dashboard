// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { RefObject } from 'react';
import type { AnyJson } from 'types';

export interface OverlayContextInterface {
  status: OverlayStatus;
  setStatus: (status: OverlayStatus) => void;
  openOverlay: (
    ype: OverlayType,
    config: ModalConfig | CanvasConfig | PromptConfig
  ) => void;
  modal: {
    config: AnyJson;
    height: number;
    resize: number;
    maxHeight: number;
    setResize: () => void;
    setHeight: (v: number) => void;
    setRef: (v: RefObject<HTMLDivElement>) => void;
    setHeightRef: (v: RefObject<HTMLDivElement>) => void;
    replaceModal: (config: ModalConfig) => void;
    openModal: (config: ModalConfig) => void;
  };
}

export type OverlayType = 'modal' | 'canvas' | 'prompt';

export type OverlayStatus = 'open' | 'closed';

export type ModalStatus =
  | 'closed'
  | 'opening'
  | 'open'
  | 'closing'
  | 'replacing';

export type ConfigOptions = Record<string, AnyJson>;

export type ModalSize = 'small' | 'large' | 'xl';

export interface ModalConfig {
  key: string;
  config?: ConfigOptions;
  size?: ModalSize;
}

// TODO: implement
export type CanvasConfig = AnyJson;

// TODO: implement
export type PromptConfig = AnyJson;
