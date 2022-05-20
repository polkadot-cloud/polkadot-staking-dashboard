// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faGripVertical } from '@fortawesome/free-solid-svg-icons';
import {
  List,
  Header,
  Wrapper as ListWrapper,
  Pagination,
} from '../../library/List';
import { useApi } from '../../contexts/Api';
import { StakingContext } from '../../contexts/Staking';
import { useUi } from '../../contexts/UI';
import { useNetworkMetrics } from '../../contexts/Network';
import { LIST_ITEMS_PER_PAGE, LIST_ITEMS_PER_BATCH } from '../../constants';
import { ItemWrapper } from './Wrappers';
import { planckToUnit } from '../../Utils';

export const PayoutListInner = (props: any) => {
  const { isReady, network }: any = useApi();
  const { units } = network;
  const { metrics }: any = useNetworkMetrics();

  const { setListFormat, listFormat }: any = useUi();
  const { allowMoreCols, pagination }: any = props;

  const disableThrottle = props.disableThrottle ?? false;

  // current page
  const [page, setPage]: any = useState(1);

  // current render iteration
  const [renderIteration, _setRenderIteration]: any = useState(1);

  // default list of payouts. Will be used for filtering.
  const [payoutsDefault, setPayoutsDefault] = useState(props.payouts);

  // manipulated list (ordering, filtering) of payouts
  const [payouts, setPayouts]: any = useState(props.payouts);

  // is this the initial render
  const [initial, setInitial] = useState(true);

  // is this the initial fetch
  const [fetched, setFetched] = useState(false);

  // render throttle iteration
  const renderIterationRef = useRef(renderIteration);
  const setRenderIteration = (iter: number) => {
    renderIterationRef.current = iter;
    _setRenderIteration(iter);
  };

  // pagination
  const totalPages = Math.ceil(payouts.length / LIST_ITEMS_PER_PAGE);
  const nextPage = page + 1 > totalPages ? totalPages : page + 1;
  const prevPage = page - 1 < 1 ? 1 : page - 1;
  const pageEnd = page * LIST_ITEMS_PER_PAGE - 1;
  const pageStart = pageEnd - (LIST_ITEMS_PER_PAGE - 1);

  // render batch
  const batchEnd = renderIteration * LIST_ITEMS_PER_BATCH - 1;

  // refetch list when list changes
  useEffect(() => {
    setFetched(false);
  }, [props.payouts]);

  // configure list when network is ready to fetch
  useEffect(() => {
    if (isReady && metrics.activeEra.index !== 0 && !fetched) {
      setPayoutsDefault(props.payouts);
      setPayouts(props.payouts);
      setInitial(true);
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
    listPayouts = payouts.slice(pageStart).slice(0, LIST_ITEMS_PER_PAGE);
  } else {
    listPayouts = payouts;
  }

  if (!payouts.length) {
    return <></>;
  }

  return (
    <ListWrapper>
      <Header>
        <div>
          <h3>{props.title}</h3>
        </div>
        <div>
          <button type="button" onClick={() => setListFormat('row')}>
            <FontAwesomeIcon
              icon={faBars}
              color={listFormat === 'row' ? '#d33079' : 'inherit'}
            />
          </button>
          <button type="button" onClick={() => setListFormat('col')}>
            <FontAwesomeIcon
              icon={faGripVertical}
              color={listFormat === 'col' ? '#d33079' : 'inherit'}
            />
          </button>
        </div>
      </Header>
      <List flexBasisLarge={allowMoreCols ? '33.33%' : '50%'}>
        {pagination && (
          <Pagination prev={page !== 1} next={page !== totalPages}>
            <div>
              <h4>
                Page {page} of {totalPages}
              </h4>
            </div>
            <div>
              <button
                type="button"
                className="prev"
                onClick={() => {
                  setPage(prevPage);
                  setInitial(false);
                }}
              >
                Prev
              </button>
              <button
                type="button"
                className="next"
                onClick={() => {
                  setPage(nextPage);
                  setInitial(false);
                }}
              >
                Next
              </button>
            </div>
          </Pagination>
        )}

        <motion.div
          className="transition"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.01,
              },
            },
          }}
        >
          {listPayouts.map((payout: any, index: number) => {
            const { amount, block_timestamp, event_id }: any = payout;

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
                  <div>
                    <div>
                      <span className={event_id.toLowerCase()}>
                        <h4>{event_id}</h4>
                      </span>
                      <h4 className={event_id.toLowerCase()}>
                        {event_id === 'Reward' ? '+' : '-'}
                        {planckToUnit(amount, units)} {network.unit}
                      </h4>
                    </div>
                    <div>
                      <h4>{moment.unix(block_timestamp).fromNow()}</h4>
                    </div>
                  </div>
                </ItemWrapper>
              </motion.div>
            );
          })}
        </motion.div>
      </List>
    </ListWrapper>
  );
};

export class PayoutList extends React.Component<any, any> {
  static contextType = StakingContext;

  render() {
    return <PayoutListInner {...this.props} />;
  }
}

export default PayoutList;
