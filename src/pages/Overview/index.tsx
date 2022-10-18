// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import {
  SECTION_FULL_WIDTH_THRESHOLD,
  SIDE_MENU_STICKY_THRESHOLD,
} from 'consts';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { useSubscan } from 'contexts/Subscan';
import { formatRewardsForGraphs } from 'library/Graphs/Utils';
import { GraphWrapper } from 'library/Graphs/Wrappers';
import { PageTitle } from 'library/PageTitle';
import { StatBoxList } from 'library/StatBoxList';
import { SubscanButton } from 'library/SubscanButton';
import moment from 'moment';
import { humanNumber, planckBnToUnit } from 'Utils';
import {
  PageRowWrapper,
  RowPrimaryWrapper,
  RowSecondaryWrapper,
  TopBarWrapper,
} from 'Wrappers';
import { ActiveAccount } from './ActiveAccount';
import BalanceGraph from './BalanceGraph';
import { NetworkStats } from './NetworkSats';
import Payouts from './Payouts';
import Reserve from './Reserve';
import ActiveEraStatBox from './Stats/ActiveEra';
import { ActiveNominatorsStatBox } from './Stats/ActiveNominators';
import TotalNominatorsStatBox from './Stats/TotalNominations';

export const Overview = () => {
  const { network } = useApi();
  const { units } = network;
  const { t } = useTranslation('common');
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
      <PageTitle title={t('pages.overview.overview')} />
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
              <h4>{t('pages.overview.recent_payouts')}</h4>
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
