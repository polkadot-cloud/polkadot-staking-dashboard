// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faBars, faGripVertical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ListItemsPerBatch, ListItemsPerPage } from 'consts';
import { useApi } from 'contexts/Api';
import { useNetworkMetrics } from 'contexts/Network';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { BondedPool } from 'contexts/Pools/types';
import { StakingContext } from 'contexts/Staking';
import { useTheme } from 'contexts/Themes';
import { useValidators } from 'contexts/Validators';
import { Validator } from 'contexts/Validators/types';
import { formatDistance, fromUnixTime } from 'date-fns';
import { motion } from 'framer-motion';
import { Header, List, Wrapper as ListWrapper } from 'library/List';
import { MotionContainer } from 'library/List/MotionContainer';
import { Pagination } from 'library/List/Pagination';
import { Identity } from 'library/ListItem/Labels/Identity';
import { PoolIdentity } from 'library/ListItem/Labels/PoolIdentity';
import { locales } from 'locale';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { networkColors } from 'theme/default';
import { AnySubscan } from 'types';
import { clipAddress, planckToUnit } from 'Utils';
import { PayoutListProps } from '../types';
import { ItemWrapper } from '../Wrappers';
import { PayoutListProvider, usePayoutList } from './context';

export const PayoutListInner = (props: PayoutListProps) => {
  const { allowMoreCols, pagination } = props;

  const { mode } = useTheme();
  const { isReady, network } = useApi();
  const { units } = network;
  const { metrics } = useNetworkMetrics();
  const { listFormat, setListFormat } = usePayoutList();
  const { validators, meta } = useValidators();
  const { bondedPools } = useBondedPools();
  const { i18n, t } = useTranslation('pages');

  const disableThrottle = props.disableThrottle ?? false;

  // current page
  const [page, setPage] = useState<number>(1);

  // current render iteration
  const [renderIteration, _setRenderIteration] = useState<number>(1);

  // manipulated list (ordering, filtering) of payouts
  const [payouts, setPayouts] = useState(props.payouts);

  // is this the initial fetch
  const [fetched, setFetched] = useState<boolean>(false);

  // render throttle iteration
  const renderIterationRef = useRef(renderIteration);
  const setRenderIteration = (iter: number) => {
    renderIterationRef.current = iter;
    _setRenderIteration(iter);
  };

  // pagination
  const totalPages = Math.ceil(payouts.length / ListItemsPerPage);
  const pageEnd = page * ListItemsPerPage - 1;
  const pageStart = pageEnd - (ListItemsPerPage - 1);

  // render batch
  const batchEnd = renderIteration * ListItemsPerBatch - 1;

  // refetch list when list changes
  useEffect(() => {
    setFetched(false);
  }, [props.payouts]);

  // configure list when network is ready to fetch
  useEffect(() => {
    if (isReady && metrics.activeEra.index !== 0 && !fetched) {
      setPayouts(props.payouts);
      setFetched(true);
    }
  }, [isReady, fetched, metrics.activeEra.index]);

  // render throttle
  useEffect(() => {
    if (!(batchEnd >= pageEnd || disableThrottle)) {
      setTimeout(() => {
        setRenderIteration(renderIterationRef.current + 1);
      }, 500);
    }
  }, [renderIterationRef.current]);

  // get list items to render
  let listPayouts = [];

  // get throttled subset or entire list
  if (!disableThrottle) {
    listPayouts = payouts.slice(pageStart).slice(0, ListItemsPerPage);
  } else {
    listPayouts = payouts;
  }

  if (!payouts.length) {
    return <></>;
  }

  // get validator metadata
  const batchKey = 'validators_browse';

  return (
    <ListWrapper>
      <Header>
        <div>
          <h4>{props.title}</h4>
        </div>
        <div>
          <button type="button" onClick={() => setListFormat('row')}>
            <FontAwesomeIcon
              icon={faBars}
              color={
                listFormat === 'row'
                  ? networkColors[`${network.name}-${mode}`]
                  : 'inherit'
              }
            />
          </button>
          <button type="button" onClick={() => setListFormat('col')}>
            <FontAwesomeIcon
              icon={faGripVertical}
              color={
                listFormat === 'col'
                  ? networkColors[`${network.name}-${mode}`]
                  : 'inherit'
              }
            />
          </button>
        </div>
      </Header>
      <List flexBasisLarge={allowMoreCols ? '33.33%' : '50%'}>
        {pagination && (
          <Pagination page={page} total={totalPages} setter={setPage} />
        )}
        <MotionContainer>
          {listPayouts.map((p: AnySubscan, index: number) => {
            const label =
              p.event_id === 'PaidOut'
                ? t('payouts.pool_claim')
                : p.event_id === 'Rewarded'
                ? t('payouts.payout')
                : p.event_id;

            const labelClass =
              p.event_id === 'PaidOut'
                ? 'claim'
                : p.event_id === 'Rewarded'
                ? 'reward'
                : undefined;

            // get validator if it exists
            const validator = validators.find(
              (v: Validator) => v.address === p.validator_stash
            );

            // get pool if it exists
            const pool = bondedPools.find(
              (_p: BondedPool) => String(_p.id) === String(p.pool_id)
            );

            const batchIndex = validator
              ? validators.indexOf(validator)
              : pool
              ? bondedPools.indexOf(pool)
              : 0;

            return (
              <motion.div
                className={`item ${listFormat === 'row' ? 'row' : 'col'}`}
                key={`nomination_${index}`}
                variants={{
                  hidden: {
                    y: 15,
                    opacity: 0,
                  },
                  show: {
                    y: 0,
                    opacity: 1,
                  },
                }}
              >
                <ItemWrapper>
                  <div className="inner">
                    <div className="row">
                      <div>
                        <div>
                          <h4 className={`${labelClass}`}>
                            {p.event_id === 'Slashed' ? '-' : '+'}
                            {planckToUnit(p.amount, units)} {network.unit}
                          </h4>
                        </div>
                        <div>
                          <h5 className={`${labelClass}`}>{label}</h5>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div>
                        <div>
                          {label === t('payouts.payout') && (
                            <>
                              {batchIndex > 0 ? (
                                <Identity
                                  meta={meta}
                                  address={p.validator_stash}
                                  batchIndex={batchIndex}
                                  batchKey={batchKey}
                                />
                              ) : (
                                <div>{clipAddress(p.validator_stash)}</div>
                              )}
                            </>
                          )}
                          {label === t('payouts.pool_claim') && (
                            <>
                              {pool ? (
                                <PoolIdentity
                                  batchKey={batchKey}
                                  batchIndex={batchIndex}
                                  pool={pool}
                                />
                              ) : (
                                <h4>
                                  {t('payouts.from_pool')} {p.pool_id}
                                </h4>
                              )}
                            </>
                          )}
                          {label === t('payouts.slashed') && (
                            <h4>{t('payouts.deducted_from_bond')}</h4>
                          )}
                        </div>
                        <div>
                          <h5>
                            {formatDistance(
                              fromUnixTime(p.block_timestamp),
                              new Date(),
                              {
                                addSuffix: true,
                                locale: locales[i18n.resolvedLanguage],
                              }
                            )}
                          </h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </ItemWrapper>
              </motion.div>
            );
          })}
        </MotionContainer>
      </List>
    </ListWrapper>
  );
};

export const PayoutList = (props: PayoutListProps) => {
  return (
    <PayoutListProvider>
      <PayoutListShouldUpdate {...props} />
    </PayoutListProvider>
  );
};

export class PayoutListShouldUpdate extends React.Component {
  static contextType = StakingContext;

  render() {
    return <PayoutListInner {...this.props} />;
  }
}

export default PayoutList;
