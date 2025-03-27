// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faPlus } from '@fortawesome/free-solid-svg-icons'
import type { AnyFunction, AnyJson } from '@w3ux/types'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useManageNominations } from 'contexts/ManageNominations'
import { usePrompt } from 'contexts/Prompt'
import { useStaking } from 'contexts/Staking'
import { useFavoriteValidators } from 'contexts/Validators/FavoriteValidators'
import { useValidators } from 'contexts/Validators/ValidatorEntries'
import { ValidatorList } from 'library/ValidatorList'
import { Subheading } from 'pages/Nominate/Wrappers'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import type { Validator } from 'types'
import { ListControls } from './ListControls'
import { Methods } from './Methods'
import { Confirm } from './Popovers/Confirm'
import { SelectFavorites } from './Prompts/SelectFavorites'
import type {
  AddNominationsType,
  GenerateNominationsProps,
  SelectHandler,
} from './types'
import { useFetchMehods } from './useFetchMethods'
import { Wrapper } from './Wrapper'

export const GenerateNominations = ({
  setters = [],
  displayFor = 'default',
}: GenerateNominationsProps) => {
  const { t } = useTranslation()
  const {
    fetch: fetchFromMethod,
    add: addNomination,
    available: availableToNominate,
  } = useFetchMehods()
  const { isReady, consts } = useApi()
  const { stakers } = useStaking().eraStakers
  const { activeAccount } = useActiveAccounts()
  const { favoritesList } = useFavoriteValidators()
  const { openPromptWith, closePrompt } = usePrompt()
  const { isReadOnlyAccount } = useImportedAccounts()
  const { getValidators, validatorsFetched } = useValidators()
  const {
    method,
    height,
    fetching,
    setHeight,
    heightRef,
    setMethod,
    setFetching,
    nominations,
    updateSetters,
    setNominations,
    defaultNominations,
  } = useManageNominations()

  const defaultNominationsCount = defaultNominations.length
  const { maxNominations } = consts

  const resizeCallback = () => {
    setHeight(null)
  }

  // Fetch nominations based on method
  const fetchNominationsForMethod = () => {
    if (method) {
      const newNominations = fetchFromMethod(method)
      setNominations([...newNominations])
      setFetching(false)
      updateSetters(setters, newNominations)
    }
  }

  // Add nominations based on method
  const addNominationByType = (type: AddNominationsType) => {
    if (method) {
      const newNominations = addNomination(nominations, type)
      setNominations([...newNominations])
      updateSetters(setters, [...newNominations])
    }
  }

  const maxNominationsReached = maxNominations.isLessThanOrEqualTo(
    nominations?.length
  )

  // Define handlers
  const selectHandlers: Record<string, SelectHandler> = {
    removeSelected: {
      title: `${t('removeSelected', { ns: 'app' })}`,
      popover: {
        text: t('removeSelectedItems', { ns: 'app' }),
        node: Confirm,
        callback: ({
          selected,
          callback,
        }: {
          selected: AnyJson
          callback?: AnyFunction
        }) => {
          const newNominations = [...nominations].filter(
            (n) =>
              !selected
                .map(({ address }: { address: string }) => address)
                .includes(n.address)
          )
          setNominations([...newNominations])
          updateSetters(setters, [...newNominations])
          if (typeof callback === 'function') {
            callback()
          }
        },
      },
      onSelected: true,
      isDisabled: () => false,
    },
  }

  const filterHandlers = {
    addFromFavorites: {
      title: t('addFromFavorites', { ns: 'app' }),
      onClick: () => {
        const updateList = (newNominations: Validator[]) => {
          setNominations([...newNominations])
          updateSetters(setters, newNominations)
          closePrompt()
        }
        openPromptWith(
          <SelectFavorites callback={updateList} nominations={nominations} />,
          'lg'
        )
      },
      onSelected: false,
      isDisabled: () =>
        !favoritesList?.length ||
        maxNominations.isLessThanOrEqualTo(nominations?.length),
    },
    highPerformance: {
      title: t('highPerformanceValidator', { ns: 'app' }),
      onClick: () => addNominationByType('High Performance Validator'),
      onSelected: false,
      icon: faPlus,
      isDisabled: () =>
        maxNominationsReached ||
        !availableToNominate(nominations).highPerformance.length,
    },
    getActive: {
      title: t('activeValidator', { ns: 'app' }),
      onClick: () => addNominationByType('Active Validator'),
      onSelected: false,
      icon: faPlus,
      isDisabled: () =>
        maxNominationsReached ||
        !availableToNominate(nominations).activeValidators.length,
    },
    getRandom: {
      title: t('randomValidator', { ns: 'app' }),
      onClick: () => addNominationByType('Random Validator'),
      onSelected: false,
      icon: faPlus,
      isDisabled: () =>
        maxNominationsReached ||
        !availableToNominate(nominations).randomValidators.length,
    },
    // TODO: Enable feature in future PR
    // searchValidators: {
    //   title: 'Search Validators',
    //   onClick: () => {
    //     const updateList = (newNominations: Validator[]) => {
    //       setNominations([...newNominations])
    //       updateSetters(newNominations)
    //       closePrompt()
    //     }
    //     openPromptWith(
    //       <SearchValidators callback={updateList} nominations={nominations} />,
    //       'lg'
    //     )
    //   },
    //   icon: faMagnifyingGlass,
    //   onSelected: false,
    //   isDisabled: () => maxNominations.isLessThanOrEqualTo(nominations?.length),
    // },
  }

  // Update nominations on account switch, or if `defaultNominations` change
  useEffect(() => {
    if (
      JSON.stringify(nominations) !== JSON.stringify(defaultNominations) &&
      defaultNominationsCount > 0
    ) {
      setNominations([...(defaultNominations || [])])
      if (defaultNominationsCount) {
        setMethod('manual')
      }
    }
  }, [activeAccount, defaultNominations])

  // Refetch if fetching is triggered
  useEffect(() => {
    if (
      !isReady ||
      !getValidators()?.length ||
      !stakers?.length ||
      validatorsFetched !== 'synced'
    ) {
      return
    }

    if (fetching) {
      fetchNominationsForMethod()
    }
  })

  // Reset fixed height on window size change
  useEffect(() => {
    window.addEventListener('resize', resizeCallback)
    return () => {
      window.removeEventListener('resize', resizeCallback)
    }
  }, [])

  return (
    <Wrapper
      style={{
        height: height ? `${height}px` : 'auto',
        marginTop: method ? '1rem' : 0,
      }}
    >
      <div>
        {!isReadOnlyAccount(activeAccount) && !method && (
          <>
            <Subheading>
              <h4>
                {t('chooseValidators2', {
                  maxNominations: maxNominations.toString(),
                  ns: 'app',
                })}
              </h4>
            </Subheading>
            <Methods
              setMethod={setMethod}
              setNominations={setNominations}
              setFetching={setFetching}
              key="methods"
            />
          </>
        )}
      </div>
      {fetching
        ? null
        : isReady &&
          method !== null && (
            <div ref={heightRef}>
              <ValidatorList
                bondFor="nominator"
                validators={nominations}
                allowMoreCols
                allowListFormat={false}
                displayFor={displayFor}
                selectable
                ListControls={
                  <ListControls
                    selectHandlers={selectHandlers}
                    filterHandlers={Object.values(filterHandlers)}
                    displayFor={displayFor}
                  />
                }
                onRemove={selectHandlers?.['removeSelected']?.popover.callback}
              />
            </div>
          )}
    </Wrapper>
  )
}
