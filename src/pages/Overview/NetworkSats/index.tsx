// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { CardHeaderWrapper, CardWrapper } from 'library/Graphs/Wrappers';
import { OpenHelpIcon } from 'library/OpenHelpIcon';
import { useTranslation } from 'react-i18next';
import { Announcements } from './Announcements';
import { Header } from './Header';
import { Wrapper } from './Wrappers';

export const NetworkStats = () => {
  const { t } = useTranslation('pages');

  return (
    <CardWrapper>
      <CardHeaderWrapper>
        <h3>
          {t('overview.networkStats')}
          <OpenHelpIcon helpKey="Network Stats" />
        </h3>
      </CardHeaderWrapper>
      <Wrapper>
        <Header />
        <Announcements />
      </Wrapper>
    </CardWrapper>
  );
};
