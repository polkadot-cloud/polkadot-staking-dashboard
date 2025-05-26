// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCompressAlt, faExpandAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { ButtonPrimary } from 'ui-buttons'

export const ShareOptions = ({
  inviteUrl,
  copiedToClipboard,
  copyInviteUrl,
  displayUrl,
  showFullUrl,
  toggleUrlDisplay,
}: {
  inviteUrl: string
  copiedToClipboard: boolean
  copyInviteUrl: () => void
  displayUrl: string
  showFullUrl: boolean
  toggleUrlDisplay: () => void
}) => {
  const { t } = useTranslation('invite')

  return (
    <Container>
      <InviteUrlContainer $expanded={showFullUrl}>
        <InviteUrlWrapper>
          <InviteUrl title={inviteUrl} $expanded={showFullUrl}>
            {displayUrl}
          </InviteUrl>
          <ViewToggle
            onClick={toggleUrlDisplay}
            title={showFullUrl ? t('showLess') : t('showMore')}
            aria-label={
              showFullUrl ? t('collapseUrlAriaLabel') : t('expandUrlAriaLabel')
            }
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

const InviteUrlContainer = styled.div<{ $expanded: boolean }>`
  display: flex;
  gap: 1rem;
  align-items: ${({ $expanded }) => ($expanded ? 'flex-start' : 'center')};
  padding: 0.75rem 1rem;
  background: var(--button-secondary-background);
  border-radius: 0.75rem;
  border: 1.5px solid var(--border-primary-color);
  transition: all var(--transition-duration);
  width: 100%;
  box-sizing: border-box;
  max-height: ${({ $expanded }) => ($expanded ? '300px' : 'auto')};

  @media (max-width: 826px) {
    flex-direction: column;
    align-items: stretch;
  }
`

const InviteUrlWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  position: relative;
`

const InviteUrl = styled.div<{ $expanded: boolean }>`
  flex: 1;
  font-family: monospace;
  word-break: break-all;
  font-size: 0.9rem;
  color: var(--text-color-secondary);
  overflow-wrap: break-word;
  min-width: 0;
  max-height: ${({ $expanded }) => ($expanded ? '250px' : '100px')};
  overflow-y: auto;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  background: var(--button-secondary-background);
  white-space: ${({ $expanded }) => ($expanded ? 'normal' : 'nowrap')};

  &::-webkit-scrollbar {
    width: 0.25rem;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--button-hover-background);
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
    background: var(--button-secondary-background);
    border-radius: 0.25rem;
  }
`
