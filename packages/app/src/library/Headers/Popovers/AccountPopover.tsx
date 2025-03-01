// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useOutsideAlerter } from '@w3ux/hooks'
import { Polkicon } from '@w3ux/react-polkicon'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { ButtonCopy } from 'library/ButtonCopy'
import { useRef, type Dispatch, type SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'
import { ButtonText } from 'ui-buttons'
import { ButtonRow, Separator } from 'ui-core/base'
import { useOverlay } from 'ui-overlay'

export const AccountPopover = ({
  setOpen,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>
}) => {
  const { t } = useTranslation()
  const { openModal } = useOverlay().modal
  const { activeAccount, setActiveAccount, setActiveProxy } =
    useActiveAccounts()

  const popoverRef = useRef<HTMLDivElement>(null)

  // Close the menu if clicked outside of its container.
  useOutsideAlerter(popoverRef, () => {
    setOpen(false)
  }, ['header-account'])

  return (
    <div ref={popoverRef}>
      <Polkicon address={activeAccount || ''} fontSize="4rem" />
      <h4 style={{ marginTop: '1rem', marginBottom: '0' }}>Full Address</h4>
      <p style={{ marginTop: '0.2rem' }}>
        {activeAccount} &nbsp;
        <ButtonCopy value={activeAccount || ''} size="0.95rem" />
      </p>
      <Separator />
      <ButtonRow>
        <ButtonText
          marginRight
          text="Switch Account"
          onClick={() => {
            setOpen(false)
            openModal({ key: 'Accounts' })
          }}
        />
        <span style={{ color: 'var(--text-color-tertiary)' }}>|</span>
        <ButtonText
          status="danger"
          marginLeft
          text={t('disconnect', { ns: 'modals' })}
          onClick={() => {
            setActiveAccount(null)
            setActiveProxy(null)
          }}
        />
      </ButtonRow>
    </div>
  )
}
