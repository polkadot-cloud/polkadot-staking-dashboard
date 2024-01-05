// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';

export const Status = () => {
  const { t } = useTranslation('library');
  const { apiStatus } = useApi();

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
      {['connected', 'ready'].includes(apiStatus) && (
        <motion.p animate={{ opacity: [0, 1] }} transition={{ duration: 0.3 }}>
          {t('connectedToNetwork')}
        </motion.p>
      )}
    </>
  );
};
