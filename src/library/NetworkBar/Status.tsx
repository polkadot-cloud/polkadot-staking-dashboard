// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export const Status = () => {
  const { apiStatus } = useApi();
  const { t } = useTranslation('library');

  return (
    <>
      {apiStatus === 'disconnected' && (
        <motion.p animate={{ opacity: [0, 1] }} transition={{ duration: 0.3 }}>
          {t('disconnected')}
        </motion.p>
      )}
      {apiStatus === 'connecting' && (
        <motion.p animate={{ opacity: [0, 1] }} transition={{ duration: 0.3 }}>
          {t('connecting')}...
        </motion.p>
      )}
      {apiStatus === 'connected' && (
        <motion.p animate={{ opacity: [0, 1] }} transition={{ duration: 0.3 }}>
          {t('connectedToNetwork')}
        </motion.p>
      )}
    </>
  );
};
