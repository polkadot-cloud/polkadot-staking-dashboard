// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { motion } from 'framer-motion';

export const MotionContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: 0.01,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
};
