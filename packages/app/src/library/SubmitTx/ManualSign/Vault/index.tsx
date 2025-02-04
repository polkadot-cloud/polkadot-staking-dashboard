// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faSquarePen } from '@fortawesome/free-solid-svg-icons'
import { appendOrEmpty } from '@w3ux/utils'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { usePrompt } from 'contexts/Prompt'
import { EstimatedTxFee } from 'library/EstimatedTxFee'
import { ButtonSubmitLarge } from 'library/SubmitTx/ButtonSubmitLarge'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { ButtonSubmit } from 'ui-buttons'
import type { SubmitProps } from '../../types'

export const Vault = ({
  uid,
  onSubmit,
  submitted,
  valid,
  submitText,
  buttons,
  submitAddress,
  displayFor,
  notEnoughFunds,
}: SubmitProps & {
  buttons?: ReactNode[]
  notEnoughFunds: boolean
  submitted: boolean
}) => {
  const { t } = useTranslation('library')
  const { status: promptStatus } = usePrompt()
  const { accountHasSigner } = useImportedAccounts()

  // The state under which submission is disabled.
  const disabled =
    submitted || !valid || !accountHasSigner(submitAddress) || notEnoughFunds

  // Format submit button based on whether signature currently exists or submission is ongoing.
  let buttonText: string
  let buttonDisabled: boolean
  let buttonPulse: boolean

  if (submitted) {
    buttonText = submitText || ''
    buttonDisabled = disabled
    buttonPulse = !(!valid || promptStatus !== 0)
  } else {
    buttonText = t('sign')
    buttonDisabled = disabled || promptStatus !== 0
    buttonPulse = !disabled || promptStatus === 0
  }

  return (
    <div className={`inner${appendOrEmpty(displayFor === 'card', 'col')}`}>
      <div>
        <EstimatedTxFee uid={uid} />
        {valid ? <p>{t('submitTransaction')}</p> : <p>...</p>}
      </div>
      <div>
        {buttons}
        {displayFor !== 'card' ? (
          <ButtonSubmit
            disabled={buttonDisabled}
            lg={displayFor === 'canvas'}
            text={buttonText}
            iconLeft={faSquarePen}
            iconTransform="grow-2"
            onClick={() => onSubmit()}
            pulse={buttonPulse}
          />
        ) : (
          <ButtonSubmitLarge
            disabled={disabled}
            submitText={buttonText}
            onSubmit={onSubmit}
            icon={faSquarePen}
            pulse={!disabled}
          />
        )}
      </div>
    </div>
  )
}
