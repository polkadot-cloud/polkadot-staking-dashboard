// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  faChevronLeft,
  faMagnifyingGlass,
  faPlus,
} from '@fortawesome/free-solid-svg-icons'
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
import { Selectable } from 'library/List/Selectable'
import { ValidatorList } from 'library/ValidatorList'
import { FavoritesPrompt } from 'overlay/canvas/ManageNominations/Prompts/FavoritesPrompt'
import { RevertPrompt } from 'overlay/canvas/ManageNominations/Prompts/RevertPrompt'
import { SearchValidatorsPrompt } from 'overlay/canvas/ManageNominations/Prompts/SearchValidatorsPrompt'
import { Subheading } from 'pages/Nominate/Wrappers'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ButtonSecondary, ButtonText } from 'ui-buttons'
import { Methods } from './Methods'
import type { AddNominationsType, GenerateNominationsProps } from './types'
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
  const selectHandlers = {
    removeSelected: {
      title: `${t('removeSelected', { ns: 'app' })}`,
      onClick: ({
        selected,
        resetSelected,
      }: {
        selected: AnyJson
        resetSelected?: AnyFunction
      }) => {
        const newNominations = [...nominations].filter(
          (n) =>
            !selected
              .map(({ address }: { address: string }) => address)
              .includes(n.address)
        )
        setNominations([...newNominations])
        updateSetters([...newNominations])
        if (typeof resetSelected === 'function') {
          resetSelected()
        }
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
          <FavoritesPrompt callback={updateList} nominations={nominations} />,
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
    searchValidators: {
      title: 'Search Validators',
      onClick: () => {
        const updateList = (newNominations: Validator[]) => {
          setNominations([...newNominations])
          updateSetters(newNominations)
          closePrompt()
        }
        openPromptWith(
          <SearchValidatorsPrompt
            callback={updateList}
            nominations={nominations}
          />,
          'lg'
        )
      },
      icon: faMagnifyingGlass,
      onSelected: false,
      isDisabled: () => maxNominations.isLessThanOrEqualTo(nominations?.length),
    },
  }

  // Determine button style depending on in canvas
  const ButtonType = displayFor === 'canvas' ? ButtonText : ButtonSecondary

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
            style={{ color: 'var(--accent-color-primary' }}
            text={t('startAgain', { ns: 'app' })}
            iconLeft={faChevronLeft}
            iconTransform="shrink-2"
            onClick={() => {
              setMethod(null)
              setNominations([])
              updateSetters([])
            }}
            marginRight
          />
          {['Active Low Commission', 'Optimal Selection'].includes(method) && (
            <ButtonType
              style={{ color: 'var(--accent-color-primary' }}
              text={t('reGenerate', { ns: 'app' })}
              onClick={() => {
                // Set a temporary height to prevent height snapping on re-renders
                setHeight(heightRef.current?.clientHeight || null)
                setTimeout(() => setHeight(null), 200)
                setFetching(true)
              }}
              marginRight
            />
          )}
          {allowRevert && (
            <ButtonType
              style={{ color: 'var(--accent-color-primary' }}
              text={t('revertChanges', { ns: 'modals' })}
              onClick={() => {
                openPromptWith(
                  <RevertPrompt
                    onRevert={() => {
                      updateSetters(initialNominations)
                      setNominations(initialNominations)
                      closePrompt()
                    }}
                  />
                )
              }}
              disabled={nominations === initialNominations}
              marginRight
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
                    <Selectable
                      selectHandlers={Object.values(selectHandlers)}
                      filterHandlers={Object.values(filterHandlers)}
                      displayFor={displayFor}
                    />
                  }
                  onRemove={selectHandlers?.['removeSelected']?.onClick}
                />
              </div>
            )}
      </Wrapper>
    </>
  )
}
