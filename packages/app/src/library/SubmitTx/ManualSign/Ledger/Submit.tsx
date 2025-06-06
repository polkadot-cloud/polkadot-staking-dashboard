// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faUsb } from '@fortawesome/free-brands-svg-icons'
import { faSquarePen } from '@fortawesome/free-solid-svg-icons'
import { useLedgerHardware } from 'contexts/LedgerHardware'
import { ButtonSubmitLarge } from 'library/SubmitTx/ButtonSubmitLarge'
import type { LedgerSubmitProps } from 'library/SubmitTx/types'
import { useTranslation } from 'react-i18next'
import { ButtonSubmit } from 'ui-buttons'

export const Submit = ({
  displayFor,
  submitted,
  submitText,
  onSubmit,
  disabled,
}: LedgerSubmitProps) => {
  const { t } = useTranslation('app')
  const { isExecuting, integrityChecked, checkRuntimeVersion } =
    useLedgerHardware()

  // Check device runtime version.
  const handleCheckRuntimeVersion = async () => {
    await checkRuntimeVersion()
  }

  // Is the transaction ready to be submitted?
  const txReady = integrityChecked || submitted

  // Button `onClick` handler depends whether integrityChecked and whether tx has been submitted.
  const handleOnClick = !integrityChecked ? handleCheckRuntimeVersion : onSubmit

  // Determine button text.
  const text = !integrityChecked
    ? t('confirm')
    : txReady
      ? submitText || ''
      : isExecuting
        ? t('signing')
        : t('sign')

  // Button icon.
  const icon = !integrityChecked ? faUsb : faSquarePen

  return displayFor !== 'card' ? (
    <ButtonSubmit
      lg={displayFor === 'canvas'}
      iconLeft={icon}
      iconTransform="grow-2"
      text={text}
      onClick={handleOnClick}
      disabled={disabled}
      pulse={!disabled}
    />
  ) : (
    <ButtonSubmitLarge
      disabled={disabled}
      onSubmit={handleOnClick}
      submitText={text}
      icon={icon}
      pulse={!disabled}
    />
  )
}
