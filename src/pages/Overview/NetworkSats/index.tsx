// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { CardWrapper, CardHeaderWrapper } from 'library/Graphs/Wrappers';
import { OpenHelpIcon } from 'library/OpenHelpIcon';
import { Wrapper } from './Wrappers';
import { Inflation } from './Inflation';
import { Announcements } from './Announcements';

export const NetworkStats = () => {
  return (
    <CardWrapper>
      <CardHeaderWrapper>
        <h3>
          Network Stats
          <OpenHelpIcon title="Network Stats" />
        </h3>
      </CardHeaderWrapper>
      <Wrapper>
        <Inflation />
        <Announcements />
      </Wrapper>
    </CardWrapper>
  );
};
