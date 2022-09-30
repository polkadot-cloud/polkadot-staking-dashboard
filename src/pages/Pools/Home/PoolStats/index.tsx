// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { CardWrapper, CardHeaderWrapper } from 'library/Graphs/Wrappers';
import { useTranslation } from 'react-i18next';
import { Wrapper } from './Wrappers';
import { Header } from './Header';
import { Announcements } from './Announcements';

export const PoolStats = () => {
  const { t } = useTranslation('common');
  return (
    <CardWrapper>
      <CardHeaderWrapper>
        <h3>{t('pages.Pools.pool_stats')}</h3>
      </CardHeaderWrapper>
      <Wrapper>
        <Header />
        <Announcements />
      </Wrapper>
    </CardWrapper>
  );
};
