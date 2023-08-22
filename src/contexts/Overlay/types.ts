// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { RefObject } from 'react';
import type React from 'react';
import type { AnyJson } from 'types';

export interface OverlayContextInterface {
  openOverlayInstances: number;
  setOpenOverlayInstances: (
    direction: 'inc' | 'dec',
    instanceType: 'modal' | 'canvas'
  ) => void;
  activeOverlayInstance: ActiveOverlayInstance;
  setActiveOverlayInstance: (instance: ActiveOverlayInstance) => void;
  canvas: {
    status: CanvasStatus;
    config: CanvasConfig;
    openCanvas: (config: CanvasConfig) => void;
    closeCanvas: () => void;
    setCanvasStatus: (status: CanvasStatus) => void;
  };
  modal: {
    status: ModalStatus;
    config: AnyJson;
    height: number;
    resize: number;
    maxHeight: number;
    setResize: () => void;
    setHeight: (v: number) => void;
    setRef: (v: RefObject<HTMLDivElement>) => void;
    setHeightRef: (v: RefObject<HTMLDivElement>) => void;
    setModalStatus: (status: ModalStatus) => void;
    replaceModal: (config: ModalConfig) => void;
    openModal: (config: ModalConfig) => void;
  };
}

export interface CanvasProps {
  canvas: Record<string, React.FC>;
  externalOverlayStatus: CanvasStatus;
}

export interface ModalProps {
  modals: Record<string, React.FC>;
  externalOverlayStatus: CanvasStatus;
}
export type OverlayProps = ModalProps & CanvasProps;

export type ActiveOverlayInstance = 'modal' | 'canvas' | null;

export type OverlayType = 'modal' | 'canvas' | 'prompt';

export type CanvasStatus = 'open' | 'closing' | 'closed';

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
  options?: ConfigOptions;
  size?: ModalSize;
}

// TODO: implement
export interface CanvasConfig {
  key: string;
  options?: ConfigOptions;
}

// TODO: implement
export type PromptConfig = AnyJson;
