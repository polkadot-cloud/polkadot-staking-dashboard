// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faBars } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { useThemeValues } from 'contexts/ThemeValues'
import { CardWrapper } from 'library/Card/Wrappers'
import { useTranslation } from 'react-i18next'
import { MembersList as FetchPageMemberList } from './Lists/FetchPage'

export const Members = () => {
  const { t } = useTranslation('pages')
  const { getThemeValue } = useThemeValues()
  const { activePool, isOwner, isBouncer } = useActivePool()

  const annuncementBorderColor = getThemeValue('--accent-color-secondary')

  const showBlockedPrompt =
    activePool?.bondedPool?.state === 'Blocked' && (isOwner() || isBouncer())

  const memberCount = activePool?.bondedPool?.memberCounter || 0

  const membersListProps = {
    batchKey: 'active_pool_members',
    pagination: true,
    allowMoreCols: true,
  }

  return (
    <>
      {/* Pool in Blocked state: allow root & bouncer to unbond & withdraw members */}
      {showBlockedPrompt && (
        <CardWrapper
          className="canvas"
          style={{
            border: `1px solid ${annuncementBorderColor}`,
            marginBottom: '1.5rem',
          }}
        >
          <div className="content">
            <h3>{t('poolCurrentlyLocked')}</h3>
            <h4>
              {t('permissionToUnbond')}({' '}
              <FontAwesomeIcon icon={faBars} transform="shrink-2" /> ){' '}
              {t('managementOptions')}
            </h4>
          </div>
        </CardWrapper>
      )}

      {/* Pool in Destroying state: allow anyone to unbond & withdraw members */}
      {activePool?.bondedPool?.state === 'Destroying' && (
        <CardWrapper
          className="canvas"
          style={{
            border: `1px solid ${annuncementBorderColor}`,
            marginBottom: '1.5rem',
          }}
        >
          <div className="content">
            <h3>{t('poolInDestroyingState')}</h3>
            <h4>
              {t('permissionToUnbond')} ({' '}
              <FontAwesomeIcon icon={faBars} transform="shrink-2" /> ){' '}
              {t('managementOptions')}
            </h4>
          </div>
        </CardWrapper>
      )}

      <CardWrapper className="transparent">
        <FetchPageMemberList
          {...membersListProps}
          memberCount={memberCount}
          itemsPerPage={50}
        />
      </CardWrapper>
    </>
  )
}
