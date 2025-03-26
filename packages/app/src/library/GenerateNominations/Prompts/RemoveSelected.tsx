// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useOutsideAlerter } from '@w3ux/hooks'
import { FooterWrapper } from 'library/Prompt/Wrappers'
import { useRef } from 'react'
import { ButtonPrimary } from 'ui-buttons'
import type { RemoveSelectedProps } from '../types'

export const RemoveSelected = ({
  controlKey,
  onRevert,
  onClose,
}: RemoveSelectedProps) => {
  const popoverRef = useRef<HTMLDivElement>(null)

  // Close the menu if clicked outside of its container
  useOutsideAlerter(popoverRef, () => {
    onClose()
  }, [controlKey])

  return (
    <div ref={popoverRef}>
      <h3>Confirm Remove Selected</h3>
      <div className="body">
        <FooterWrapper>
          <ButtonPrimary
            marginRight
            text={'Remove'}
            onClick={() => onRevert()}
          />
        </FooterWrapper>
      </div>
    </div>
  )
}
