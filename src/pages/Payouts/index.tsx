// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ButtonHelp, PageRow, PageTitle } from '@polkadot-cloud/react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DefaultLocale, MaxPayoutDays } from 'consts';
import { useHelp } from 'contexts/Help';
import { usePlugins } from 'contexts/Plugins';
import { useStaking } from 'contexts/Staking';
import { useUi } from 'contexts/UI';
import { CardHeaderWrapper, CardWrapper } from 'library/Card/Wrappers';
import { PayoutBar } from 'library/Graphs/PayoutBar';
import { PayoutLine } from 'library/Graphs/PayoutLine';
import { formatSize } from 'library/Graphs/Utils';
import { GraphWrapper } from 'library/Graphs/Wrapper';
import { useSize } from 'library/Hooks/useSize';
import { StatBoxList } from 'library/StatBoxList';
import { StatusLabel } from 'library/StatusLabel';
import type { AnySubscan, PageProps } from 'types';
import { PluginLabel } from 'library/PluginLabel';
import { PayoutList } from './PayoutList';
import { LastEraPayoutStat } from './Stats/LastEraPayout';
import { useSubscanData } from 'library/Hooks/useSubscanData';
import { SubscanController } from 'static/SubscanController';
import { locales } from 'locale';

export const Payouts = ({ page: { key } }: PageProps) => {
  const { i18n, t } = useTranslation();
  const { isSyncing } = useUi();
  const { openHelp } = useHelp();
  const { plugins } = usePlugins();
  const { inSetup } = useStaking();
  const { getData, injectBlockTimestamp } = useSubscanData([
    'payouts',
    'unclaimedPayouts',
    'poolClaims',
  ]);
  const notStaking = !isSyncing && inSetup();

  const [payoutsList, setPayoutLists] = useState<AnySubscan>([]);

  const ref = useRef<HTMLDivElement>(null);
  const size = useSize(ref?.current || undefined);
  const { width, height, minHeight } = formatSize(size, 280);

  // Get data safely from subscan hook.
  const data = getData(['payouts', 'unclaimedPayouts', 'poolClaims']);

  // Inject `block_timestamp` for unclaimed payouts.
  data['unclaimedPayouts'] = injectBlockTimestamp(data?.unclaimedPayouts || []);

  const payoutsFromDate = SubscanController.payoutsFromDate(
    (data?.payouts || []).concat(data?.poolClaims || []),
    locales[i18n.resolvedLanguage ?? DefaultLocale]
  );

  const payoutsToDate = SubscanController.payoutsToDate(
    (data?.payouts || []).concat(data?.poolClaims || []),
    locales[i18n.resolvedLanguage ?? DefaultLocale]
  );

  useEffect(() => {
    // filter zero rewards and order via block timestamp, most recent first.
    setPayoutLists(
      SubscanController.removeNonZeroAmountAndSort(
        (data?.payouts || []).concat(data?.poolClaims || [])
      )
    );
  }, [data?.payouts?.length, data?.poolClaims?.length]);

  return (
    <>
      <PageTitle title={t(key, { ns: 'base' })} />
      <StatBoxList>
        <LastEraPayoutStat />
      </StatBoxList>
      <PageRow>
        <CardWrapper>
          <PluginLabel plugin="subscan" />
          <CardHeaderWrapper>
            <h4>
              {t('payouts.payoutHistory', { ns: 'pages' })}
              <ButtonHelp
                marginLeft
                onClick={() => openHelp('Payout History')}
              />
            </h4>
            <h2>
              {payoutsFromDate && payoutsToDate ? (
                <>
                  {payoutsFromDate}
                  {payoutsToDate !== payoutsFromDate && (
                    <>&nbsp;-&nbsp;{payoutsToDate}</>
                  )}
                </>
              ) : (
                t('payouts.none', { ns: 'pages' })
              )}
            </h2>
          </CardHeaderWrapper>
          <div ref={ref} className="inner" style={{ minHeight }}>
            {!plugins.includes('subscan') ? (
              <StatusLabel
                status="active_service"
                statusFor="subscan"
                title={t('payouts.subscanDisabled', { ns: 'pages' })}
                topOffset="30%"
              />
            ) : (
              <StatusLabel
                status="sync_or_setup"
                title={t('payouts.notStaking', { ns: 'pages' })}
                topOffset="30%"
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
              <PayoutBar days={MaxPayoutDays} height="165px" data={data} />
              <PayoutLine
                days={MaxPayoutDays}
                average={10}
                height="65px"
                data={data}
              />
            </GraphWrapper>
          </div>
        </CardWrapper>
      </PageRow>
      {!!payoutsList?.length && (
        <PageRow>
          <CardWrapper>
            <PayoutList
              title={t('payouts.recentPayouts', { ns: 'pages' })}
              payouts={payoutsList}
              pagination
            />
          </CardWrapper>
        </PageRow>
      )}
    </>
  );
};
