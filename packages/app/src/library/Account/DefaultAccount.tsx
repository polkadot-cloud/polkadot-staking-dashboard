// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faGlasses } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Polkicon } from '@w3ux/react-polkicon'
import { ellipsisFn } from '@w3ux/utils'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Wrapper } from './Wrapper'
import type { AccountProps } from './types'

const DefaultAccount = ({ value, readOnly }: AccountProps) => {
  const { t } = useTranslation('app')
  const { getAccount } = useImportedAccounts()

  // Determine account display text. Title takes precedence over value.
  const text: string | null =
    value === null
      ? null
      : value !== ''
        ? getAccount(value)?.name || ellipsisFn(value)
        : ellipsisFn(value)

  return (
    <Wrapper>
      {readOnly && (
        <div className="account-label">
          <FontAwesomeIcon icon={faGlasses} />
        </div>
      )}
      {text === null ? (
        <span className="title unassigned">{t('notStaking')}</span>
      ) : (
        <>
          <Polkicon address={value || ''} transform="grow-3" />
          <span className="title">{text}</span>
        </>
      )}
    </Wrapper>
  )
}

export default memo(DefaultAccount)
