// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ModalBackground } from '@polkadotcloud/core-ui';
import { useAnimation } from 'framer-motion';
import { useEffect } from 'react';
import { useModal } from 'contexts/Modal';
import { useHelp } from 'contexts/Help';

export const Background = () => {
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

  useEffect(() => {
    if (helpStatus === 1) onFadeIn();
    if (helpStatus === 2) onFadeOut();
  }, [helpStatus]);

  if (modalStatus === 0 && helpStatus === 0) {
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
