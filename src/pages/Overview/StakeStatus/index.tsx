// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { usePlugins } from 'contexts/Plugins';
import { CardWrapper } from 'library/Card/Wrappers';
import { NominationStatus } from 'pages/Nominate/Active/Status/NominationStatus';
import { MembershipStatus } from 'pages/Pools/Home/Status/MembershipStatus';
import { Tips } from './Tips';
import { StatusWrapper } from './Wrappers';
import { RowSection } from 'kits/Structure/RowSection';

export const StakeStatus = () => {
  const { plugins } = usePlugins();
  const showTips = plugins.includes('tips');

  return (
    <CardWrapper style={{ padding: 0 }}>
      <StatusWrapper borderBottom={showTips}>
        <RowSection secondary>
          <section>
            <NominationStatus showButtons={false} />
          </section>
        </RowSection>
        <RowSection hLast vLast>
          <section>
            <MembershipStatus showButtons={false} />
          </section>
        </RowSection>
      </StatusWrapper>

      {showTips ? <Tips /> : null}
    </CardWrapper>
  );
};
