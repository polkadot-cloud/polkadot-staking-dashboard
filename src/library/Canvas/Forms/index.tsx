// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { motion } from 'framer-motion';
import { ButtonPrimaryInvert, ModalCanvasCard } from '@polkadot-cloud/react';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { MotionContainer } from 'library/List/MotionContainer';
import { useOverlay } from '@polkadot-cloud/react/hooks';

export const Swap = () => {
  const { closeCanvas } = useOverlay().canvas;
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
      <ModalCanvasCard {...staggerProps}>
        <h2>Choose Tokens</h2>
      </ModalCanvasCard>
      <ModalCanvasCard {...staggerProps}>
        <h2>Swap</h2>
      </ModalCanvasCard>
      <ModalCanvasCard {...staggerProps}>
        <h2>Bridge</h2>
      </ModalCanvasCard>
    </MotionContainer>
  );
};

export default Swap;
