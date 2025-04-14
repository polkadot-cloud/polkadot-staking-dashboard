// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCompressAlt, faExpandAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { ButtonPrimary } from 'ui-buttons'

export const ShareOptions = ({
  inviteUrl,
  copiedToClipboard,
  copyInviteUrl,
}: {
  inviteUrl: string
  copiedToClipboard: boolean
  copyInviteUrl: () => void
}) => {
  const { t } = useTranslation('invite')
  const [showFullUrl, setShowFullUrl] = useState(false)

  // Create shortened URL for display
  const shortenUrl = (url: string) => {
    if (url.length <= 60) {
      return url
    }
    return `${url.substring(0, 30)}...${url.substring(url.length - 30)}`
  }

  const displayUrl = showFullUrl ? inviteUrl : shortenUrl(inviteUrl)

  return (
    <Container>
      <InviteUrlContainer>
        <InviteUrlWrapper>
          <InviteUrl title={inviteUrl}>{displayUrl}</InviteUrl>
          <ViewToggle
            onClick={() => setShowFullUrl(!showFullUrl)}
            title={showFullUrl ? t('showLess') : t('showMore')}
          >
            <FontAwesomeIcon icon={showFullUrl ? faCompressAlt : faExpandAlt} />
          </ViewToggle>
        </InviteUrlWrapper>
        <ButtonPrimary
          text={copiedToClipboard ? t('copied') : t('copy')}
          onClick={copyInviteUrl}
          size="sm"
          style={{ flexShrink: 0 }}
        />
      </InviteUrlContainer>
    </Container>
  )
}

const Container = styled.div`
  margin: 1rem 0;
  width: 100%;
`

const InviteUrlContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  padding: 0.75rem 1rem;
  background: var(--background-list-item);
  border-radius: 0.75rem;
  border: 1.5px solid var(--border-primary-color);
  transition: all var(--transition-duration);
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`

const InviteUrlWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
`

const InviteUrl = styled.div`
  flex: 1;
  font-family: monospace;
  word-break: break-all;
  font-size: 0.9rem;
  color: var(--text-color-secondary);
  overflow-wrap: break-word;
  min-width: 0;
  max-height: 100px;
  overflow-y: auto;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  background: var(--background-secondary);

  &::-webkit-scrollbar {
    width: 0.25rem;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--border-primary-color);
    border-radius: 0.25rem;
  }
`

const ViewToggle = styled.button`
  background: none;
  border: none;
  color: var(--text-color-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: all var(--transition-duration);

  &:hover {
    color: var(--accent-color-primary);
    background: var(--background-secondary);
    border-radius: 0.25rem;
  }
`
