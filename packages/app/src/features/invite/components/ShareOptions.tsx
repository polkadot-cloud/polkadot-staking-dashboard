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
        <InviteUrlDisplay>{inviteUrl}</InviteUrlDisplay>
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
`

const ShareHeader = styled.div`
  text-align: center;
  margin-bottom: 0.5rem;

  h3 {
    font-size: 1.4rem;
    margin-bottom: 0.5rem;
  }

  p {
    color: var(--text-color-secondary);
  }
`

const EntityInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background-color: var(--background-primary);
  border: 1px solid var(--border-primary-color);
  border-radius: 1rem;
`

const EntityDetails = styled.div`
  h4 {
    font-size: 1.1rem;
    margin-bottom: 0.25rem;
  }

  .address {
    font-family: monospace;
    font-size: 0.9rem;
    color: var(--text-color-secondary);
  }
`

const InviteUrlContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  padding: 0.75rem;
  background-color: var(--background-primary);
  border: 1px solid var(--border-primary-color);
  border-radius: 0.75rem;
`

const InviteUrlDisplay = styled.div`
  flex: 1;
  font-family: monospace;
  font-size: 0.9rem;
  color: var(--text-color-primary);
  padding: 0.5rem 0.75rem;
  background-color: var(--background-secondary);
  border-radius: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const CopyButtonWrapper = styled.div`
  flex-shrink: 0;
`
