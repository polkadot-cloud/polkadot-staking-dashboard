// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  Odometer,
  PageHeading,
  PageRow,
  PageTitle,
  RowSection,
} from '@polkadot-cloud/react';
import BigNumber from 'bignumber.js';
import { formatDistance, fromUnixTime, getUnixTime } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { DefaultLocale } from 'consts';
import { useSubscan } from 'contexts/Plugins/Subscan';
import { CardHeaderWrapper, CardWrapper } from 'library/Card/Wrappers';
import { formatRewardsForGraphs } from 'library/Graphs/Utils';
import { StatBoxList } from 'library/StatBoxList';
import { locales } from 'locale';
import { ControllerNotStash } from 'pages/Nominate/Active/ControllerNotStash';
import { minDecimalPlaces, planckToUnit } from '@polkadot-cloud/utils';
import { PluginLabel } from 'library/PluginLabel';
import { useNetwork } from 'contexts/Network';
import { ActiveAccounts } from './ActiveAccounts';
import { BalanceChart } from './BalanceChart';
import { BalanceLinks } from './BalanceLinks';
import { NetworkStats } from './NetworkSats';
import { Payouts } from './Payouts';
import { StakeStatus } from './StakeStatus';
import { ActiveEraStat } from './Stats/ActiveEraTimeLeft';
import { HistoricalRewardsRateStat } from './Stats/HistoricalRewardsRate';
import { SupplyStakedStat } from './Stats/SupplyStaked';

export const Overview = () => {
  const { i18n, t } = useTranslation('pages');
  const {
    networkData: {
      units,
      brand: { token: Token },
    },
  } = useNetwork();
  const { payouts, poolClaims, unclaimedPayouts } = useSubscan();

  const { lastReward } = formatRewardsForGraphs(
    new Date(),
    14,
    units,
    payouts,
    poolClaims,
    unclaimedPayouts
  );

  const PAYOUTS_HEIGHT = 380;

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
      locale: locales[i18n.resolvedLanguage ?? DefaultLocale],
    };
  }

  return (
    <>
      <PageTitle title={t('overview.overview')} />
      <PageRow>
        <PageHeading>
          <ActiveAccounts />
        </PageHeading>
      </PageRow>
      <StatBoxList>
        <HistoricalRewardsRateStat />
        <SupplyStakedStat />
        <ActiveEraStat />
      </StatBoxList>
      <ControllerNotStash />
      <PageRow>
        <StakeStatus />
      </PageRow>
      <PageRow>
        <RowSection secondary>
          <CardWrapper height={PAYOUTS_HEIGHT}>
            <BalanceChart />
            <BalanceLinks />
          </CardWrapper>
        </RowSection>
        <RowSection hLast vLast>
          <CardWrapper style={{ minHeight: PAYOUTS_HEIGHT }}>
            <PluginLabel plugin="subscan" />
            <CardHeaderWrapper>
              <h4>{t('overview.recentPayouts')}</h4>
              <h2>
                <Token className="networkIcon" />
                <Odometer
                  value={minDecimalPlaces(
                    lastReward === null
                      ? '0'
                      : planckToUnit(
                          new BigNumber(lastReward.amount),
                          units
                        ).toFormat(),
                    2
                  )}
                />

                <span className="note">
                  {lastReward === null ? (
                    ''
                  ) : (
                    <>
                      &nbsp;{formatDistance(formatFrom, formatTo, formatOpts)}
                    </>
                  )}
                </span>
              </h2>
            </CardHeaderWrapper>
            <Payouts />
          </CardWrapper>
        </RowSection>
      </PageRow>
      <PageRow>
        <NetworkStats />
      </PageRow>
    </>
  );
};
