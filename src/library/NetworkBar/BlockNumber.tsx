// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect } from 'react';
import { motion } from "framer-motion";
import { useNetworkMetrics } from '../../contexts/Network';

export const BlockNumber = () => {

  const { metrics } = useNetworkMetrics();

  useEffect(() => {
  }, [metrics.blockNumber]);

  return (
    <motion.div
      animate={{ opacity: [0.5, 1] }}
      transition={{ duration: 0.5 }}
    >
      {metrics.blockNumber}
    </motion.div>
  );
}

export default BlockNumber;