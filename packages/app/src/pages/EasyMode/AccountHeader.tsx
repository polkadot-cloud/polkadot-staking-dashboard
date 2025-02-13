// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faGear } from '@fortawesome/free-solid-svg-icons'
import { Polkicon } from '@w3ux/react-polkicon'
import { ellipsisFn } from '@w3ux/utils'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { CardWrapper } from 'library/Card/Wrappers'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { ButtonSecondary } from 'ui-buttons'

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 1rem 1.5rem;
  background: var(--background-primary);
  border-radius: 1rem;
`

const AccountSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  .icon {
    width: 2.5rem;
    height: 2.5rem;
  }

  .details {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    .address {
      font-family: InterSemiBold, sans-serif;
      font-size: 1.1rem;
    }

    .name {
      font-size: 0.9rem;
      color: var(--text-color-secondary);
    }
  }
`

interface AccountHeaderProps {
  address: string
  onSwitchMode: () => void
}

export const AccountHeader = ({
  address,
  onSwitchMode,
}: AccountHeaderProps) => {
  const { t } = useTranslation('pages')
  const { getAccount } = useImportedAccounts()
  const accountData = getAccount(address)

  return (
    <CardWrapper>
      <HeaderWrapper>
        <AccountSection>
          <div className="icon">
            <Polkicon address={address} />
          </div>
          <div className="details">
            <div className="address">{ellipsisFn(address)}</div>
            <div className="name">
              {accountData?.name || t('overview.noActiveAccount')}
            </div>
          </div>
        </AccountSection>
        <ButtonSecondary
          onClick={onSwitchMode}
          text={t('easyMode.switchToAdvanced')}
          iconLeft={faGear}
        />
      </HeaderWrapper>
    </CardWrapper>
  )
}

export default AccountHeader
