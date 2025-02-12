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
import { SupportWrapper } from './Wrapper'

export const Invite = () => {
  const { t } = useTranslation('modals')
  const { activeAccount } = useActiveAccounts()
  const { inSetup } = useStaking()
  const { isOwner, activePool, isMember } = useActivePool()
  const { getNominations } = useBalances()
  const [feedback, setFeedback] = useState('')

  // Handle feedback message display
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(''), 3000)
      return () => clearTimeout(timer)
    }
  }, [feedback])

  const canGeneratePoolInvite =
    activeAccount && (isOwner() || isMember()) && activePool
  const canGenerateValidatorInvite = activeAccount && !inSetup()

  const generateInviteLink = async (type: 'pool' | 'validator') => {
    let id = ''
    let params = ''
    const baseUrl = 'https://staking.polkadot.cloud/invite'

    try {
      switch (type) {
        case 'pool': {
          if (!canGeneratePoolInvite) {
            return
          }
          id = String(activePool?.id || '')
          break
        }
        case 'validator': {
          if (!canGenerateValidatorInvite) {
            return
          }
          id = activeAccount
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
        return
      }

      // For validator invites, append params to existing ones
      const poolTab = type === 'pool' ? params : ''
      const validatorParams = type === 'validator' ? params : ''
      const link = `${baseUrl}/${type}/${id}${poolTab}${validatorParams}`
      await navigator.clipboard.writeText(link)
      setFeedback(t('linkCopied'))
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
