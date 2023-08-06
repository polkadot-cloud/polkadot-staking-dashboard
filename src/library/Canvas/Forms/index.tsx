// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { motion } from 'framer-motion';
import { ButtonPrimaryInvert } from '@polkadotcloud/core-ui';
import { MotionContainer } from 'library/List/MotionContainer';
import { useCanvas } from 'contexts/Canvas';
import { CanvasCardWrapper } from '../Wrappers';

export const Swap = () => {
  const { closeCanvas } = useCanvas();
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
          <ButtonPrimaryInvert lg text="Cancel" onClick={() => closeCanvas()} />
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
  );
};

export default Swap;
