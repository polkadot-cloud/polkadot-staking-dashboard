// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faBars, faGripVertical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import type { FormEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { listItemsPerPage } from 'library/List/defaults';
import { useFilters } from 'contexts/Filters';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { useTheme } from 'contexts/Themes';
import { Tabs } from 'library/Filter/Tabs';
import { usePoolFilters } from 'hooks/usePoolFilters';
import {
  FilterHeaderWrapper,
  List,
  ListStatusHeader,
  Wrapper as ListWrapper,
} from 'library/List';
import { MotionContainer } from 'library/List/MotionContainer';
import { Pagination } from 'library/List/Pagination';
import { SearchInput } from 'library/List/SearchInput';
import { Pool } from 'library/Pool';
import { useNetwork } from 'contexts/Network';
import { usePoolList } from './context';
import type { PoolListProps } from './types';
import type { BondedPool } from 'contexts/Pools/BondedPools/types';
import { useSyncing } from 'hooks/useSyncing';
import { useValidators } from 'contexts/Validators/ValidatorEntries';
import { useApi } from 'contexts/Api';
import { useEffectIgnoreInitial } from '@w3ux/hooks';

export const PoolList = ({
  allowMoreCols,
  pagination,
  allowSearch,
  pools,
  allowListFormat = true,
}: PoolListProps) => {
  const { t } = useTranslation('library');
  const {
    network,
    networkData: { colors },
  } = useNetwork();
  const { mode } = useTheme();
  const { activeEra } = useApi();
  const { syncing } = useSyncing();
  const { applyFilter } = usePoolFilters();
  const { erasRewardPointsFetched } = useValidators();
  const { listFormat, setListFormat } = usePoolList();
  const { getFilters, getSearchTerm, setSearchTerm } = useFilters();
  const { poolSearchFilter, poolsNominations, bondedPools } = useBondedPools();

  const includes = getFilters('include', 'pools');
  const excludes = getFilters('exclude', 'pools');
  const searchTerm = getSearchTerm('pools');

  // Carry out filter of pool list.
  const filterPoolList = () => {
    let filteredPools = Object.assign(poolsDefault);
    filteredPools = applyFilter(includes, excludes, filteredPools);
    if (searchTerm) {
      filteredPools = poolSearchFilter(filteredPools, searchTerm);
    }
    return filteredPools;
  };

  // The current page of pool list.
  const [page, setPage] = useState<number>(1);

  // Default pool list items before filtering.
  const [poolsDefault, setPoolsDefault] = useState<BondedPool[]>(pools || []);

  // Manipulated pool list items after filtering.
  const [listPools, setListPools] = useState<BondedPool[]>(filterPoolList());

  // Whether this the initial render.
  const [synced, setSynced] = useState<boolean>(false);

  // pagination
  const totalPages = Math.ceil(listPools.length / listItemsPerPage);
  const pageEnd = page * listItemsPerPage - 1;
  const pageStart = pageEnd - (listItemsPerPage - 1);

  // get throttled subset or entire list
  const poolsToDisplay = listPools.slice(pageStart).slice(0, listItemsPerPage);

  // Handle resetting of pool list when provided pools change.
  const resetPoolList = () => {
    setPoolsDefault(pools || []);
    setListPools(pools || []);
    setSynced(true);
  };

  // handle filter / order update
  const handlePoolsFilterUpdate = () => {
    const filteredPools = filterPoolList();
    setListPools(filteredPools);
    setPage(1);
  };

  const handleSearchChange = (e: FormEvent<HTMLInputElement>) => {
    const newValue = e.currentTarget.value;
    let filteredPools: BondedPool[] = Object.assign(poolsDefault);
    filteredPools = applyFilter(includes, excludes, filteredPools);
    filteredPools = poolSearchFilter(filteredPools, newValue);

    // ensure no duplicates
    filteredPools = filteredPools.filter(
      (value, index: number, self) =>
        index === self.findIndex((i) => i.id === value.id)
    );
    setPage(1);
    setListPools(filteredPools);
    setSearchTerm('pools', newValue);
  };

  // Fetch pool performance data when list items or page changes. Requires `erasRewardPoints` and
  // `bondedPools` to be fetched.
  const fetchingPerformanceData = useRef<boolean>(false);

  useEffect(() => {
    if (erasRewardPointsFetched && bondedPools.length) {
      fetchingPerformanceData.current = true;
      console.log('Fetch pool performance data batch.', listPools.length, page);
      // TODO: replace with actual fetch call.
      setTimeout(() => (fetchingPerformanceData.current = false), 1000);
    }
  }, [JSON.stringify(listPools), page, erasRewardPointsFetched, bondedPools]);

  // Refetch list when pool list changes.
  useEffect(() => {
    if (JSON.stringify(pools) !== JSON.stringify(poolsDefault) && synced) {
      resetPoolList();
    }
  }, [JSON.stringify(pools)]);

  // List ui changes / validator changes trigger re-render of list.
  useEffect(() => {
    // only filter when pool nominations have been synced.
    if (!syncing && Object.keys(poolsNominations).length) {
      handlePoolsFilterUpdate();
    }
  }, [syncing, includes, excludes, Object.keys(poolsNominations).length]);

  // Scroll to top of the window on every filter.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [includes, excludes]);

  // Reset list on network change or active era change.
  useEffectIgnoreInitial(() => {
    resetPoolList();
  }, [network, activeEra.index.toString()]);

  return (
    <ListWrapper>
      <List $flexBasisLarge={allowMoreCols ? '33.33%' : '50%'}>
        {allowSearch && poolsDefault.length > 0 && (
          <SearchInput
            value={searchTerm ?? ''}
            handleChange={handleSearchChange}
            placeholder={t('search')}
          />
        )}
        <FilterHeaderWrapper>
          <div>
            <Tabs
              config={[
                {
                  label: t('all'),
                  includes: [],
                  excludes: [],
                },
                {
                  label: t('active'),
                  includes: ['active'],
                  excludes: ['locked', 'destroying'],
                },
                {
                  label: t('locked'),
                  includes: ['locked'],
                  excludes: [],
                },
                {
                  label: t('destroying'),
                  includes: ['destroying'],
                  excludes: [],
                },
              ]}
              activeIndex={1}
            />
          </div>
          <div>
            {allowListFormat && (
              <div>
                <button type="button" onClick={() => setListFormat('row')}>
                  <FontAwesomeIcon
                    icon={faBars}
                    color={
                      listFormat === 'row' ? colors.primary[mode] : 'inherit'
                    }
                  />
                </button>
                <button type="button" onClick={() => setListFormat('col')}>
                  <FontAwesomeIcon
                    icon={faGripVertical}
                    color={
                      listFormat === 'col' ? colors.primary[mode] : 'inherit'
                    }
                  />
                </button>
              </div>
            )}
          </div>
        </FilterHeaderWrapper>

        {pagination && poolsToDisplay.length > 0 && (
          <Pagination page={page} total={totalPages} setter={setPage} />
        )}
        <MotionContainer>
          {poolsToDisplay.length ? (
            <>
              {poolsToDisplay.map((pool, index: number) => (
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
                  <Pool pool={pool} />
                </motion.div>
              ))}
            </>
          ) : (
            <ListStatusHeader>
              {syncing ? `${t('syncingPoolList')}...` : t('noMatch')}
            </ListStatusHeader>
          )}
        </MotionContainer>
      </List>
    </ListWrapper>
  );
};
