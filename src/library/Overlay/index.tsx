// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ModalOverlay } from '@polkadotcloud/core-ui';
import { useAnimation } from 'framer-motion';
import { useEffect } from 'react';
import { useModal } from 'contexts/Modal';
import { useHelp } from 'contexts/Help';

export const Overlay = () => {
  const controls = useAnimation();
  const { status: helpStatus } = useHelp();
  const { status: modalStatus } = useModal();

  const onFadeIn = async () => {
    await controls.start('visible');
  };
  const onFadeOut = async () => {
    await controls.start('hidden');
  };

  useEffect(() => {
    if (modalStatus === 1) onFadeIn();
    if (modalStatus === 2) onFadeOut();
  }, [modalStatus]);

  // Do not fade in/out if modal or canvas is open. (help can be opened in a modal).
  useEffect(() => {
    if (helpStatus === 1 && modalStatus !== 1) onFadeIn();
    if (helpStatus === 2 && modalStatus !== 1) onFadeOut();
  }, [helpStatus]);

  if (modalStatus === 0 && helpStatus === 0) {
    return <></>;
  }

  return (
    <ModalOverlay
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
