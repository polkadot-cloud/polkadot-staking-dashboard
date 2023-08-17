// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useAnimation } from 'framer-motion';
import { ModalCanvas, ModalContent, ModalScroll } from '@polkadot-cloud/react';
import { useCanvas } from 'contexts/Canvas';
import { useEffectIgnoreInitial } from 'library/Hooks/useEffectIgnoreInitial';
import { CanvasWrapper } from './Wrappers';

export const Canvas = () => {
  const controls = useAnimation();
  const { status, setStatus } = useCanvas();

  const onFadeIn = async () => {
    await controls.start('visible');
  };
  const onFadeOut = async () => {
    await controls.start('hidden');
    setStatus(0);
  };
  useEffectIgnoreInitial(() => {
    // canvas has been opened - fade in.
    if (status === 1) {
      onFadeIn();
    }
    // canvas closure triggered - fade out.
    if (status === 2) {
      onFadeOut();
    }
  }, [status]);

  if (status === 0) {
    return <></>;
  }

  return (
    <ModalCanvas
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
      <ModalScroll>
        <ModalContent>
          <CanvasWrapper>{/* TODO: Canvas Content */}</CanvasWrapper>
        </ModalContent>
      </ModalScroll>
    </ModalCanvas>
  );
};
