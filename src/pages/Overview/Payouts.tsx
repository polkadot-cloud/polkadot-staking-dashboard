// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { usePlugins } from 'contexts/Plugins';
import { useStaking } from 'contexts/Staking';
import { useUi } from 'contexts/UI';
import { PayoutBar } from 'library/Graphs/PayoutBar';
import { PayoutLine } from 'library/Graphs/PayoutLine';
import { formatRewardsForGraphs, formatSize } from 'library/Graphs/Utils';
import { GraphWrapper } from 'library/Graphs/Wrapper';
import { useSize } from 'library/Hooks/useSize';
import { StatusLabel } from 'library/StatusLabel';
import { useSubscanData } from 'library/Hooks/useSubscanData';
import { CardHeaderWrapper } from 'library/Card/Wrappers';
import { Odometer } from '@polkadot-cloud/react';
import { locales } from 'locale';
import BigNumber from 'bignumber.js';
import { formatDistance, fromUnixTime, getUnixTime } from 'date-fns';
import { minDecimalPlaces, planckToUnit } from '@polkadot-cloud/utils';
import { useNetwork } from 'contexts/Network';
import { DefaultLocale } from 'consts';

export const Payouts = () => {
  const { i18n, t } = useTranslation('pages');
  const { isSyncing } = useUi();
  const { inSetup } = useStaking();
  const {
    networkData: {
      units,
      brand: { token: Token },
    },
  } = useNetwork();
  const { plugins } = usePlugins();
  const { getData, injectBlockTimestamp } = useSubscanData([
    'payouts',
    'unclaimedPayouts',
    'poolClaims',
  ]);
  const notStaking = !isSyncing && inSetup();

  // Get data safely from subscan hook.
  const data = getData(['payouts', 'unclaimedPayouts', 'poolClaims']);

  // Inject `block_timestamp` for unclaimed payouts.
  data['unclaimedPayouts'] = injectBlockTimestamp(data?.unclaimedPayouts || []);

  // Ref to the graph container.
  const graphInnerRef = useRef<HTMLDivElement>(null);

  // Get the size of the graph container.
  const size = useSize(graphInnerRef?.current || undefined);
  const { width, height, minHeight } = formatSize(size, 260);

  // Get the last reward with its timestmap.
  const { lastReward } = formatRewardsForGraphs(
    new Date(),
    14,
    units,
    data.payouts,
    data.poolClaims,
    data.unclaimedPayouts
  );
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
              <>&nbsp;{formatDistance(formatFrom, formatTo, formatOpts)}</>
            )}
          </span>
        </h2>
      </CardHeaderWrapper>
      <div className="inner" ref={graphInnerRef} style={{ minHeight }}>
        {!plugins.includes('subscan') ? (
          <StatusLabel
            status="active_service"
            statusFor="subscan"
            title={t('overview.subscanDisabled')}
            topOffset="37%"
          />
        ) : (
          <StatusLabel
            status="sync_or_setup"
            title={t('overview.notStaking')}
            topOffset="37%"
          />
        )}
        <GraphWrapper
          style={{
            height: `${height}px`,
            width: `${width}px`,
            position: 'absolute',
            opacity: notStaking ? 0.75 : 1,
            transition: 'opacity 0.5s',
          }}
        >
          <PayoutBar days={19} height="150px" data={data} />
          <div style={{ marginTop: '3rem' }}>
            <PayoutLine days={19} average={10} height="65px" data={data} />
          </div>
        </GraphWrapper>
      </div>
    </>
  );
};
