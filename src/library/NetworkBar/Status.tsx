// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export const Status = () => {
  const { status } = useApi();
  const { t } = useTranslation('library');

  return (
    <>
      {status === 'disconnected' && (
        <motion.p animate={{ opacity: [0, 1] }} transition={{ duration: 0.3 }}>
          {t('disconnected')}
        </motion.p>
      )}
      {status === 'connecting' && (
        <motion.p animate={{ opacity: [0, 1] }} transition={{ duration: 0.3 }}>
          {t('connecting')}...
        </motion.p>
      )}
      {status === 'connected' && (
        <motion.p animate={{ opacity: [0, 1] }} transition={{ duration: 0.3 }}>
          {t('connectedToNetwork')}
        </motion.p>
      )}
    </>
  );
};

export default Status;
