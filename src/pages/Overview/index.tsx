// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faAngleRight, faBullhorn } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  ButtonMonoInvert,
  ButtonPrimary,
  ButtonText,
  PageHeading,
  PageRow,
  PageTitle,
  RowSection,
} from '@polkadotcloud/core-ui';
import { planckToUnit } from '@polkadotcloud/utils';
import BigNumber from 'bignumber.js';
import { DefaultLocale } from 'consts';
import { useApi } from 'contexts/Api';
import { useSubscan } from 'contexts/Subscan';
import { useTheme } from 'contexts/Themes';
import { formatDistance, fromUnixTime, getUnixTime } from 'date-fns';
import { CardHeaderWrapper, CardWrapper } from 'library/Card/Wrappers';
import { formatRewardsForGraphs } from 'library/Graphs/Utils';
import { StatBoxList } from 'library/StatBoxList';
import { SubscanButton } from 'library/SubscanButton';
import { locales } from 'locale';
import { ControllerNotStash } from 'pages/Nominate/Active/ControllerNotStash';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActiveAccounts } from './ActiveAccounts';
import { BalanceChart } from './BalanceChart';
import { BalanceLinks } from './BalanceLinks';
import { NetworkStats } from './NetworkSats';
import { Payouts } from './Payouts';
import { StakeStatus } from './StakeStatus';
import { ActiveEraStat } from './Stats/ActiveEraTimeLeft';
import { HistoricalRewardsRateStat } from './Stats/HistoricalRewardsRate';
import { SupplyStakedStat } from './Stats/SupplyStaked';
import { BannerWrapper } from './Wrappers';

export const Overview = () => {
  const { i18n, t } = useTranslation('pages');
  const { network } = useApi();
  const { payouts, poolClaims, unclaimedPayouts } = useSubscan();
  const { mode } = useTheme();
  const { units } = network;
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
      locale: locales[i18n.resolvedLanguage ?? DefaultLocale],
    };
  }

  const dismissed = localStorage.getItem('delegate_banner_dismissed') || false;
  const [isDismissed, setIsDismissed] = useState(dismissed);

  const handleDismiss = () => {
    localStorage.setItem('delegate_banner_dismissed', '1');
    setIsDismissed(true);
  };
  const showBanner = network.name === 'polkadot' && !isDismissed;
  const VisitButton = mode === 'light' ? ButtonPrimary : ButtonMonoInvert;

  return (
    <>
      {showBanner && (
        <PageRow style={{ position: 'relative', top: '3rem' }}>
          <BannerWrapper className={mode}>
            <h5 className="label">
              <FontAwesomeIcon
                icon={faBullhorn}
                transform="shrink-3"
                className="icon"
              />
              {t('overview.announcement')}
            </h5>
            <div>
              <h3>{t('overview.openGovBanner')}</h3>
              <VisitButton
                style={{
                  width: '9rem',
                }}
                text={t('overview.goToApp')}
                onClick={() =>
                  window.open(
                    import.meta.env.PROD
                      ? 'https://delegation.polkadot.network/'
                      : 'https://paritytech.github.io/governance-ui/',
                    '_blank'
                  )
                }
                iconRight={faAngleRight}
                iconTransform="shrink-2"
              />
            </div>
          </BannerWrapper>
          <ButtonText
            text={t('overview.dismiss')}
            style={{
              color:
                mode === 'light'
                  ? 'var(--network-color-primary)'
                  : 'var(--text-color-primary)',
              marginTop: '0.5rem',
            }}
            onClick={() => handleDismiss()}
          />
        </PageRow>
      )}
      <PageTitle title={`${t('overview.overview')}`} />
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
          <CardWrapper height={PAYOUTS_HEIGHT} flex>
            <BalanceChart />
            <BalanceLinks />
          </CardWrapper>
        </RowSection>
        <RowSection hLast vLast>
          <CardWrapper style={{ minHeight: PAYOUTS_HEIGHT }} flex>
            <SubscanButton />
            <CardHeaderWrapper>
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
                <span className="note">
                  {lastReward === null
                    ? ''
                    : formatDistance(formatFrom, formatTo, formatOpts)}
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
