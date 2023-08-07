// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ModalOverlay } from '@polkadotcloud/core-ui';
import { useAnimation } from 'framer-motion';
import { useEffect } from 'react';
import { useModal } from 'contexts/Modal';
import { useHelp } from 'contexts/Help';
import { useCanvas } from 'contexts/Canvas';

export const Overlay = () => {
  const controls = useAnimation();
  const { status: helpStatus } = useHelp();
  const { status: modalStatus } = useModal();
  const { status: canvasStatus } = useCanvas();

  const onFadeIn = async () => {
    await controls.start('visible');
  };
  const onFadeOut = async () => {
    await controls.start('hidden');
  };

  useEffect(() => {
    if (modalStatus === 'open') onFadeIn();
    if (modalStatus === 'closing') onFadeOut();
  }, [modalStatus]);

  useEffect(() => {
    if (canvasStatus === 1 && modalStatus !== 'open') onFadeIn();
    if (canvasStatus === 2 && modalStatus !== 'open') onFadeOut();
  }, [canvasStatus]);

  // Managing fade is more complex with help, as it can overlay modal and canvas. Do not fade in/out
  // if modal or canvas is open. (help can be opened in a modal, canvas can be summoned in an open
  // modal).
  useEffect(() => {
    if (helpStatus === 1 && modalStatus !== 'open' && canvasStatus !== 1)
      onFadeIn();
    if (helpStatus === 2 && modalStatus !== 'open' && canvasStatus !== 1)
      onFadeOut();
  }, [helpStatus]);

  if (modalStatus === 'closed' && helpStatus === 0 && canvasStatus === 0) {
    return <></>;
  }

  return (
    <ModalOverlay
      blur={canvasStatus === 1 || helpStatus === 1 ? '14px' : '4px'}
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
    />
  );
};
