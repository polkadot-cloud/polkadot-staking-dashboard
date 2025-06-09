// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faGlasses } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Polkicon } from '@w3ux/react-polkicon'
import { ellipsisFn } from '@w3ux/utils'
import classNames from 'classnames'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import classes from './index.module.scss'
import type { AccountProps } from './types'

const DefaultAccount = ({
  value,
  readOnly,
  onClick,
  className,
}: AccountProps) => {
  const { t } = useTranslation('app')
  const { getAccount } = useImportedAccounts()

  // Determine account display text. Title takes precedence over value.
  const text: string | null =
    value === null
      ? null
      : value !== ''
        ? getAccount(value)?.name || ellipsisFn(value)
        : ellipsisFn(value)

  const titleClasses = classNames('title', {
    unassigned: text === null,
  })

  return (
    <div onClick={onClick} className={classNames(classes.wrapper, className)}>
      {readOnly && (
        <div className={classes.accountLabel}>
          <FontAwesomeIcon icon={faGlasses} />
        </div>
      )}
      {text === null ? (
        <span className={titleClasses}>{t('notStaking')}</span>
      ) : (
        <>
          <Polkicon address={value || ''} transform="grow-3" />
          <span className="title">{text}</span>
        </>
      )}
    </div>
  )
}

export default memo(DefaultAccount)
