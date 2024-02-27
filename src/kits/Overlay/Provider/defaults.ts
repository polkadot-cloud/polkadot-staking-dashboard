/* @license Copyright 2024 @polkadot-cloud/library authors & contributors",
"SPDX-License-Identifier: GPL-3.0-only */
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function, no-unused-vars */

import { unimplemented } from '@w3ux/utils';
import type {
  CanvasConfig,
  ModalConfig,
  OverlayContextInterface,
} from './types';

export const defaultModalConfig: ModalConfig = {
  key: '',
  size: 'lg',
  options: {},
};

export const defaultCanvasConfig: CanvasConfig = {
  key: '',
  options: {},
  scroll: true,
};

export const defaultOverlayContext: OverlayContextInterface = {
  openOverlayInstances: 0,
  activeOverlayInstance: null,
  setOpenOverlayInstances: (direction, instanceType) => unimplemented,
  setActiveOverlayInstance: (instance) => unimplemented,
  canvas: {
    status: 'closed',
    config: defaultCanvasConfig,
    openCanvas: (config) => unimplemented,
    closeCanvas: () => unimplemented,
    setCanvasStatus: (s) => unimplemented,
  },
  modal: {
    status: 'closed',
    config: defaultModalConfig,
    modalHeight: 0,
    modalMaxHeight: 0,
    modalResizeCounter: 0,
    openModal: (config) => unimplemented,
    replaceModal: (config) => unimplemented,
    setModalHeight: (height) => unimplemented,
    setModalResize: () => unimplemented,
    setModalStatus: (status) => unimplemented,
    setModalRef: (modalRef) => unimplemented,
    setModalHeightRef: (heightRef) => unimplemented,
  },
};
