// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useAnimation } from 'framer-motion';
import type { FC } from 'react';
import { useEffect } from 'react';
import type { CanvasProps } from './Provider/types';
import { ErrorBoundary } from 'react-error-boundary';
import { CanvasContainer } from './structure/CanvasContainer';
import { CanvasScroll } from './structure/CanvasScroll';
import { ModalContent } from './structure/ModalContent';
import { CanvasContent } from './structure/CanvasContent';
import { useOverlay } from './Provider';

export const Canvas = ({
  canvas,
  externalOverlayStatus,
  fallback: Fallback,
}: CanvasProps) => {
  const controls = useAnimation();
  const {
    setOpenOverlayInstances,
    activeOverlayInstance,
    setActiveOverlayInstance,
    modal: { status: modalStatus },
    canvas: {
      status,
      setCanvasStatus,
      config: { key, size, scroll },
    },
  } = useOverlay();

  const onIn = async () => {
    await controls.start('visible');
  };

  const onOut = async (closing: boolean) => {
    if (closing) {
      setOpenOverlayInstances('dec', 'canvas');
      setActiveOverlayInstance(modalStatus === 'open' ? 'modal' : null);
    }
    await controls.start('hidden');

    if (closing) {
      setCanvasStatus('closed');
    }
  };

  // Control dim help status change.
  useEffect(() => {
    if (externalOverlayStatus === 'open' && status === 'open') {
      onOut(false);
    }

    if (externalOverlayStatus === 'closing') {
      if (activeOverlayInstance === 'canvas') {
        setCanvasStatus('open');
        onIn();
      }
    }
  }, [externalOverlayStatus]);

  // Control fade in and out on opening and closing states.
  useEffect(() => {
    if (status === 'open') {
      onIn();
    }
    if (status === 'closing') {
      onOut(true);
    }
  }, [status]);

  const ActiveCanvas: FC | null = canvas?.[key] || null;

  return status === 'closed' ? null : (
    <CanvasContainer
      initial={{
        opacity: 0,
      }}
      animate={controls}
      transition={{
        duration: 0.15,
      }}
      variants={{
        hidden: {
          opacity: 0,
        },
        visible: {
          opacity: 1,
        },
      }}
    >
      <CanvasScroll size={size} scroll={scroll || false}>
        <ModalContent canvas>
          <CanvasContent>
            <ErrorBoundary FallbackComponent={Fallback}>
              {ActiveCanvas && <ActiveCanvas />}
            </ErrorBoundary>
          </CanvasContent>
        </ModalContent>
      </CanvasScroll>
    </CanvasContainer>
  );
};
