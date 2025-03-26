// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useTheme } from 'contexts/Themes'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Popover } from 'ui-core/popover'
import { Confirm } from './Prompts/Confirm'

export const Revert = ({
  disabled,
  onClick,
}: {
  disabled: boolean
  onClick: () => void
}) => {
  const { t } = useTranslation()
  const { themeElementRef } = useTheme()

  const [open, setOpen] = useState<boolean>(false)
  const buttonClass = 'button-revert'

  return (
    <Popover
      open={open}
      portalContainer={themeElementRef.current || undefined}
      onTriggerClick={() => {
        setOpen(true)
      }}
      content={
        <Confirm
          text="Revert all changes?"
          controlKey={buttonClass}
          onClose={() => setOpen(false)}
          onRevert={() => {
            if (disabled) {
              return
            }
            onClick()
            setOpen(false)
          }}
        />
      }
    >
      <p
        className={buttonClass}
        style={{
          opacity: disabled ? 0.5 : 1,
          margin: '0 1rem 0 0',
          fontFamily: 'InterSemiBold, sans-serif',
        }}
      >
        {t('revertChanges', { ns: 'modals' })}
      </p>
    </Popover>
  )
}
