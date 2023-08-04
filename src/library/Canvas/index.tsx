// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useAnimation } from 'framer-motion';
import { ModalCanvas, ModalContent, ModalScroll } from '@polkadotcloud/core-ui';
import { Suspense, lazy, useMemo } from 'react';
import { useCanvas } from 'contexts/Canvas';
import { useEffectIgnoreInitial } from 'library/Hooks/useEffectIgnoreInitial';
import { useDotLottieButton } from 'library/Hooks/useDotLottieButton';
import { CanvasWrapper } from './Wrappers';

export const Canvas = () => {
  const controls = useAnimation();
  const { status, setStatus } = useCanvas();
  const { icon: preloadIcon } = useDotLottieButton('refresh', {
    autoLoop: true,
  });

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

  // NOTE: loading Forms `index`. In future get form based on canvas context state.
  const form = 'index';
  const Jsx = useMemo(() => lazy(() => import(`./Forms/${form}.tsx`)), []);

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
          <CanvasWrapper>
            <Suspense
              fallback={
                <>
                  <section
                    style={{
                      width: '7rem',
                      height: '7rem',
                    }}
                  >
                    {preloadIcon}
                  </section>
                  <h2 style={{ marginTop: '1rem' }}>Preparing Swap...</h2>
                </>
              }
            >
              <Jsx />
            </Suspense>
          </CanvasWrapper>
        </ModalContent>
      </ModalScroll>
    </ModalCanvas>
  );
};
