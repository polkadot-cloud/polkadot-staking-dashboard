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
import { FavoritesPrompt } from 'overlay/canvas/ManageNominations/Prompts/FavoritesPrompt'
import { Subheading } from 'pages/Nominate/Wrappers'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ButtonMonoInvert, ButtonPrimaryInvert } from 'ui-buttons'
import { Methods } from './Methods'
import type { AddNominationsType, GenerateNominationsProps } from './types'
import { useFetchMehods } from './useFetchMethods'
import { Wrapper } from './Wrapper'

export const GenerateNominations = ({
  setters = [],
  nominations: defaultNominations,
  displayFor = 'default',
}: GenerateNominationsProps) => {
  const { t } = useTranslation('app')
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

  // Store the currently selected set of nominations
  const [nominations, setNominations] = useState<Validator[]>(
    defaultNominations.nominations
  )

  // Store the height of the container
  const [height, setHeight] = useState<number | null>(null)

  // Ref for the height of the container
  const heightRef = useRef<HTMLDivElement>(null)

  // Update nominations on account switch, or if `defaultNominations` change.
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

  const disabledMaxNominations = () =>
    maxNominations.isLessThanOrEqualTo(nominations?.length)
  const disabledAddFavorites = () =>
    !favoritesList?.length ||
    maxNominations.isLessThanOrEqualTo(nominations?.length)

  // Accumulate actions
  const actions = [
    {
      title: t('addFromFavorites'),
      onClick: () => () => {
        const updateList = (newNominations: Validator[]) => {
          setNominations([...newNominations])
          updateSetters(newNominations)
          closePrompt()
        }
        openPromptWith(
          <FavoritesPrompt callback={updateList} nominations={nominations} />
        )
      },
      onSelected: false,
      isDisabled: disabledAddFavorites,
    },
    {
      title: `${t('removeSelected')}`,
      onClick: ({
        selected,
        resetSelected,
      }: {
        selected: AnyJson
        resetSelected: AnyFunction
      }) => {
        const newNominations = [...nominations].filter(
          (n) =>
            !selected
              .map(({ address }: { address: string }) => address)
              .includes(n.address)
        )
        setNominations([...newNominations])
        updateSetters([...newNominations])
        resetSelected()
      },
      onSelected: true,
      isDisabled: () => false,
    },
    {
      title: t('highPerformanceValidator'),
      onClick: () => addNominationByType('High Performance Validator'),
      onSelected: false,
      icon: faPlus,
      isDisabled: () =>
        disabledMaxNominations() ||
        !availableToNominate(nominations).highPerformance.length,
    },
    {
      title: t('activeValidator'),
      onClick: () => addNominationByType('Active Validator'),
      onSelected: false,
      icon: faPlus,
      isDisabled: () =>
        disabledMaxNominations() ||
        !availableToNominate(nominations).activeValidators.length,
    },
    {
      title: t('randomValidator'),
      onClick: () => addNominationByType('Random Validator'),
      onSelected: false,
      icon: faPlus,
      isDisabled: () =>
        disabledMaxNominations() ||
        !availableToNominate(nominations).randomValidators.length,
    },
  ]

  // Determine button style depending on in canvas.
  const ButtonType =
    displayFor === 'canvas' ? ButtonPrimaryInvert : ButtonMonoInvert

  return (
    <>
      {method && (
        <SelectableWrapper>
          <ButtonType
            text={t('backToMethods')}
            iconLeft={faChevronLeft}
            iconTransform="shrink-2"
            onClick={() => {
              setMethod(null)
              setNominations([])
              updateSetters([])
            }}
            marginRight
          />
          {['Active Low Commission', 'Optimal Selection'].includes(
            method || ''
          ) && (
            <ButtonType
              text={t('reGenerate')}
              onClick={() => {
                // set a temporary height to prevent height snapping on re-renders.
                setHeight(heightRef.current?.clientHeight || null)
                setTimeout(() => setHeight(null), 200)
                setFetching(true)
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
              <div
                ref={heightRef}
                style={{
                  width: '100%',
                }}
              >
                <ValidatorList
                  bondFor="nominator"
                  validators={nominations}
                  actions={actions}
                  allowMoreCols
                  allowListFormat={false}
                  displayFor={displayFor}
                  selectable
                />
              </div>
            )}
      </Wrapper>
    </>
  )
}
