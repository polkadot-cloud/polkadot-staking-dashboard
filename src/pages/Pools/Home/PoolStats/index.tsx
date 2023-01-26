// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { CardHeaderWrapper, CardWrapper } from 'library/Graphs/Wrappers';
import { useTranslation } from 'react-i18next';
import { Announcements } from './Announcements';
import { Header } from './Header';
import { Wrapper } from './Wrappers';

export const PoolStats = () => {
  const { t } = useTranslation('pages');

  return (
    <CardWrapper>
      <CardHeaderWrapper>
        <h3>{t('pools.poolStats')}</h3>
      </CardHeaderWrapper>
      <Wrapper>
        <Header />
        <Announcements />
      </Wrapper>
    </CardWrapper>
  );
};
