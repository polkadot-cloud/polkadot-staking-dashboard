// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { SectionFullWidthThreshold, SideMenuStickyThreshold } from 'consts';
import { useApi } from 'contexts/Api';
import { usePlugins } from 'contexts/Plugins';
import { useSubscan } from 'contexts/Subscan';
import { formatDistance, fromUnixTime, getUnixTime } from 'date-fns';
import { formatRewardsForGraphs } from 'library/Graphs/Utils';
import { GraphWrapper } from 'library/Graphs/Wrappers';
import { PageTitle } from 'library/PageTitle';
import { StatBoxList } from 'library/StatBoxList';
import { SubscanButton } from 'library/SubscanButton';
import { locales } from 'locale';
import { useTranslation } from 'react-i18next';
import { humanNumber, planckBnToUnit } from 'Utils';
import {
  PageRowWrapper,
  RowPrimaryWrapper,
  RowSecondaryWrapper,
  TopBarWrapper,
} from 'Wrappers';
import { ActiveAccount } from './ActiveAccount';
import { BalanceChart } from './BalanceChart';
import { NetworkStats } from './NetworkSats';
import Payouts from './Payouts';
import EraTimeLeftStat from './Stats/EraTimeLeft';
import HistoricalRewardsRateStat from './Stats/HistoricalRewardsRate';
import SupplyStakedStat from './Stats/SupplyStaked';
import { Tips } from './Tips';

export const Overview = () => {
  const { network } = useApi();
  const { units } = network;
  const { payouts, poolClaims } = useSubscan();
  const { plugins } = usePlugins();
  const { lastReward } = formatRewardsForGraphs(
    14,
    1,
    units,
    payouts,
    poolClaims
  );
  const { i18n, t } = useTranslation('pages');

  const PAYOUTS_HEIGHT = 390;

  let formatFrom = new Date();
  let formatTo = new Date();
  let formatOpts = {};
  if (lastReward !== null) {
    formatFrom = fromUnixTime(
      lastReward?.block_timestamp ?? getUnixTime(new Date())
    );
    formatTo = new Date();
    formatOpts = {
      addSuffix: true,
      locale: locales[i18n.resolvedLanguage],
    };
  }

  return (
    <>
      <PageTitle title={t('overview.overview')} />
      <PageRowWrapper className="page-padding" noVerticalSpacer>
        <TopBarWrapper>
          <ActiveAccount />
        </TopBarWrapper>
      </PageRowWrapper>
      <StatBoxList>
        <HistoricalRewardsRateStat />
        <SupplyStakedStat />
        <EraTimeLeftStat />
      </StatBoxList>
      {plugins.includes('tips') && (
        <PageRowWrapper className="page-padding" noVerticalSpacer>
          <Tips />
        </PageRowWrapper>
      )}
      <PageRowWrapper className="page-padding" noVerticalSpacer>
        <RowSecondaryWrapper
          hOrder={0}
          vOrder={0}
          thresholdStickyMenu={SideMenuStickyThreshold}
          thresholdFullWidth={SectionFullWidthThreshold}
        >
          <GraphWrapper minHeight={PAYOUTS_HEIGHT} flex>
            <BalanceChart />
          </GraphWrapper>
        </RowSecondaryWrapper>
        <RowPrimaryWrapper
          hOrder={1}
          vOrder={1}
          thresholdStickyMenu={SideMenuStickyThreshold}
          thresholdFullWidth={SectionFullWidthThreshold}
        >
          <GraphWrapper style={{ minHeight: PAYOUTS_HEIGHT }} flex>
            <SubscanButton />
            <div className="head">
              <h4>{t('overview.recentPayouts')}</h4>
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
                    : formatDistance(formatFrom, formatTo, formatOpts)}
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
