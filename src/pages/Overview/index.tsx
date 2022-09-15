// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import moment from 'moment';
import { StatBoxList } from 'library/StatBoxList';
import {
  TopBarWrapper,
  PageRowWrapper,
  RowPrimaryWrapper,
  RowSecondaryWrapper,
} from 'Wrappers';
import { GraphWrapper } from 'library/Graphs/Wrappers';
import { useApi } from 'contexts/Api';
import { useSubscan } from 'contexts/Subscan';
import { SubscanButton } from 'library/SubscanButton';
import { PageTitle } from 'library/PageTitle';
import { formatRewardsForGraphs } from 'library/Graphs/Utils';
import { planckBnToUnit, humanNumber } from 'Utils';
import {
  SECTION_FULL_WIDTH_THRESHOLD,
  SIDE_MENU_STICKY_THRESHOLD,
} from 'consts';
import { ActiveAccount } from './ActiveAccount';
import TotalNominatorsStatBox from './Stats/TotalNominations';
import { ActiveNominatorsStatBox } from './Stats/ActiveNominators';
import ActiveEraStatBox from './Stats/ActiveEra';
import { NetworkStats } from './NetworkSats';
import BalanceGraph from './BalanceGraph';
import Payouts from './Payouts';
import Reserve from './Reserve';

export const Overview = () => {
  const { network } = useApi();
  const { units } = network;
  const { payouts, poolClaims } = useSubscan();
  const { lastReward } = formatRewardsForGraphs(
    14,
    1,
    units,
    payouts,
    poolClaims
  );

  const PAYOUTS_HEIGHT = 410;
  const BALANCE_HEIGHT = PAYOUTS_HEIGHT;

  return (
    <>
      <PageTitle title="Overview" />
      <PageRowWrapper className="page-padding" noVerticalSpacer>
        <TopBarWrapper>
          <ActiveAccount />
        </TopBarWrapper>
      </PageRowWrapper>
      <StatBoxList>
        <TotalNominatorsStatBox />
        <ActiveNominatorsStatBox />
        <ActiveEraStatBox />
      </StatBoxList>
      <PageRowWrapper className="page-padding" noVerticalSpacer>
        <RowSecondaryWrapper
          hOrder={0}
          vOrder={0}
          thresholdStickyMenu={SIDE_MENU_STICKY_THRESHOLD}
          thresholdFullWidth={SECTION_FULL_WIDTH_THRESHOLD}
        >
          <GraphWrapper style={{ minHeight: BALANCE_HEIGHT }} flex>
            <BalanceGraph />
            <Reserve />
          </GraphWrapper>
        </RowSecondaryWrapper>
        <RowPrimaryWrapper
          hOrder={1}
          vOrder={1}
          thresholdStickyMenu={SIDE_MENU_STICKY_THRESHOLD}
          thresholdFullWidth={SECTION_FULL_WIDTH_THRESHOLD}
        >
          <GraphWrapper style={{ minHeight: PAYOUTS_HEIGHT }} flex>
            <SubscanButton />
            <div className="head">
              <h4>Recent Payouts</h4>
              <h2>
                {lastReward === null
                  ? 0
                  : humanNumber(
                      planckBnToUnit(new BN(lastReward.amount), units)
                    )}
                &nbsp;{network.unit}
                &nbsp;
                <span className="fiat">
                  {lastReward === null
                    ? ''
                    : moment.unix(lastReward.block_timestamp).fromNow()}
                </span>
              </h2>
            </div>
            <Payouts />
          </GraphWrapper>
        </RowPrimaryWrapper>
      </PageRowWrapper>
      <PageRowWrapper className="page-padding" noVerticalSpacer>
        <NetworkStats />
      </PageRowWrapper>
    </>
  );
};

export default Overview;
