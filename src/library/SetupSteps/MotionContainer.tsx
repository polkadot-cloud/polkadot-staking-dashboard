// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { motion } from 'framer-motion';

export const MotionContainer = ({
  thisSection,
  activeSection,
  children,
}: any) => {
  // container variants
  const containerVariants = {
    hidden: {
      height: '0px',
    },
    visible: {
      height: 'auto',
    },
  };

  // animate container default
  const animate = thisSection === activeSection ? 'visible' : 'hidden';

  return (
    <motion.div
      initial={false}
      style={{ overflow: 'hidden', width: '100%' }}
      variants={containerVariants}
      animate={animate}
      transition={{
        duration: 0.5,
        type: 'spring',
        bounce: 0.2,
      }}
    >
      {children}
    </motion.div>
  );
};

export default MotionContainer;
