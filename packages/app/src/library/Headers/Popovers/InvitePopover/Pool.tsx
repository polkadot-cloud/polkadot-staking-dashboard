// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Dispatch, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'
import { PopoverTab } from 'ui-buttons'
import { useOverlay } from 'ui-overlay'

export const Pool = ({
  poolId,
  setOpen,
}: {
  poolId: number
  setOpen: Dispatch<SetStateAction<boolean>>
}) => {
  const { t } = useTranslation()
  const { openCanvas } = useOverlay().canvas
  return (
    <PopoverTab.Button
      text={t('viewInvite', { ns: 'app' })}
      onClick={() => {
        setOpen(false)
        openCanvas({
          key: 'Pool',
          options: {
            providedPool: {
              id: poolId,
            },
          },
          size: 'xl',
        })
      }}
    />
  )
}
