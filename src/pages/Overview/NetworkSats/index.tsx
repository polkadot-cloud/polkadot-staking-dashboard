// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { CardWrapper, CardHeaderWrapper } from 'library/Graphs/Wrappers';
import { OpenAssistantIcon } from 'library/OpenAssistantIcon';
import { Wrapper } from './Wrappers';
import { Returns } from './Returns';
import { Announcements } from './Announcements';

export const NetworkStats = () => {
  return (
    <CardWrapper>
      <CardHeaderWrapper>
        <h3>
          Network Stats
          <OpenAssistantIcon page="overview" title="Network Stats" />
        </h3>
      </CardHeaderWrapper>
      <Wrapper>
        <Returns />
        <Announcements />
      </Wrapper>
    </CardWrapper>
  );
};
