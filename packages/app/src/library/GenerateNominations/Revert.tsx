// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { usePrompt } from 'contexts/Prompt'
import { useTranslation } from 'react-i18next'
import { ButtonMenu, ButtonPrimary } from 'ui-buttons'
import { RevertChanges } from './Prompts/RevertChanges'

export const Revert = ({
  inMenu,
  disabled,
  onClick,
}: {
  inMenu?: boolean
  disabled: boolean
  onClick: () => void
}) => {
  const { t } = useTranslation('modals')
  const { openPromptWith, closePrompt } = usePrompt()

  const onRevert = () => {
    onClick()
    closePrompt()
  }

  return inMenu ? (
    <ButtonMenu
      text={t('revertChanges')}
      disabled={disabled}
      onClick={() => {
        openPromptWith(<RevertChanges onRevert={onRevert} />)
      }}
    />
  ) : (
    <ButtonPrimary
      text={t('revertChanges')}
      disabled={disabled}
      onClick={() => {
        openPromptWith(<RevertChanges onRevert={onRevert} />)
      }}
    />
  )
}
