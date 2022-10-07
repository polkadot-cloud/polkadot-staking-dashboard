// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { CardWrapper, CardHeaderWrapper } from 'library/Graphs/Wrappers';
import { OpenHelpIcon } from 'library/OpenHelpIcon';
import { useTranslation } from 'react-i18next';
import { Wrapper } from './Wrappers';
import { Inflation } from './Inflation';
import { Announcements } from './Announcements';

export const NetworkStats = () => {
  const { t } = useTranslation('common');

  return (
    <CardWrapper>
      <CardHeaderWrapper>
        <h3>
          {t('pages.overview.network_stats')}
          <OpenHelpIcon helpKey="Network Stats" />
        </h3>
      </CardHeaderWrapper>
      <Wrapper>
        <Inflation />
        <Announcements />
      </Wrapper>
    </CardWrapper>
  );
};
