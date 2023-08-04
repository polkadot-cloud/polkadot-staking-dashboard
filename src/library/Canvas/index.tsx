// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useAnimation, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  ButtonPrimaryInvert,
  ModalCanvas,
  ModalContent,
  ModalScroll,
} from '@polkadotcloud/core-ui';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useCanvas } from 'contexts/Canvas';
import { useDotLottieButton } from 'library/Hooks/useDotLottieButton';
import { useEffectIgnoreInitial } from 'library/Hooks/useEffectIgnoreInitial';
import { MotionContainer } from 'library/List/MotionContainer';
import { CanvasCardWrapper, CanvasWrapper } from './Wrappers';

export const Canvas = () => {
  const controls = useAnimation();
  const { status, setStatus, closeCanvas } = useCanvas();
  const { icon: preloadIcon } = useDotLottieButton('refresh', {
    autoLoop: true,
  });

  // Dummy state to test loaded form.
  const [loaded, setLoaded] = useState<boolean>(false);

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

  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 2000);
  }, []);

  if (status === 0) {
    return <></>;
  }

  const staggerProps = {
    variants: {
      hidden: {
        y: 15,
        opacity: 0,
      },
      show: {
        y: 0,
        opacity: 1,
      },
    },
  };

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
            {loaded ? (
              <>
                <MotionContainer staggerChildren={0.1}>
                  <motion.div {...staggerProps} className="header">
                    <div>
                      <ButtonPrimaryInvert
                        lg
                        text="Cancel"
                        iconLeft={faTimes}
                        onClick={() => closeCanvas()}
                      />
                    </div>
                    <h1>Swap</h1>
                  </motion.div>
                  <CanvasCardWrapper {...staggerProps}>
                    <h2>Choose Tokens</h2>
                  </CanvasCardWrapper>
                  <CanvasCardWrapper {...staggerProps}>
                    <h2>Swap</h2>
                  </CanvasCardWrapper>
                  <CanvasCardWrapper {...staggerProps}>
                    <h2>Bridge</h2>
                  </CanvasCardWrapper>
                </MotionContainer>
              </>
            ) : (
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
            )}
          </CanvasWrapper>
        </ModalContent>
      </ModalScroll>
      <button type="button" className="close" onClick={() => closeCanvas()}>
        &nbsp;
      </button>
    </ModalCanvas>
  );
};
