// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faBell } from '@fortawesome/free-solid-svg-icons'
import { useInviteNotification } from 'contexts/InviteNotification'
import { useTheme } from 'contexts/Themes'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { InactiveButtonHeader } from 'ui-buttons'
import { Padding, Title } from 'ui-core/modal'
import { Popover } from 'ui-core/popover'

// Styled wrapper for the notification element
const NotificationWrapper = styled.div`
  position: relative;
  display: inline-flex;
`

// Styled wrapper for the notification dot
const NotificationDot = styled.div`
  position: absolute;
  top: -3px;
  right: -3px;
  width: 12px;
  height: 12px;
  background-color: var(--accent-color-primary);
  border-radius: 50%;
  border: 2px solid var(--background-primary);
  box-shadow: 0 0 0 1px var(--accent-color-primary);
  animation: pulse 2s infinite;

  @keyframes pulse {
    0% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(255, 82, 181, 0.7);
    }
    70% {
      transform: scale(1);
      box-shadow: 0 0 0 5px rgba(255, 82, 181, 0);
    }
    100% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(255, 82, 181, 0);
    }
  }
`

const PopoverContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .buttons {
    display: flex;
    gap: 0.5rem;
  }

  button {
    background: var(--button-primary-background);
    border: 1px solid var(--border-primary-color);
    border-radius: 0.75rem;
    padding: 0.5rem 1rem;
    color: var(--text-color-primary);
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: var(--button-hover-background);
    }

    &.primary {
      background: var(--accent-color-primary);
      border-color: var(--accent-color-primary);
      color: white;
    }
  }
`

export const InviteNotification = () => {
  const { t } = useTranslation('invite')
  const { themeElementRef } = useTheme()
  const { inviteActive, inviteType, navigateToInvite, dismissInvite } =
    useInviteNotification()

  // State for popover open/close
  const [open, setOpen] = useState<boolean>(false)

  // Don't render if no active invite
  if (!inviteActive) {
    return null
  }

  // Get notification title based on invite type
  const getNotificationTitle = () => {
    if (inviteType === 'pool') {
      return t('youHaveBeenInvitedToJoinPool')
    }
    if (inviteType === 'validator') {
      return t('youHaveBeenInvitedToNominate')
    }
    return t('youHaveAPendingInvite')
  }

  return (
    <Popover
      open={open}
      portalContainer={themeElementRef.current || undefined}
      content={
        <Padding>
          <Title>{getNotificationTitle()}</Title>
          <PopoverContent>
            <p>{t('inviteNotificationDescription')}</p>
            <div className="buttons">
              <button
                className="primary"
                onClick={() => {
                  setOpen(false)
                  navigateToInvite()
                }}
              >
                {t('viewInvite')}
              </button>
              <button
                onClick={() => {
                  setOpen(false)
                  dismissInvite()
                }}
              >
                {t('dismiss')}
              </button>
            </div>
          </PopoverContent>
        </Padding>
      }
      onTriggerClick={() => {
        setOpen(!open)
      }}
      width="350px"
    >
      <NotificationWrapper>
        <InactiveButtonHeader
          className="header-bell-notification"
          marginLeft
          icon={faBell}
        />
        {inviteActive && <NotificationDot />}
      </NotificationWrapper>
    </Popover>
  )
}
