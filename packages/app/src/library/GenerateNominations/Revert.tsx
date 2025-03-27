// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useTheme } from 'contexts/Themes'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ButtonPrimary } from 'ui-buttons'
import { Popover } from 'ui-core/popover'
import { Confirm } from './Popovers/Confirm'

export const Revert = ({
  disabled,
  onClick,
}: {
  disabled: boolean
  onClick: () => void
}) => {
  const { t } = useTranslation('modals')
  const { themeElementRef } = useTheme()

  const [open, setOpen] = useState<boolean>(false)
  const buttonClass = 'button-revert'

  return (
    <Popover
      open={open}
      portalContainer={themeElementRef.current || undefined}
      onTriggerClick={() => {
        if (!disabled) {
          setOpen(true)
        }
      }}
      content={
        <Confirm
          text={t('revertNominationChanges')}
          controlKey={buttonClass}
          onClose={() => setOpen(false)}
          onRevert={() => {
            onClick()
            setOpen(false)
          }}
        />
      }
    >
      <ButtonPrimary text={t('revertChanges')} asLabel disabled={disabled} />
    </Popover>
  )
}
