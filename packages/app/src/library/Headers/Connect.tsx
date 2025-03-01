// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faPlug, faWallet } from '@fortawesome/free-solid-svg-icons'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useTranslation } from 'react-i18next'
import { MultiButton } from 'ui-buttons'
import { ButtonRow } from 'ui-core/base'
import { useOverlay } from 'ui-overlay'

export const Connect = () => {
  const { t } = useTranslation('app')
  const { openModal } = useOverlay().modal
  const { accounts } = useImportedAccounts()

  return (
    <ButtonRow>
      <MultiButton.Container marginLeft>
        {accounts.length ? (
          <>
            <MultiButton.Button
              size="md"
              text={t('accounts')}
              iconLeft={faWallet}
              onClick={() => {
                openModal({ key: 'Accounts' })
              }}
              style={{ color: 'white', fontSize: '1.05rem' }}
            />
            <span />
            <MultiButton.Button
              size="md"
              text=""
              iconRight={faPlug}
              iconTransform="grow-1"
              onClick={() => {
                openModal({ key: 'Connect' })
              }}
              style={{ color: 'white', fontSize: '1.05rem' }}
            />
          </>
        ) : (
          <MultiButton.Button
            size="md"
            text={t('connect')}
            iconRight={faPlug}
            iconTransform="grow-1"
            onClick={() => {
              openModal({ key: accounts.length ? 'Accounts' : 'Connect' })
            }}
            style={{ color: 'white', fontSize: '1.05rem' }}
          />
        )}
      </MultiButton.Container>
    </ButtonRow>
  )
}
