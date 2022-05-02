// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { motion } from "framer-motion";
import { useApi } from '../../contexts/Api';
import { CONNECTION_STATUS } from '../../constants';

export const ConnectionStatus = () => {

  const { status }: any = useApi();

  return (
    <>
      {status === CONNECTION_STATUS[0] &&
        <motion.p
          animate={{ opacity: [0, 1] }}
          transition={{ duration: 0.3 }}
        >
          Disconnected
        </motion.p>
      }
      {status === CONNECTION_STATUS[1] &&
        <motion.p
          animate={{ opacity: [0, 1] }}
          transition={{ duration: 0.3 }}
        >
          Connecting...
        </motion.p>
      }
      {status === CONNECTION_STATUS[2] &&
        <motion.p
          animate={{ opacity: [0, 1] }}
          transition={{ duration: 0.3 }}
        >
          Connected to Network
        </motion.p>
      }
    </>
  )
}

export default ConnectionStatus;