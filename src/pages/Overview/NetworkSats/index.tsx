// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ButtonHelp } from '@polkadotcloud/dashboard-ui';
import { useHelp } from 'contexts/Help';
import { CardHeaderWrapper, CardWrapper } from 'library/Graphs/Wrappers';
import { useTranslation } from 'react-i18next';
import { Announcements } from './Announcements';
import { Header } from './Header';
import { Wrapper } from './Wrappers';

export const NetworkStats = () => {
  const { t } = useTranslation('pages');
  const { openHelp } = useHelp();

  return (
    <CardWrapper>
      <CardHeaderWrapper>
        <h3>
          {t('overview.networkStats')}
          <ButtonHelp marginLeft onClick={() => openHelp('Network Stats')} />
        </h3>
      </CardHeaderWrapper>
      <Wrapper>
        <Header />
        <Announcements />
      </Wrapper>
    </CardWrapper>
  );
};
