// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faClipboard, faLink } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { useStaking } from 'contexts/Staking'
import { Title } from 'library/Modal/Title'
import { useTranslation } from 'react-i18next'
import { Padding } from 'ui-core/modal'
import { SupportWrapper } from './Wrapper'

export const Invite = () => {
  const { t } = useTranslation('modals')
  const { activeAccount } = useActiveAccounts()
  const { inSetup } = useStaking()
  const { isOwner, activePool } = useActivePool()

  const canGeneratePoolInvite = activeAccount && isOwner() && activePool
  const canGenerateValidatorInvite = activeAccount && !inSetup()

  const generateInviteLink = async (type: 'pool' | 'validator' | 'group') => {
    let id = ''
    const baseUrl = 'https://staking.polkadot.cloud/invite'

    switch (type) {
      case 'pool':
        if (!canGeneratePoolInvite) {
          return
        }
        id = String(activePool?.id || '')
        break
      case 'validator':
        if (!canGenerateValidatorInvite) {
          return
        }
        id = activeAccount
        break
    }

    if (!id) {
      return
    }

    const link = `${baseUrl}/${type}/${id}`
    await navigator.clipboard.writeText(link)
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
        </SupportWrapper>
      </Padding>
    </>
  )
}
