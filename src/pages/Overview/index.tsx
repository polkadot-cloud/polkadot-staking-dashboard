// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { planckToUnit } from '@polkadotcloud/utils';
import {
  PageRowWrapper,
  RowPrimaryWrapper,
  RowSecondaryWrapper,
  TopBarWrapper,
} from 'Wrappers';
import BigNumber from 'bignumber.js';
import { SectionFullWidthThreshold, SideMenuStickyThreshold } from 'consts';
import { useApi } from 'contexts/Api';
import { useSubscan } from 'contexts/Subscan';
import { formatDistance, fromUnixTime, getUnixTime } from 'date-fns';
import { formatRewardsForGraphs } from 'library/Graphs/Utils';
import { GraphWrapper } from 'library/Graphs/Wrappers';
import { PageTitle } from 'library/PageTitle';
import { StatBoxList } from 'library/StatBoxList';
import { SubscanButton } from 'library/SubscanButton';
import { locales } from 'locale';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { AnyJson } from 'types';
import { ActiveAccount } from './ActiveAccount';
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
  const { network } = useApi();
  const { units } = network;
  const { payouts, poolClaims, unclaimedPayouts } = useSubscan();
  const { lastReward } = formatRewardsForGraphs(
    new Date(),
    14,
    units,
    payouts,
    poolClaims,
    unclaimedPayouts
  );

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

  const ref = React.useRef<AnyJson>(null);
  const refInitialised = React.useRef<AnyJson>(false);
  const getRef = () => {
    return ref.current;
  };

  const handleOnHover = async () => {
    if (!ref) return;
    ref.current.play();
  };

  const handleComplete = (r: AnyJson) => {
    // console.log(r.getLottie());
    // console.log(r.getLottie().totalFrames);
    r?.stop();
  };

  useEffect(() => {
    console.log('try initialise');
    if (!ref.current || refInitialised.current) return;
    refInitialised.current = true;

    ref.current.addEventListener('loop', () => handleComplete(ref.current));
  }, [ref.current]);

  useEffect(() => {
    return () => {
      // ref.current.removeEventListener('loop', handleComplete);
    };
  });

  return (
    <>
      <PageTitle title={t('overview.overview')} />
      <PageRowWrapper>
        <button type="button" onMouseEnter={handleOnHover}>
          <dotlottie-player
            ref={ref}
            loop
            autoplay
            src="/lottie/analytics2.lottie"
            style={{ height: '100%', width: '100%' }}
          />
        </button>
      </PageRowWrapper>
      <PageRowWrapper className="page-padding" noVerticalSpacer>
        <TopBarWrapper>
          <ActiveAccount />
        </TopBarWrapper>
      </PageRowWrapper>
      <StatBoxList>
        <HistoricalRewardsRateStat />
        <SupplyStakedStat />
        <ActiveEraStat />
      </StatBoxList>
      <PageRowWrapper className="page-padding" noVerticalSpacer>
        <StakeStatus />
      </PageRowWrapper>
      <PageRowWrapper className="page-padding" noVerticalSpacer>
        <RowSecondaryWrapper
          hOrder={0}
          vOrder={0}
          thresholdStickyMenu={SideMenuStickyThreshold}
          thresholdFullWidth={SectionFullWidthThreshold}
        >
          <GraphWrapper minHeight={PAYOUTS_HEIGHT} flex>
            <BalanceChart />
            <BalanceLinks />
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
                  : planckToUnit(
                      new BigNumber(lastReward.amount),
                      units
                    ).toFormat()}
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
