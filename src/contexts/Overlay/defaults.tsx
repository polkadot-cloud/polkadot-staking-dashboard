// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

import type {
  CanvasConfig,
  ModalConfig,
  OverlayContextInterface,
} from './types';

export const defaultModalConfig: ModalConfig = {
  key: '',
  options: {},
  size: 'large',
};

export const defaultCanvasConfig: CanvasConfig = {
  key: '',
  options: {},
};

export const defaultOverlayContext: OverlayContextInterface = {
  openOverlayInstances: 0,
  setOpenOverlayInstances: (direction, instanceType) => {},
  activeOverlayInstance: null,
  setActiveOverlayInstance: (instance) => {},
  canvas: {
    status: 'closed',
    config: defaultCanvasConfig,
    openCanvas: (config) => {},
    closeCanvas: () => {},
    setCanvasStatus: (s) => {},
  },
  modal: {
    status: 'closed',
    config: defaultModalConfig,
    modalHeight: 0,
    modalResizeCounter: 0,
    modalMaxHeight: 0,
    setModalResize: () => {},
    setModalHeight: () => {},
    setModalRef: (ref) => {},
    setModalHeightRef: (height) => {},
    setModalStatus: (status) => {},
    replaceModal: (config) => {},
    openModal: (config) => {},
  },
};
