// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faBars, faGripVertical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ListItemsPerBatch, ListItemsPerPage } from 'consts';
import { useApi } from 'contexts/Api';
import { useNetworkMetrics } from 'contexts/Network';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { StakingContext } from 'contexts/Staking';
import { useTheme } from 'contexts/Themes';
import { useUi } from 'contexts/UI';
import { motion } from 'framer-motion';
import { Header, List, Wrapper as ListWrapper } from 'library/List';
import { MotionContainer } from 'library/List/MotionContainer';
import { Pagination } from 'library/List/Pagination';
import { SearchInput } from 'library/List/SearchInput';
import { Pool } from 'library/Pool';
import React, { useEffect, useRef, useState } from 'react';
import { networkColors } from 'theme/default';
import { PoolListProvider, usePoolList } from './context';
import { PoolListProps } from './types';

export const PoolListInner = ({
  allowMoreCols,
  pagination,
  batchKey = '',
  disableThrottle,
  allowSearch,
  pools,
  title,
}: PoolListProps) => {
  const { mode } = useTheme();
  const { isReady, network } = useApi();
  const { metrics } = useNetworkMetrics();
  const { fetchPoolsMetaBatch, poolSearchFilter } = useBondedPools();
  const { listFormat, setListFormat } = usePoolList();
  const { isSyncing } = useUi();

  // current page
  const [page, setPage] = useState<number>(1);

  // current render iteration
  const [renderIteration, _setRenderIteration] = useState<number>(1);

  // default list of pools
  const [poolsDefault, setPoolsDefault] = useState(pools);

  // manipulated list (ordering, filtering) of pools
  const [_pools, _setPools] = useState(pools);

  // is this the initial fetch
  const [fetched, setFetched] = useState<boolean>(false);

  // render throttle iteration
  const renderIterationRef = useRef(renderIteration);
  const setRenderIteration = (iter: number) => {
    renderIterationRef.current = iter;
    _setRenderIteration(iter);
  };

  // pagination
  const totalPages = Math.ceil(_pools.length / ListItemsPerPage);
  const pageEnd = page * ListItemsPerPage - 1;
  const pageStart = pageEnd - (ListItemsPerPage - 1);

  // render batch
  const batchEnd = renderIteration * ListItemsPerBatch - 1;

  // refetch list when pool list changes
  useEffect(() => {
    if (pools !== poolsDefault) {
      setFetched(false);
    }
  }, [pools]);

  // configure pool list when network is ready to fetch
  useEffect(() => {
    if (isReady && metrics.activeEra.index !== 0 && !fetched) {
      setupPoolList();
    }
  }, [isReady, fetched, metrics.activeEra.index]);

  // handle pool list bootstrapping
  const setupPoolList = () => {
    setPoolsDefault(pools);
    _setPools(pools);
    setFetched(true);
    fetchPoolsMetaBatch(batchKey, pools, true);
  };

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
    listPools = _pools.slice(pageStart).slice(0, ListItemsPerPage);
  } else {
    listPools = _pools;
  }

  const handleSearchChange = (e: React.FormEvent<HTMLInputElement>) => {
    const newValue = e.currentTarget.value;

    let filteredPools = Object.assign(poolsDefault);
    filteredPools = poolSearchFilter(filteredPools, batchKey, newValue);

    // ensure no duplicates
    filteredPools = filteredPools.filter(
      (value: any, index: any, self: any) =>
        index === self.findIndex((t: any) => t.id === value.id)
    );

    setPage(1);
    setRenderIteration(1);
    _setPools(filteredPools);
  };

  return (
    <ListWrapper>
      <Header>
        <div>
          <h4>{title}</h4>
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
        {allowSearch && poolsDefault.length > 0 && (
          <SearchInput
            handleChange={handleSearchChange}
            placeholder="Search Pool ID, Name or Address"
          />
        )}
        {pagination && listPools.length > 0 && (
          <Pagination page={page} total={totalPages} setter={setPage} />
        )}
        <MotionContainer>
          {listPools.length ? (
            <>
              {listPools.map((pool: any, index: number) => {
                // fetch batch data by referring to default list index.
                const batchIndex = poolsDefault.indexOf(pool);

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
                    <Pool
                      pool={pool}
                      batchKey={batchKey}
                      batchIndex={batchIndex}
                    />
                  </motion.div>
                );
              })}
            </>
          ) : (
            <h4 style={{ padding: '1rem 1rem 0 1rem' }}>
              {isSyncing
                ? 'Syncing Pool list...'
                : 'No pools match this criteria.'}
            </h4>
          )}
        </MotionContainer>
      </List>
    </ListWrapper>
  );
};

export const PoolList = (props: any) => {
  return (
    <PoolListProvider>
      <PoolListShouldUpdate {...props} />
    </PoolListProvider>
  );
};

export class PoolListShouldUpdate extends React.Component<any, any> {
  static contextType = StakingContext;

  shouldComponentUpdate(nextProps: PoolListProps) {
    return this.props.pools !== nextProps.pools;
  }

  render() {
    return <PoolListInner {...this.props} />;
  }
}

export default PoolList;
