// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useAnimation } from 'framer-motion';
import { useEffect } from 'react';
import {
  ButtonPrimaryInvert,
  ModalCanvas,
  ModalContent,
  ModalScroll,
} from '@polkadotcloud/core-ui';
import { useTranslation } from 'react-i18next';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useCanvas } from 'contexts/Canvas';

export const Canvas = () => {
  const { t } = useTranslation('help');
  const controls = useAnimation();
  const { status, setStatus, closeCanvas } = useCanvas();

  const onFadeIn = async () => {
    await controls.start('visible');
  };
  const onFadeOut = async () => {
    await controls.start('hidden');
    setStatus(0);
  };
  useEffect(() => {
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
          <div className="buttons">
            <ButtonPrimaryInvert
              lg
              text={t('modal.close')}
              iconLeft={faTimes}
              onClick={() => closeCanvas()}
            />
          </div>
          {/* TODO: plug in canvas preloader and content */}
        </ModalContent>
      </ModalScroll>
      <button type="button" className="close" onClick={() => closeCanvas()}>
        &nbsp;
      </button>
    </ModalCanvas>
  );
};
