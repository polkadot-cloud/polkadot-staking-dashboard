// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

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

  return (
    <Container>
      <InviteUrlContainer>
        <InviteUrl>{inviteUrl}</InviteUrl>
        <ButtonPrimary
          text={copiedToClipboard ? t('copied') : t('copy')}
          onClick={copyInviteUrl}
        />
      </InviteUrlContainer>
    </Container>
  )
}

const Container = styled.div`
  margin: 1rem 0;
`

const InviteUrlContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  background: var(--background-primary);
  border-radius: 0.75rem;
`

const InviteUrl = styled.div`
  flex: 1;
  font-family: monospace;
  word-break: break-all;
  font-size: 0.9rem;
`
