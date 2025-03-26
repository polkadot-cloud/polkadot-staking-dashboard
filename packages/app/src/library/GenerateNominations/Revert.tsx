// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { DisplayFor } from '@w3ux/types'
import { useTranslation } from 'react-i18next'
import { ButtonPrimary, ButtonSecondary } from 'ui-buttons'

export const Revert = ({
  displayFor,
  disabled,
  onClick,
}: {
  displayFor: DisplayFor
  disabled: boolean
  onClick: () => void
}) => {
  const { t } = useTranslation()

  const ButtonType = displayFor === 'canvas' ? ButtonPrimary : ButtonSecondary

  return (
    <ButtonType
      text={t('revertChanges', { ns: 'modals' })}
      onClick={() => onClick()}
      disabled={disabled}
      style={{ marginRight: '1rem' }}
    />
  )
}
