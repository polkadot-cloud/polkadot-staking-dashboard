// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useRef } from 'react';
import moment from 'moment';
import { StatBoxList } from 'library/StatBoxList';
import { useSubscan } from 'contexts/Subscan';
import { useUi } from 'contexts/UI';
import {
  GraphWrapper,
  CardWrapper,
  CardHeaderWrapper,
} from 'library/Graphs/Wrappers';
import { PageRowWrapper } from 'Wrappers';
import { SubscanButton } from 'library/SubscanButton';
import { PayoutLine } from 'library/Graphs/PayoutLine';
import { PayoutBar } from 'library/Graphs/PayoutBar';
import { PageTitle } from 'library/PageTitle';
import { useSize, formatSize } from 'library/Graphs/Utils';
import { StatusLabel } from 'library/StatusLabel';
import { OpenHelpIcon } from 'library/OpenHelpIcon';
import { useStaking } from 'contexts/Staking';
import { MAX_PAYOUT_DAYS } from 'consts';
import { AnySubscan } from 'types';
import { BN } from 'bn.js';
import { useTranslation } from 'react-i18next';
import { PageProps } from '../types';
import { PayoutList } from './PayoutList';
import LastEraPayoutStatBox from './Stats/LastEraPayout';

export const Payouts = (props: PageProps) => {
  const { payouts, poolClaims } = useSubscan();
  const { isSyncing, services } = useUi();
  const { inSetup } = useStaking();
  const notStaking = !isSyncing && inSetup();
  const { t: tCommon } = useTranslation('common');
  const { t: tPages } = useTranslation('pages');

  const { page } = props;
  const { key } = page;

  const ref = useRef<HTMLDivElement>(null);
  const size = useSize(ref.current);
  const { width, height, minHeight } = formatSize(size, 300);

  // take non-zero rewards in most-recent order
  let payoutsList: AnySubscan = [
    ...payouts.concat(poolClaims).filter((p: AnySubscan) => p.amount > 0),
  ].slice(0, MAX_PAYOUT_DAYS);

  // re-order rewards based on block timestamp
  payoutsList = payoutsList.sort((a: AnySubscan, b: AnySubscan) => {
    const x = new BN(a.block_timestamp);
    const y = new BN(b.block_timestamp);
    return y.sub(x);
  });

  return (
    <>
      <PageTitle title={tPages(key)} />
      <StatBoxList>
        <LastEraPayoutStatBox />
      </StatBoxList>
      <PageRowWrapper className="page-padding" noVerticalSpacer>
        <GraphWrapper>
          <SubscanButton />
          <CardHeaderWrapper padded>
            <h4>
              {tCommon('pages.payouts.payout_history')}
              <OpenHelpIcon helpKey="Payout History" />
            </h4>
            <h2>
              {payouts.length ? (
                <>
                  {moment.unix(payouts[0].block_timestamp).format('Do MMMM')}
                  &nbsp;-&nbsp;
                  {moment
                    .unix(payouts[payouts.length - 1].block_timestamp)
                    .format('Do MMMM')}
                </>
              ) : (
                tCommon('pages.payouts.none')
              )}
            </h2>
          </CardHeaderWrapper>
          <div className="inner" ref={ref} style={{ minHeight }}>
            {!services.includes('subscan') ? (
              <StatusLabel
                status="active_service"
                statusFor="subscan"
                title={tCommon('pages.payouts.subscan_disabled')}
                topOffset="30%"
              />
            ) : (
              <StatusLabel
                status="sync_or_setup"
                title={tCommon('pages.payouts.not_staking')}
                topOffset="30%"
              />
            )}

            <div
              className="graph"
              style={{
                height: `${height}px`,
                width: `${width}px`,
                position: 'absolute',
                opacity: notStaking ? 0.75 : 1,
                transition: 'opacity 0.5s',
              }}
            >
              <PayoutBar days={MAX_PAYOUT_DAYS} height="150px" />
              <PayoutLine days={MAX_PAYOUT_DAYS} average={10} height="75px" />
            </div>
          </div>
        </GraphWrapper>
      </PageRowWrapper>
      {!payoutsList.length ? (
        <></>
      ) : (
        <PageRowWrapper className="page-padding" noVerticalSpacer>
          <CardWrapper>
            <PayoutList
              title={tCommon('pages.payouts.recent_payouts')}
              payouts={payoutsList}
              pagination
            />
          </CardWrapper>
        </PageRowWrapper>
      )}
    </>
  );
};

export default Payouts;
