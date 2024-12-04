// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons'
import { appendOrEmpty } from '@w3ux/utils'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { EstimatedTxFee } from 'library/EstimatedTxFee'
import type { ReactNode } from 'react'
import { ButtonSubmit } from 'ui-buttons'
import { ButtonSubmitLarge } from './ButtonSubmitLarge'
import type { SubmitProps } from './types'

export const Default = ({
  uid,
  onSubmit,
  processing,
  valid,
  submitText,
  buttons,
  submitAddress,
  displayFor,
  notEnoughFunds,
}: SubmitProps & {
  buttons?: ReactNode[]
  notEnoughFunds: boolean
  processing: boolean
}) => {
  const { accountHasSigner } = useImportedAccounts()

  const disabled =
    processing || !valid || !accountHasSigner(submitAddress) || notEnoughFunds

  return (
    <>
      <div className={`inner${appendOrEmpty(displayFor === 'card', 'col')}`}>
        <div>
          <EstimatedTxFee uid={uid} />
        </div>
        <div>
          {buttons}
          {displayFor !== 'card' && (
            <ButtonSubmit
              lg={displayFor === 'canvas'}
              text={submitText || ''}
              iconLeft={faArrowAltCircleUp}
              iconTransform="grow-2"
              onClick={() => onSubmit()}
              disabled={disabled}
              pulse={!disabled}
            />
          )}
        </div>
      </div>
      {displayFor === 'card' && (
        <ButtonSubmitLarge
          disabled={disabled}
          onSubmit={() => onSubmit()}
          submitText={submitText || ''}
          icon={faArrowAltCircleUp}
          pulse={!disabled}
        />
      )}
    </>
  )
}
