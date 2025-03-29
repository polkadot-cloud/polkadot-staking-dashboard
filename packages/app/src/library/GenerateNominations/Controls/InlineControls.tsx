// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import type { AnyFunction, DisplayFor } from '@w3ux/types'
import { useManageNominations } from 'contexts/ManageNominations'
import { SelectableWrapper } from 'library/List'
import { useTranslation } from 'react-i18next'
import { ButtonPrimary, ButtonSecondary } from 'ui-buttons'
import { Revert } from '../Revert'

export const InlineControls = ({
  setters,
  displayFor,
  allowRevert,
}: {
  setters: AnyFunction[]
  displayFor: DisplayFor
  allowRevert: boolean
}) => {
  const { t } = useTranslation()

  const {
    method,
    setHeight,
    heightRef,
    setMethod,
    nominations,
    setFetching,
    updateSetters,
    setNominations,
    defaultNominations,
  } = useManageNominations()

  // Determine button style depending on in canvas
  const ButtonType = displayFor === 'canvas' ? ButtonPrimary : ButtonSecondary

  return (
    <SelectableWrapper>
      {method && (
        <>
          <ButtonType
            text={t('startAgain', { ns: 'app' })}
            iconLeft={faChevronLeft}
            iconTransform="shrink-2"
            onClick={() => {
              setMethod(null)
              setNominations([])
              updateSetters(setters, [])
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
            />
          )}
        </>
      )}
      {allowRevert && (
        <Revert
          disabled={
            JSON.stringify(nominations) === JSON.stringify(defaultNominations)
          }
          onClick={() => {
            setMethod('manual')
            updateSetters(setters, defaultNominations)
            setNominations(defaultNominations)
          }}
        />
      )}
    </SelectableWrapper>
  )
}
