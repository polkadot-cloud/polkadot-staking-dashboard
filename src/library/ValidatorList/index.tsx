// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faBars, faGripVertical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isNotZero } from '@polkadot-cloud/utils';
import { motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ListItemsPerBatch, ListItemsPerPage } from 'consts';
import { useApi } from 'contexts/Api';
import { useFilters } from 'contexts/Filters';
import { useNetworkMetrics } from 'contexts/NetworkMetrics';
import { useTheme } from 'contexts/Themes';
import { useUi } from 'contexts/UI';
import {
  FilterHeaderWrapper,
  List,
  Wrapper as ListWrapper,
} from 'library/List';
import { MotionContainer } from 'library/List/MotionContainer';
import { Pagination } from 'library/List/Pagination';
import { SearchInput } from 'library/List/SearchInput';
import { Selectable } from 'library/List/Selectable';
import { ValidatorItem } from 'library/ValidatorList/ValidatorItem';
import type { Validator } from 'contexts/Validators/types';
import { useOverlay } from '@polkadot-cloud/react/hooks';
import { useNetwork } from 'contexts/Network';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useValidators } from 'contexts/Validators/ValidatorEntries';
import { useNominationStatus } from 'library/Hooks/useNominationStatus';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { useValidatorFilters } from '../Hooks/useValidatorFilters';
import { ListProvider, useList } from '../List/context';
import type { ValidatorListProps } from './types';
import { FilterHeaders } from './Filters/FilterHeaders';
import { FilterBadges } from './Filters/FilterBadges';
import type { NominationStatus } from './ValidatorItem/types';

export const ValidatorListInner = ({
  nominator: initialNominator,
  validators: initialValidators,
  allowMoreCols,
  allowFilters,
  toggleFavorites,
  pagination,
  format,
  selectable,
  bondFor,
  onSelected,
  actions = [],
  showMenu = true,
  displayFor = 'default',
  allowSearch = false,
  allowListFormat = true,
  alwaysRefetchValidators = false,
  defaultOrder = undefined,
  defaultFilters = undefined,
  disableThrottle = false,
}: ValidatorListProps) => {
  const { t } = useTranslation('library');
  const {
    networkData: { colors },
  } = useNetwork();
  const {
    getFilters,
    setMultiFilters,
    getOrder,
    setOrder,
    getSearchTerm,
    setSearchTerm,
    resetFilters,
    resetOrder,
    clearSearchTerm,
  } = useFilters();
  const { mode } = useTheme();
  const { isReady } = useApi();
  const { isSyncing } = useUi();
  const listProvider = useList();
  const { activeEra } = useNetworkMetrics();
  const { activeAccount } = useActiveAccounts();
  const { setModalResize } = useOverlay().modal;
  const { injectValidatorListData } = useValidators();
  const { getNomineesStatus } = useNominationStatus();
  const { getPoolNominationStatus } = useBondedPools();
  const { applyFilter, applyOrder, applySearch } = useValidatorFilters();

  const { selected, listFormat, setListFormat } = listProvider;
  const includes = getFilters('include', 'validators');
  const excludes = getFilters('exclude', 'validators');
  const order = getOrder('validators');
  const searchTerm = getSearchTerm('validators');
  const actionsAll = [...actions].filter((action) => !action.onSelected);
  const actionsSelected = [...actions].filter((action) => action.onSelected);

  // Determine the nominator of the validator list. Fallback to activeAccount if not provided.
  const nominator = initialNominator || activeAccount;

  // Store the current nomination status of validator records relative to the supplied nominator.
  const nominationStatus = useRef<Record<string, NominationStatus>>({});

  // Get nomination status relative to supplied nominator, if `format` is `nomination`.
  const processNominationStatus = () => {
    if (format === 'nomination')
      if (bondFor === 'pool') {
        nominationStatus.current = Object.fromEntries(
          initialValidators.map(({ address }) => [
            address,
            getPoolNominationStatus(nominator, address),
          ])
        );
      } else {
        // get all active account's nominations.
        const nominationStatuses = getNomineesStatus(nominator, 'nominator');

        // find the nominator status within the returned nominations.
        nominationStatus.current = Object.fromEntries(
          initialValidators.map(({ address }) => [
            address,
            nominationStatuses[address],
          ])
        );
      }
  };

  // Injects status into supplied initial validators.
  const prepareInitialValidators = () => {
    processNominationStatus();
    const statusToIndex = {
      active: 2,
      inactive: 1,
      waiting: 0,
    };
    return injectValidatorListData(initialValidators).sort(
      (a, b) =>
        statusToIndex[nominationStatus.current[b.address]] -
        statusToIndex[nominationStatus.current[a.address]]
    );
  };

  // Current page.
  const [page, setPage] = useState<number>(1);

  // Default list of validators.
  const [validatorsDefault, setValidatorsDefault] = useState(
    prepareInitialValidators()
  );

  // Manipulated list (custom ordering, filtering) of validators.
  const [validators, setValidators] = useState(prepareInitialValidators());

  // Store whether the validator list has been fetched initially.
  const [fetched, setFetched] = useState(false);

  // Store whether the search bar is being used.
  const [isSearching, setIsSearching] = useState(false);

  // Current render iteration.
  const [renderIteration, setRenderIterationState] = useState<number>(1);

  // Render throttle iteration.
  const renderIterationRef = useRef(renderIteration);
  const setRenderIteration = (iter: number) => {
    renderIterationRef.current = iter;
    setRenderIterationState(iter);
  };

  // Pagination.
  const totalPages = Math.ceil(validators.length / ListItemsPerPage);
  const pageEnd = page * ListItemsPerPage - 1;
  const pageStart = pageEnd - (ListItemsPerPage - 1);

  // Render batch.
  const batchEnd = Math.min(
    renderIteration * ListItemsPerBatch - 1,
    ListItemsPerPage
  );

  // Reset list when validator list changes.
  useEffect(() => {
    if (alwaysRefetchValidators) {
      if (
        JSON.stringify(initialValidators.map((v) => v.address)) !==
        JSON.stringify(validatorsDefault.map((v) => v.address))
      ) {
        setFetched(false);
      }
    } else {
      setFetched(false);
    }
  }, [initialValidators, nominator]);

  // handle filter / order update
  const handleValidatorsFilterUpdate = (
    filteredValidators = Object.assign(validatorsDefault)
  ) => {
    if (allowFilters) {
      if (order !== 'default') {
        filteredValidators = applyOrder(order, filteredValidators);
      }
      filteredValidators = applyFilter(includes, excludes, filteredValidators);
      if (searchTerm) {
        filteredValidators = applySearch(filteredValidators, searchTerm);
      }
      setValidators(filteredValidators);
      setPage(1);
      setRenderIteration(1);
    }
  };

  // get throttled subset or entire list
  const listValidators = disableThrottle
    ? validators
    : validators.slice(pageStart).slice(0, ListItemsPerPage);

  // if in modal, handle resize
  const maybeHandleModalResize = () => {
    if (displayFor === 'modal') setModalResize();
  };

  const handleSearchChange = (e: React.FormEvent<HTMLInputElement>) => {
    const newValue = e.currentTarget.value;

    let filteredValidators = Object.assign(validatorsDefault);
    if (order !== 'default') {
      filteredValidators = applyOrder(order, filteredValidators);
    }
    filteredValidators = applyFilter(includes, excludes, filteredValidators);
    filteredValidators = applySearch(filteredValidators, newValue);

    // ensure no duplicates
    filteredValidators = filteredValidators.filter(
      (value: Validator, index: number, self: Validator[]) =>
        index === self.findIndex((i) => i.address === value.address)
    );

    setValidators(filteredValidators);
    setPage(1);
    setIsSearching(e.currentTarget.value !== '');
    setRenderIteration(1);
    setSearchTerm('validators', newValue);
  };

  // Set default filters.
  useEffect(() => {
    if (allowFilters) {
      if (defaultFilters?.includes?.length) {
        setMultiFilters(
          'include',
          'validators',
          defaultFilters?.includes,
          false
        );
      }
      if (defaultFilters?.excludes?.length) {
        setMultiFilters(
          'exclude',
          'validators',
          defaultFilters?.excludes,
          false
        );
      }

      if (defaultOrder) {
        setOrder('validators', defaultOrder);
      }
    }
    return () => {
      if (allowFilters) {
        resetFilters('exclude', 'validators');
        resetFilters('include', 'validators');
        resetOrder('validators');
        clearSearchTerm('validators');
      }
    };
  }, []);

  // Handle validator list bootstrapping.
  const setupValidatorList = () => {
    setValidatorsDefault(prepareInitialValidators());
    setValidators(prepareInitialValidators());
    setFetched(true);
  };

  // Configure validator list when network is ready to fetch.
  useEffect(() => {
    if (isReady && isNotZero(activeEra.index) && !fetched) setupValidatorList();
  }, [isReady, activeEra.index, fetched]);

  // Control render throttle.
  useEffect(() => {
    if (!(batchEnd >= pageEnd || disableThrottle)) {
      setTimeout(() => {
        setRenderIteration(renderIterationRef.current + 1);
      }, 50);
    }
  }, [renderIterationRef.current]);

  // Trigger `onSelected` when selection changes.
  useEffect(() => {
    if (onSelected) onSelected(listProvider);
  }, [selected]);

  // List ui changes / validator changes trigger re-render of list.
  useEffect(() => {
    if (allowFilters && fetched) handleValidatorsFilterUpdate();
  }, [order, isSyncing, includes, excludes]);

  // Handle modal resize on list format change.
  useEffect(() => {
    maybeHandleModalResize();
  }, [listFormat, renderIteration, validators, page]);

  return (
    <ListWrapper>
      <List $flexBasisLarge={allowMoreCols ? '33.33%' : '50%'}>
        {allowSearch && (
          <SearchInput
            handleChange={handleSearchChange}
            placeholder={t('searchAddress')}
          />
        )}
        <FilterHeaderWrapper>
          <div>{allowFilters && <FilterHeaders />}</div>
          <div>
            {allowListFormat === true && (
              <>
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
              </>
            )}
          </div>
        </FilterHeaderWrapper>
        {allowFilters && <FilterBadges />}

        {listValidators.length > 0 && pagination && (
          <Pagination page={page} total={totalPages} setter={setPage} />
        )}

        {selectable ? (
          <Selectable
            canSelect={listValidators.length > 0}
            actionsAll={actionsAll}
            actionsSelected={actionsSelected}
            displayFor={displayFor}
          />
        ) : null}

        <MotionContainer>
          {listValidators.length ? (
            <>
              {listValidators.map((validator, index) => (
                <motion.div
                  key={`nomination_${index}`}
                  className={`item ${listFormat === 'row' ? 'row' : 'col'}`}
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
                  <ValidatorItem
                    validator={validator}
                    nominator={nominator}
                    toggleFavorites={toggleFavorites}
                    format={format}
                    showMenu={showMenu}
                    bondFor={bondFor}
                    displayFor={displayFor}
                    nominationStatus={
                      nominationStatus.current[validator.address]
                    }
                  />
                </motion.div>
              ))}
            </>
          ) : (
            <h4 style={{ marginTop: '1rem' }}>
              {isSearching ? t('noValidatorsMatch') : t('noValidators')}
            </h4>
          )}
        </MotionContainer>
      </List>
    </ListWrapper>
  );
};

export const ValidatorList = (props: ValidatorListProps) => {
  const { selectActive, selectToggleable } = props;
  return (
    <ListProvider
      selectActive={selectActive}
      selectToggleable={selectToggleable}
    >
      <ValidatorListInner {...props} />
    </ListProvider>
  );
};
