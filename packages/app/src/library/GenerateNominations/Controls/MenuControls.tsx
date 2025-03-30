// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyFunction } from '@w3ux/types'
import { useManageNominations } from 'contexts/ManageNominations'
import { useTranslation } from 'react-i18next'
import { ButtonMenu } from 'ui-buttons'
import { Revert } from '../Revert'
import { MenuWrapper } from './Wrappers'

export const MenuControls = ({
  setters,
  allowRevert,
}: {
  setters: AnyFunction[]
  allowRevert: boolean
}) => {
  const { t } = useTranslation()

  const {
    method,
    setMethod,
    nominations,
    updateSetters,
    setNominations,
    resetNominations,
    revertNominations,
    defaultNominations,
  } = useManageNominations()

  return (
    <MenuWrapper>
      {method && (
        <>
          <ButtonMenu
            text={t('startAgain', { ns: 'app' })}
            onClick={() => resetNominations(setters)}
          />
          {['Active Low Commission', 'Optimal Selection'].includes(method) && (
            <ButtonMenu
              text={t('reGenerate', { ns: 'app' })}
              onClick={() => revertNominations()}
            />
          )}
        </>
      )}
      {allowRevert && (
        <Revert
          inMenu
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
    </MenuWrapper>
  )
}
