// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faBars, faGripVertical } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useFilters } from 'contexts/Filters'
import { useNetwork } from 'contexts/Network'
import { usePlugins } from 'contexts/Plugins'
import { useBondedPools } from 'contexts/Pools/BondedPools'
import { useTheme } from 'contexts/Themes'
import type { Validator, ValidatorListEntry } from 'contexts/Validators/types'
import { useValidators } from 'contexts/Validators/ValidatorEntries'
import { motion } from 'framer-motion'
import { useNominationStatus } from 'hooks/useNominationStatus'
import { useSyncing } from 'hooks/useSyncing'
import { FilterHeaderWrapper, List, Wrapper as ListWrapper } from 'library/List'
import { validatorsPerPage } from 'library/List/defaults'
import { MotionContainer } from 'library/List/MotionContainer'
import { Pagination } from 'library/List/Pagination'
import { SearchInput } from 'library/List/SearchInput'
import { Selectable } from 'library/List/Selectable'
import { ValidatorItem } from 'library/ValidatorList/ValidatorItem'
import { fetchValidatorEraPointsBatch } from 'plugin-staking-api'
import type { ValidatorEraPointsBatch } from 'plugin-staking-api/types'
import type { FormEvent } from 'react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useOverlay } from 'ui-overlay'
import { useValidatorFilters } from '../../hooks/useValidatorFilters'
import { ListProvider, useList } from '../List/context'
import { FilterBadges } from './Filters/FilterBadges'
import { FilterHeaders } from './Filters/FilterHeaders'
import type { ValidatorListProps } from './types'
import type { NominationStatus } from './ValidatorItem/types'

export const ValidatorListInner = ({
  // Default list values.
  nominator: initialNominator,
  validators: initialValidators,
  // Validator list config options.
  bondFor,
  allowMoreCols,
  allowFilters,
  toggleFavorites,
  pagination,
  format,
  selectable,
  onSelected,
  actions = [],
  showMenu = true,
  displayFor = 'default',
  allowSearch = false,
  allowListFormat = true,
  defaultOrder = undefined,
  defaultFilters = undefined,
}: ValidatorListProps) => {
  const { t } = useTranslation('library')
  const {
    networkData: { colors },
  } = useNetwork()
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
  } = useFilters()
  const { mode } = useTheme()
  const listProvider = useList()
  const { syncing } = useSyncing()
  const { network } = useNetwork()
  const { pluginEnabled } = usePlugins()
  const { activeAccount } = useActiveAccounts()
  const { setModalResize } = useOverlay().modal
  const { injectValidatorListData } = useValidators()
  const { getPoolNominationStatus } = useBondedPools()
  const { getNominationSetStatus } = useNominationStatus()
  const { isReady, activeEra, peopleApiStatus } = useApi()
  const { applyFilter, applyOrder, applySearch } = useValidatorFilters()

  const { selected, listFormat, setListFormat } = listProvider
  const includes = getFilters('include', 'validators')
  const excludes = getFilters('exclude', 'validators')
  const order = getOrder('validators')
  const searchTerm = getSearchTerm('validators')
  const actionsAll = [...actions].filter((action) => !action.onSelected)
  const actionsSelected = [...actions].filter((action) => action.onSelected)

  // Determine the nominator of the validator list. Fallback to activeAccount if not provided
  const nominator = initialNominator || activeAccount

  // Store the current nomination status of validator records relative to the supplied nominator
  const nominationStatus = useRef<Record<string, NominationStatus>>({})

  // Get nomination status relative to supplied nominator, if `format` is `nomination`
  const processNominationStatus = () => {
    if (format === 'nomination') {
      if (bondFor === 'pool') {
        nominationStatus.current = Object.fromEntries(
          initialValidators.map(({ address }) => [
            address,
            getPoolNominationStatus(nominator, address),
          ])
        )
      } else {
        // get all active account's nominations
        const nominationStatuses = getNominationSetStatus(
          nominator,
          'nominator'
        )

        // find the nominator status within the returned nominations
        nominationStatus.current = Object.fromEntries(
          initialValidators.map(({ address }) => [
            address,
            nominationStatuses[address],
          ])
        )
      }
    }
  }

  // Injects status into supplied initial validators
  const prepareInitialValidators = () => {
    processNominationStatus()
    const statusToIndex = {
      active: 2,
      inactive: 1,
      waiting: 0,
    }
    return injectValidatorListData(initialValidators).sort(
      (a, b) =>
        statusToIndex[nominationStatus.current[b.address]] -
        statusToIndex[nominationStatus.current[a.address]]
    )
  }

  // Current page
  const [page, setPage] = useState<number>(1)

  // Default list of validators
  const [validatorsDefault, setValidatorsDefault] = useState<
    ValidatorListEntry[]
  >(prepareInitialValidators())

  // Manipulated list (custom ordering, filtering) of validators
  const [validators, setValidators] = useState<ValidatorListEntry[]>(
    prepareInitialValidators()
  )

  // Store whether the validator list has been fetched initially
  const [fetched, setFetched] = useState<boolean>(false)

  // Store whether the search bar is being used
  const [isSearching, setIsSearching] = useState<boolean>(false)

  // Store performance data, keyed by address
  const [performances, setPerformances] = useState<ValidatorEraPointsBatch[]>(
    []
  )

  // Pagination
  const totalPages = Math.ceil(validators.length / validatorsPerPage)
  const pageEnd = page * validatorsPerPage - 1
  const pageStart = pageEnd - (validatorsPerPage - 1)

  // handle filter / order update
  const handleValidatorsFilterUpdate = (
    filteredValidators = Object.assign(validatorsDefault)
  ) => {
    if (allowFilters) {
      if (order !== 'default') {
        filteredValidators = applyOrder(order, filteredValidators)
      }
      filteredValidators = applyFilter(includes, excludes, filteredValidators)
      if (searchTerm) {
        filteredValidators = applySearch(filteredValidators, searchTerm)
      }
      setValidators(filteredValidators)
      setPage(1)
    }
  }

  // Get subset for page display
  const listItems = validators.slice(pageStart).slice(0, validatorsPerPage)
  // A unique key for the current page of items
  const pageKey =
    JSON.stringify(listItems.map(({ address }, i) => `${i}${address}`)) +
    JSON.stringify(includes) +
    JSON.stringify(excludes) +
    JSON.stringify(order) +
    JSON.stringify(searchTerm)

  // if in modal, handle resize
  const maybeHandleModalResize = () => {
    if (displayFor === 'modal') {
      setModalResize()
    }
  }

  const handleSearchChange = (e: FormEvent<HTMLInputElement>) => {
    const newValue = e.currentTarget.value

    let filteredValidators = Object.assign(validatorsDefault)
    if (order !== 'default') {
      filteredValidators = applyOrder(order, filteredValidators)
    }
    filteredValidators = applyFilter(includes, excludes, filteredValidators)
    filteredValidators = applySearch(filteredValidators, newValue)
    // Ensure no duplicates
    filteredValidators = filteredValidators.filter(
      (value: Validator, index: number, self: Validator[]) =>
        index === self.findIndex((i) => i.address === value.address)
    )
    setPage(1)
    setValidators(filteredValidators)
    setIsSearching(e.currentTarget.value !== '')
    setSearchTerm('validators', newValue)
  }

  // Handle validator list bootstrapping.
  const setupValidatorList = () => {
    setValidatorsDefault(prepareInitialValidators())
    setValidators(prepareInitialValidators())
    setFetched(true)
  }

  // Fetch performance data
  const getPerformanceData = async (key: string) => {
    if (!pluginEnabled('staking_api')) {
      return
    }
    // Delete stale performance data immediately
    setPerformances([])
    const results = await fetchValidatorEraPointsBatch(
      network,
      listItems.map(({ address }) => address),
      Math.max(activeEra.index.toNumber() - 1, 0),
      30
    )
    // Update performance if key still matches current page key
    if (key === pageKey) {
      setPerformances(results.validatorEraPointsBatch)
    }
  }

  // Set default filters. Should re-render if era stakers re-syncs as era points effect the
  // performance order
  useEffect(() => {
    if (allowFilters) {
      if (defaultFilters?.includes?.length) {
        setMultiFilters(
          'include',
          'validators',
          defaultFilters?.includes,
          false
        )
      }
      if (defaultFilters?.excludes?.length) {
        setMultiFilters(
          'exclude',
          'validators',
          defaultFilters?.excludes,
          false
        )
      }

      if (defaultOrder) {
        setOrder('validators', defaultOrder)
      }
    }
    return () => {
      if (allowFilters) {
        resetFilters('exclude', 'validators')
        resetFilters('include', 'validators')
        resetOrder('validators')
        clearSearchTerm('validators')
      }
    }
  }, [syncing])

  // Reset list when validator list changes
  useEffect(() => {
    setFetched(false)
  }, [initialValidators, nominator])

  // Fetch performance queries when validator list changes
  useEffect(() => {
    getPerformanceData(pageKey)
  }, [pageKey])

  // Configure validator list when network is ready to fetch
  useEffect(() => {
    if (isReady && !activeEra.index.isZero()) {
      setupValidatorList()
    }
  }, [isReady, activeEra.index, syncing, fetched])

  // Trigger `onSelected` when selection changes
  useEffect(() => {
    if (onSelected) {
      onSelected(listProvider)
    }
  }, [selected])

  // List ui changes / validator changes trigger re-render of list
  useEffect(() => {
    if (allowFilters && fetched) {
      handleValidatorsFilterUpdate()
    }
  }, [order, syncing, includes, excludes, peopleApiStatus])

  // Handle modal resize on list format change
  useEffect(() => {
    maybeHandleModalResize()
  }, [listFormat, validators, page])

  return (
    <ListWrapper>
      <List $flexBasisLarge={allowMoreCols ? '33.33%' : '50%'}>
        {allowSearch && (
          <SearchInput
            value={searchTerm ?? ''}
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

        {listItems.length > 0 && pagination && (
          <Pagination page={page} total={totalPages} setter={setPage} />
        )}

        {selectable ? (
          <Selectable
            canSelect={listItems.length > 0}
            actionsAll={actionsAll}
            actionsSelected={actionsSelected}
            displayFor={displayFor}
          />
        ) : null}

        <MotionContainer>
          {listItems.length ? (
            <>
              {listItems.map((validator, index) => (
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
                    eraPoints={
                      performances.find(
                        (entry) => entry.validator === validator.address
                      )?.points || []
                    }
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
  )
}

export const ValidatorList = (props: ValidatorListProps) => {
  const { selectActive, selectToggleable } = props
  return (
    <ListProvider
      selectActive={selectActive}
      selectToggleable={selectToggleable}
    >
      <ValidatorListInner {...props} />
    </ListProvider>
  )
}
