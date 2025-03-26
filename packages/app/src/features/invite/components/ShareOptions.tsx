// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCheck, faCopy } from '@fortawesome/free-solid-svg-icons'
import { Polkicon } from '@w3ux/react-polkicon'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { ButtonPrimary } from 'ui-buttons'

interface ShareOptionsProps {
  inviteUrl: string
  copiedToClipboard: boolean
  copyInviteUrl: () => Promise<boolean>
  type: 'pool' | 'validator'
  entityName: string
  entityAddress?: string
}

export const ShareOptions = ({
  inviteUrl,
  copiedToClipboard,
  copyInviteUrl,
  type,
  entityName,
  entityAddress,
}: ShareOptionsProps) => {
  const { t } = useTranslation('invite')

  return (
    <ShareWrapper>
      <ShareHeader>
        <h3>{t('shareInvite')}</h3>
        <p>
          {type === 'pool'
            ? t('sharePoolInviteDescription')
            : t('shareValidatorInviteDescription')}
        </p>
      </ShareHeader>

      <EntityInfo>
        {entityAddress && (
          <Polkicon address={entityAddress} fontSize="2.25rem" />
        )}
        <EntityDetails>
          <h4>{entityName}</h4>
          {entityAddress && (
            <p className="address">{`${entityAddress.slice(0, 6)}...${entityAddress.slice(-6)}`}</p>
          )}
        </EntityDetails>
      </EntityInfo>

      <InviteUrlContainer>
        <InviteUrlDisplay>
          {inviteUrl.length > 60
            ? `${inviteUrl.substring(0, 30)}...${inviteUrl.substring(inviteUrl.length - 30)}`
            : inviteUrl}
        </InviteUrlDisplay>
        <CopyButtonWrapper>
          <ButtonPrimary
            text={copiedToClipboard ? t('copied') : t('copy')}
            onClick={copyInviteUrl}
            iconLeft={copiedToClipboard ? faCheck : faCopy}
          />
        </CopyButtonWrapper>
      </InviteUrlContainer>
    </ShareWrapper>
  )
}

const ShareWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  margin-top: 1rem;
`

const ShareHeader = styled.div`
  h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.2rem;
  }

  p {
    margin: 0;
    color: var(--text-color-secondary);
    font-size: 0.9rem;
  }
`

const EntityInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: var(--background-primary);
  border-radius: 0.75rem;
`

const EntityDetails = styled.div`
  h4 {
    margin: 0 0 0.25rem 0;
    font-size: 1rem;
  }

  .address {
    margin: 0;
    font-size: 0.85rem;
    color: var(--text-color-secondary);
    font-family: monospace;
  }
`

const InviteUrlContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  background-color: var(--background-primary);
  border-radius: 0.75rem;
  overflow: hidden;
`

const InviteUrlDisplay = styled.div`
  flex: 1;
  padding: 1rem;
  font-family: monospace;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const CopyButtonWrapper = styled.div`
  margin-right: 0.5rem;
`
