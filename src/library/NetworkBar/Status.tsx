// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { motion } from 'framer-motion';
import { useApi } from 'contexts/Api';
import { ConnectionStatus, APIContextInterface } from 'types/api';

export const Status = () => {
  const { status } = useApi() as APIContextInterface;

  return (
    <>
      {status === ConnectionStatus.Disconnected && (
        <motion.p animate={{ opacity: [0, 1] }} transition={{ duration: 0.3 }}>
          Disconnected
        </motion.p>
      )}
      {status === ConnectionStatus.Connecting && (
        <motion.p animate={{ opacity: [0, 1] }} transition={{ duration: 0.3 }}>
          Connecting...
        </motion.p>
      )}
      {status === ConnectionStatus.Connected && (
        <motion.p animate={{ opacity: [0, 1] }} transition={{ duration: 0.3 }}>
          Connected to Network
        </motion.p>
      )}
    </>
  );
};

export default Status;
