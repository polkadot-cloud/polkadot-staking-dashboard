// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faGripVertical } from '@fortawesome/free-solid-svg-icons';
import { List, Header, Wrapper as ListWrapper, Pagination } from '../List';
import { useApi } from '../../contexts/Api';
import { StakingContext } from '../../contexts/Staking';
import { useUi } from '../../contexts/UI';
import { useNetworkMetrics } from '../../contexts/Network';
import { LIST_ITEMS_PER_PAGE, LIST_ITEMS_PER_BATCH } from '../../constants';
import { Pool } from '../Pool';

export const PoolListInner = (props: any) => {
  const { isReady }: any = useApi();
  const { metrics }: any = useNetworkMetrics();

  const { setListFormat, listFormat }: any = useUi();

  const { allowMoreCols, pagination }: any = props;

  const disableThrottle = props.disableThrottle ?? false;

  // current page
  const [page, setPage]: any = useState(1);

  // current render iteration
  const [renderIteration, _setRenderIteration]: any = useState(1);

  // default list of pools
  const [poolsDefault, setPoolsDefault] = useState(props.pools);

  // manipulated list (ordering, filtering) of pools
  const [pools, setPools]: any = useState(props.pools);

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
  const totalPages = Math.ceil(pools.length / LIST_ITEMS_PER_PAGE);
  const nextPage = page + 1 > totalPages ? totalPages : page + 1;
  const prevPage = page - 1 < 1 ? 1 : page - 1;
  const pageEnd = page * LIST_ITEMS_PER_PAGE - 1;
  const pageStart = pageEnd - (LIST_ITEMS_PER_PAGE - 1);

  // render batch
  const batchEnd = renderIteration * LIST_ITEMS_PER_BATCH - 1;

  // refetch list when pool list changes
  useEffect(() => {
    setFetched(false);
  }, [props.pools]);

  // configure pool list when network is ready to fetch
  useEffect(() => {
    if (isReady && metrics.activeEra.index !== 0 && !fetched) {
      setPoolsDefault(props.pools);
      setPools(props.pools);
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

  // get pools to render
  let listPools = [];

  // get throttled subset or entire list
  if (!disableThrottle) {
    listPools = pools.slice(pageStart).slice(0, LIST_ITEMS_PER_PAGE);
  } else {
    listPools = pools;
  }

  if (!pools.length) {
    return <></>;
  }

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
                Page
                {page} of
                {totalPages}
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
          {listPools.map((pool: any, index: number) => (
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
              <Pool pool={pool} initial={initial} />
            </motion.div>
          ))}
        </motion.div>
      </List>
    </ListWrapper>
  );
};

export class PoolList extends React.Component<any, any> {
  static contextType = StakingContext;

  shouldComponentUpdate(nextProps: any, nextState: any) {
    return this.props.pools !== nextProps.pools;
  }

  render() {
    return <PoolListInner {...this.props} />;
  }
}

export default PoolList;
