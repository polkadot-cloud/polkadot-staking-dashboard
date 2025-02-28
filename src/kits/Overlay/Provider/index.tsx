// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { RefObject, ReactNode } from 'react';
import { useRef, useState, createContext, useContext } from 'react';
import { setStateWithRef } from '@w3ux/utils';
import type {
  ModalConfig,
  CanvasConfig,
  ModalStatus,
  OverlayContextInterface,
  CanvasStatus,
  ActiveOverlayInstance,
  OverlayInstanceDirection,
} from './types';
import {
  defaultCanvasConfig,
  defaultModalConfig,
  defaultOverlayContext,
} from './defaults';
import { useEffectIgnoreInitial } from '@w3ux/hooks';

export const OverlayContext = createContext<OverlayContextInterface>(
  defaultOverlayContext
);

export const useOverlay = () => useContext(OverlayContext);

export const OverlayProvider = ({ children }: { children: ReactNode }) => {
  // Store the modal status.
  const [openOverlayInstances, setOpenOverlayInstancesState] =
    useState<number>(0);

  const setOpenOverlayInstances = (
    direction: OverlayInstanceDirection,
    instanceType: 'modal' | 'canvas'
  ) => {
    if (direction === 'inc') {
      setOpenOverlayInstancesState(openOverlayInstances + 1);
      setActiveOverlayInstance(instanceType);
    } else {
      setOpenOverlayInstancesState(Math.max(openOverlayInstances - 1, 0));
    }
  };

  // Store the currently active overlay instance.
  const [activeOverlayInstance, setActiveOverlayInstance] =
    useState<ActiveOverlayInstance>(null);

  // Store the modal status.
  const [modalStatus, setModalStatusState] = useState<ModalStatus>('closed');
  const modalStatusRef = useRef(modalStatus);

  // Store modal configuration.
  const [modalConfig, setModalConfigState] =
    useState<ModalConfig>(defaultModalConfig);
  const modalConfigRef = useRef(modalConfig);

  // Store the modal's current height.
  const [modalHeight, setModalHeightState] = useState<number>(0);

  // Store the modal's resize counter.
  const [modalResizeCounter, setModalResizeCounterState] = useState<number>(0);

  // Store the ref to the modal height container. Used for controlling whether height is transitionable.
  const [modalRef, setModalRef] = useState<RefObject<HTMLDivElement>>();

  // Store the ref to the modal height container. Used for controlling whether height is transitionable.
  const [modalHeightRef, setModalHeightRef] =
    useState<RefObject<HTMLDivElement>>();

  // The maximum allowed height for the modal.
  const modalMaxHeight = window.innerHeight * 0.8;

  const setModalConfig = (config: ModalConfig) => {
    setStateWithRef(config, setModalConfigState, modalConfigRef);
  };

  const setModalStatus = (newStatus: ModalStatus) => {
    setStateWithRef(newStatus, setModalStatusState, modalStatusRef);
  };

  const openModal = ({ key, size = 'lg', options = {} }: ModalConfig) => {
    if (canvasStatus !== 'closed') {
      return;
    }

    setModalConfig({ key, size, options });
    setModalStatus('opening');
    if (!options?.replacing) {
      setOpenOverlayInstances('inc', 'modal');
    }
  };

  // Closes one modal and opens another.
  const replaceModal = ({ key, size = 'lg', options = {} }: ModalConfig) => {
    setModalStatus('replacing');
    setTimeout(() => {
      openModal({
        key,
        size,
        options: {
          ...options,
          replacing: true,
        },
      });
    }, 10);
  };

  const setModalHeight = (height: number, transition = true) => {
    if (modalStatusRef.current === 'closed') {
      return;
    }

    // Ensure transition class is removed if not transitioning. Otherwise, ensure class exists.
    if (transition) {
      transitionOn();
    } else {
      transitionOff();
    }

    // Limit maximum height to 80% of window height, or 90% if window width <= 600.
    const maxHeight =
      window.innerWidth <= 600
        ? window.innerHeight * 0.9
        : window.innerHeight * 0.8;
    if (height > maxHeight) {
      height = maxHeight;
    }

    // Update height state.
    setModalHeightState(height);

    // If transitioning, remove after enough time to finish transition.
    if (transition) {
      setTimeout(() => transitionOff(), 500);
    }
  };

  // Increments modal resize to trigger a height transition.
  const setModalResize = () => {
    transitionOn();
    setModalResizeCounterState(modalResizeCounter + 1);
    setTimeout(() => transitionOff(), 500);
  };

  // Helper to set the transition height class of the modal.
  const transitionOn = () =>
    modalHeightRef?.current?.classList.add('transition-height');

  // Helper to remove the transition height class of the modal.
  const transitionOff = () =>
    modalHeightRef?.current?.classList.remove('transition-height');

  // Store canvas status
  const [canvasStatus, setCanvasStatus] = useState<CanvasStatus>('closed');

  // Store config options of the canvas.
  const [canvasConfig, setCanvasConfig] = useState<CanvasConfig>({
    key: '',
    scroll: true,
    options: {},
  });

  // Open the canvas.
  const openCanvas = ({
    key,
    size = 'lg',
    scroll = true,
    options,
  }: CanvasConfig) => {
    setCanvasStatus('open');
    setOpenOverlayInstances('inc', 'canvas');
    setCanvasConfig({
      key,
      size,
      scroll,
      options: options || {},
    });
  };

  // Close the canvas.
  const closeCanvas = () => {
    setCanvasStatus('closing');
  };

  // Update modal height and open modal once refs are initialised.
  useEffectIgnoreInitial(() => {
    const height = modalRef?.current?.clientHeight || 0;
    if (modalStatusRef.current === 'opening') {
      setModalHeight(height, false);
      if (height > 0) {
        setModalStatus('open');
      }
    }
  }, [modalStatusRef.current, modalRef?.current]);

  // When canvas fade out completes, reset config.
  useEffectIgnoreInitial(() => {
    if (canvasStatus === 'closed') {
      setCanvasConfig(defaultCanvasConfig);
    }
  }, [canvasStatus]);

  return (
    <OverlayContext.Provider
      value={{
        openOverlayInstances,
        setOpenOverlayInstances,
        activeOverlayInstance,
        setActiveOverlayInstance,
        canvas: {
          status: canvasStatus,
          config: canvasConfig,
          openCanvas,
          closeCanvas,
          setCanvasStatus,
        },
        modal: {
          status: modalStatusRef.current,
          config: modalConfigRef.current,
          modalHeight,
          modalMaxHeight,
          modalResizeCounter,
          openModal,
          replaceModal,
          setModalHeight,
          setModalResize,
          setModalStatus,
          setModalRef,
          setModalHeightRef,
        },
      }}
    >
      {children}
    </OverlayContext.Provider>
  );
};
