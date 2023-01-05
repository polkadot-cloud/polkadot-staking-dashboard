// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faBars, faGripVertical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ListItemsPerBatch, ListItemsPerPage } from 'consts';
import { useApi } from 'contexts/Api';
import { useFilters } from 'contexts/Filters';
import { useNetworkMetrics } from 'contexts/Network';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { StakingContext } from 'contexts/Staking';
import { useTheme } from 'contexts/Themes';
import { useUi } from 'contexts/UI';
import { motion } from 'framer-motion';
import { Tabs } from 'library/Filter/Tabs';
import { usePoolFilters } from 'library/Hooks/usePoolFilters';
import { Header, List, Wrapper as ListWrapper } from 'library/List';
import { MotionContainer } from 'library/List/MotionContainer';
import { Pagination } from 'library/List/Pagination';
import { SearchInput } from 'library/List/SearchInput';
import { Pool } from 'library/Pool';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  defaultFilters,
}: PoolListProps) => {
  const { mode } = useTheme();
  const { isReady, network } = useApi();
  const { metrics } = useNetworkMetrics();
  const { fetchPoolsMetaBatch, poolSearchFilter, meta } = useBondedPools();
  const { listFormat, setListFormat } = usePoolList();
  const { isSyncing } = useUi();
  const { t } = useTranslation('library');

  const { getFilters, setMultiFilters, getSearchTerm, setSearchTerm } =
    useFilters();
  const { applyFilter } = usePoolFilters();
  const includes = getFilters('include', 'pools');
  const excludes = getFilters('exclude', 'pools');
  const searchTerm = getSearchTerm('pools');

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

  // list ui changes / validator changes trigger re-render of list
  useEffect(() => {
    // only filter when pool nominations have been synced.
    if (!isSyncing && meta[batchKey]?.nominations) {
      handlePoolsFilterUpdate();
    }
  }, [isSyncing, includes, excludes, meta]);

  // scroll to top of the window on every filter.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [includes, excludes]);

  // set default filters
  useEffect(() => {
    if (defaultFilters?.includes?.length) {
      setMultiFilters('include', 'pools', defaultFilters?.includes, false);
    }
    if (defaultFilters?.excludes?.length) {
      setMultiFilters('exclude', 'pools', defaultFilters?.excludes, false);
    }
  }, []);

  // handle filter / order update
  const handlePoolsFilterUpdate = (
    filteredPools: any = Object.assign(poolsDefault)
  ) => {
    filteredPools = applyFilter(includes, excludes, filteredPools, batchKey);
    if (searchTerm) {
      filteredPools = poolSearchFilter(filteredPools, batchKey, searchTerm);
    }
    _setPools(filteredPools);
    setPage(1);
    setRenderIteration(1);
  };

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
    filteredPools = applyFilter(includes, excludes, filteredPools, batchKey);
    filteredPools = poolSearchFilter(filteredPools, batchKey, newValue);

    // ensure no duplicates
    filteredPools = filteredPools.filter(
      (value: any, index: any, self: any) =>
        index === self.findIndex((i: any) => i.id === value.id)
    );

    setPage(1);
    setRenderIteration(1);
    _setPools(filteredPools);
    setSearchTerm('pools', newValue);
  };

  const filterTabsConfig = [
    {
      label: 'Active',
      includes: ['active'],
      excludes: ['locked', 'destroying'],
    },
    {
      label: 'Locked',
      includes: ['locked'],
      excludes: [],
    },
    {
      label: 'Destroying',
      includes: ['destroying'],
      excludes: [],
    },
  ];

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
            placeholder={t('search')}
          />
        )}
        <Tabs config={filterTabsConfig} activeIndex={0} />
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
              {isSyncing ? `${t('syncingPoolList')}...` : t('noMatch')}
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
