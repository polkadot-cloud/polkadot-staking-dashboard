// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faChevronLeft, faPlus } from '@fortawesome/free-solid-svg-icons'
import type { AnyFunction, AnyJson } from '@w3ux/types'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { usePrompt } from 'contexts/Prompt'
import { useStaking } from 'contexts/Staking'
import { useFavoriteValidators } from 'contexts/Validators/FavoriteValidators'
import type { Validator } from 'contexts/Validators/types'
import { useValidators } from 'contexts/Validators/ValidatorEntries'
import { SelectableWrapper } from 'library/List'
import { ValidatorList } from 'library/ValidatorList'
import { Subheading } from 'pages/Nominate/Wrappers'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ButtonPrimary, ButtonSecondary } from 'ui-buttons'
import { ListControls } from './ListControls'
import { Methods } from './Methods'
import { Confirm } from './Popovers/Confirm'
import { SelectFavorites } from './Prompts/SelectFavorites'
import { Revert } from './Revert'
import type {
  AddNominationsType,
  GenerateNominationsProps,
  SelectHandler,
} from './types'
import { useFetchMehods } from './useFetchMethods'
import { Wrapper } from './Wrapper'

export const GenerateNominations = ({
  setters = [],
  nominations: defaultNominations,
  displayFor = 'default',
  allowRevert = false,
}: GenerateNominationsProps) => {
  const { t } = useTranslation()
  const { isReady, consts } = useApi()
  const { stakers } = useStaking().eraStakers
  const { activeAccount } = useActiveAccounts()
  const { favoritesList } = useFavoriteValidators()
  const { openPromptWith, closePrompt } = usePrompt()
  const { isReadOnlyAccount } = useImportedAccounts()
  const { getValidators, validatorsFetched } = useValidators()
  const {
    fetch: fetchFromMethod,
    add: addNomination,
    available: availableToNominate,
  } = useFetchMehods()
  const { maxNominations } = consts
  const defaultNominationsCount = defaultNominations.nominations?.length || 0

  // Store the method of fetching validators
  const [method, setMethod] = useState<string | null>(
    defaultNominationsCount ? 'Manual' : null
  )

  // Store whether validators are being fetched
  const [fetching, setFetching] = useState<boolean>(false)

  // Store the initial nominations
  const [initialNominations] = useState<Validator[]>(
    defaultNominations.nominations
  )

  // Store the currently selected set of nominations
  const [nominations, setNominations] = useState<Validator[]>(
    defaultNominations.nominations
  )

  // Store the height of the container
  const [height, setHeight] = useState<number | null>(null)

  // Ref for the height of the container
  const heightRef = useRef<HTMLDivElement>(null)

  const resizeCallback = () => {
    setHeight(null)
  }

  // Fetch nominations based on method
  const fetchNominationsForMethod = () => {
    if (method) {
      const newNominations = fetchFromMethod(method)
      setNominations([...newNominations])
      setFetching(false)
      updateSetters(newNominations)
    }
  }

  // Add nominations based on method
  const addNominationByType = (type: AddNominationsType) => {
    if (method) {
      const newNominations = addNomination(nominations, type)
      setNominations([...newNominations])
      updateSetters([...newNominations])
    }
  }

  const updateSetters = (newNominations: Validator[]) => {
    for (const { current, set } of setters) {
      const currentValue = current?.callable ? current.fn() : current
      set({
        ...currentValue,
        nominations: newNominations,
      })
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
          updateSetters([...newNominations])
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
          updateSetters(newNominations)
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

  // Determine button style depending on in canvas
  const ButtonType = displayFor === 'canvas' ? ButtonPrimary : ButtonSecondary

  // Update nominations on account switch, or if `defaultNominations` change
  useEffect(() => {
    if (
      JSON.stringify(nominations) !==
        JSON.stringify(defaultNominations.nominations) &&
      defaultNominationsCount > 0
    ) {
      setNominations([...(defaultNominations.nominations || [])])
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
    <>
      {method && (
        <SelectableWrapper>
          <ButtonType
            text={t('startAgain', { ns: 'app' })}
            iconLeft={faChevronLeft}
            iconTransform="shrink-2"
            onClick={() => {
              setMethod(null)
              setNominations([])
              updateSetters([])
            }}
            style={{ marginRight: '1rem' }}
          />
          {['Active Low Commission', 'Optimal Selection'].includes(method) && (
            <ButtonType
              text={t('reGenerate', { ns: 'app' })}
              onClick={() => {
                // Set a temporary height to prevent height snapping on re-renders
                setHeight(heightRef.current?.clientHeight || null)
                setTimeout(() => setHeight(null), 200)
                setFetching(true)
              }}
              style={{ marginRight: '1rem' }}
              marginRight
            />
          )}
          {allowRevert && (
            <Revert
              disabled={
                JSON.stringify(nominations) ===
                JSON.stringify(initialNominations)
              }
              onClick={() => {
                updateSetters(initialNominations)
                setNominations(initialNominations)
              }}
            />
          )}
        </SelectableWrapper>
      )}
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
                  onRemove={
                    selectHandlers?.['removeSelected']?.popover.callback
                  }
                />
              </div>
            )}
      </Wrapper>
    </>
  )
}
