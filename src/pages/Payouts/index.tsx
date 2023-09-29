// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ButtonHelp, PageRow, PageTitle } from '@polkadot-cloud/react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MaxPayoutDays } from 'consts';
import { useHelp } from 'contexts/Help';
import { usePlugins } from 'contexts/Plugins';
import { useStaking } from 'contexts/Staking';
import { useSubscan } from 'contexts/Plugins/Subscan';
import { useUi } from 'contexts/UI';
import { CardHeaderWrapper, CardWrapper } from 'library/Card/Wrappers';
import { PayoutBar } from 'library/Graphs/PayoutBar';
import { PayoutLine } from 'library/Graphs/PayoutLine';
import { formatSize, sortNonZeroPayouts } from 'library/Graphs/Utils';
import { GraphWrapper } from 'library/Graphs/Wrapper';
import { useSize } from 'library/Hooks/useSize';
import { StatBoxList } from 'library/StatBoxList';
import { StatusLabel } from 'library/StatusLabel';
import type { AnySubscan, PageProps } from 'types';
import { PluginLabel } from 'library/PluginLabel';
import { PayoutList } from './PayoutList';
import { LastEraPayoutStat } from './Stats/LastEraPayout';

export const Payouts = ({ page }: PageProps) => {
  const { t } = useTranslation();
  const { payouts, poolClaims, payoutsFromDate, payoutsToDate } = useSubscan();
  const { isSyncing } = useUi();
  const { plugins } = usePlugins();
  const { inSetup } = useStaking();
  const notStaking = !isSyncing && inSetup();
  const { openHelp } = useHelp();

  const [payoutsList, setPayoutLists] = useState<AnySubscan>([]);

  const { key } = page;

  const ref = useRef<HTMLDivElement>(null);
  const size = useSize(ref.current);
  const { width, height, minHeight } = formatSize(size, 280);

  useEffect(() => {
    // filter zero rewards and order via block timestamp, most recent first.
    setPayoutLists(sortNonZeroPayouts(payouts, poolClaims, true));
  }, [payouts, poolClaims]);

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
          <div className="inner" ref={ref} style={{ minHeight }}>
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
              <PayoutBar days={MaxPayoutDays} height="165px" />
              <PayoutLine days={MaxPayoutDays} average={10} height="65px" />
            </GraphWrapper>
          </div>
        </CardWrapper>
      </PageRow>
      {!payoutsList?.length ? (
        <></>
      ) : (
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
