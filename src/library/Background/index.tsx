// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ModalBackground } from '@polkadotcloud/core-ui';
import { useAnimation } from 'framer-motion';
import { useEffect } from 'react';
import { useModal } from 'contexts/Modal';

export const Background = () => {
  const controls = useAnimation();
  const { status: modalStatus } = useModal();

  const onFadeIn = async () => {
    await controls.start('visible');
  };
  const onFadeOut = async () => {
    await controls.start('hidden');
  };

  useEffect(() => {
    // modal has been opened - fade in.
    if (modalStatus === 1) {
      onFadeIn();
    }
    // modal closure triggered - fade out.
    if (modalStatus === 2) {
      onFadeOut();
    }
  }, [modalStatus]);

  if (modalStatus === 0) {
    return <></>;
  }

  return (
    <ModalBackground
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
