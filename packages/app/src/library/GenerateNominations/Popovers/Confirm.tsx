// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useOutsideAlerter } from '@w3ux/hooks'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { PopoverTab } from 'ui-buttons'
import type { RemoveSelectedProps } from '../types'

export const Confirm = ({
  text,
  controlKey,
  onRevert,
  onClose,
}: RemoveSelectedProps) => {
  const { t } = useTranslation('app')
  const popoverRef = useRef<HTMLDivElement>(null)

  useOutsideAlerter(popoverRef, () => {
    onClose()
  }, [controlKey])

  return (
    <div ref={popoverRef}>
      <h4
        style={{
          padding: '1rem',
        }}
      >
        {text}
      </h4>
      <PopoverTab.Container position="bottom">
        <PopoverTab.Button
          style={{ color: 'var(--status-danger-color' }}
          text={t('cancel')}
          onClick={() => onClose()}
        />
        <PopoverTab.Button text={t('confirm')} onClick={() => onRevert()} />
      </PopoverTab.Container>
    </div>
  )
}
