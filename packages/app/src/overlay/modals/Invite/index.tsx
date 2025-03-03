// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faClipboard, faLink } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useBalances } from 'contexts/Balances'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { useStaking } from 'contexts/Staking'
import { Title } from 'library/Modal/Title'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Padding } from 'ui-core/modal'
import { useOverlay } from 'ui-overlay'
import { SupportWrapper } from './Wrapper'

export const Invite = () => {
  const { t } = useTranslation('modals')
  const { activeAccount } = useActiveAccounts()
  const { inSetup } = useStaking()
  const { isOwner, activePool, isMember } = useActivePool()
  const { getNominations } = useBalances()
  const [feedback, setFeedback] = useState('')
  const {
    config: { options },
  } = useOverlay().modal

  // Get the pool from options if available (passed from SideMenu)
  const poolFromOptions = options?.activePool ?? activePool

  // Handle feedback message display
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(''), 3000)
      return () => clearTimeout(timer)
    }
  }, [feedback])

  const canGeneratePoolInvite =
    activeAccount &&
    (isOwner() || isMember()) &&
    (poolFromOptions || activePool)

  const canGenerateValidatorInvite =
    activeAccount && !inSetup() && getNominations(activeAccount).length > 0

  const generateInviteLink = async (type: 'pool' | 'validator') => {
    let id = ''
    let params = ''
    // Use window.location.origin for better compatibility
    const baseUrl = window.location.origin

    try {
      switch (type) {
        case 'pool': {
          if (!canGeneratePoolInvite) {
            return
          }

          // Use pool from options, fall back to active pool
          id = String(poolFromOptions?.id || activePool?.id || '')

          if (!id) {
            setFeedback(t('noPoolToInvite'))
            return
          }

          break
        }
        case 'validator': {
          if (!canGenerateValidatorInvite) {
            return
          }

          id = activeAccount || ''

          // Get current nominations for the active account
          const nominationsForAccount = getNominations(activeAccount)
          if (nominationsForAccount.length) {
            // Encode nominations as a comma-separated list
            params = `?validators=${nominationsForAccount.join(',')}`
          }
          break
        }
      }

      if (!id) {
        setFeedback(t('noIdForInvite'))
        return
      }

      // Generate the invite link
      const link = `${baseUrl}/#/invite/${type}/${id}${params}`
      await navigator.clipboard.writeText(link)
      setFeedback(t('linkCopied'))

      console.log('Generated invite link:', link)
    } catch (e) {
      console.error('Failed to generate invite link:', e)
      setFeedback(t('errorCopyingLink'))
    }
  }

  return (
    <>
      <Title />
      <Padding verticalOnly>
        <SupportWrapper>
          <FontAwesomeIcon icon={faLink} transform="shrink-0" />
          <h4>{t('generateInviteLink')}</h4>

          <h1>
            <button
              type="button"
              onClick={() => generateInviteLink('pool')}
              disabled={!canGeneratePoolInvite}
              style={{ opacity: canGeneratePoolInvite ? 1 : 0.5 }}
            >
              {t('generatePoolInvite')} &nbsp;
              <FontAwesomeIcon icon={faClipboard} transform="shrink-4" />
            </button>
          </h1>

          <h1>
            <button
              type="button"
              onClick={() => generateInviteLink('validator')}
              disabled={!canGenerateValidatorInvite}
              style={{ opacity: canGenerateValidatorInvite ? 1 : 0.5 }}
            >
              {t('generateValidatorInvite')} &nbsp;
              <FontAwesomeIcon icon={faClipboard} transform="shrink-4" />
            </button>
          </h1>

          <div className={`feedback ${feedback ? 'visible' : ''}`}>
            {feedback}
          </div>
        </SupportWrapper>
      </Padding>
    </>
  )
}
