// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCopy, faEnvelopeOpenText } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useBalances } from 'contexts/Balances'
import { useNetwork } from 'contexts/Network'
import { Title } from 'library/Modal/Title'
import { useTranslation } from 'react-i18next'
import { Padding } from 'ui-core/modal'
import { Wrapper } from './Wrapper'

export const Invite = () => {
  const { network } = useNetwork()
  const { t } = useTranslation()
  const { getStakingLedger } = useBalances()
  const { activeAddress } = useActiveAccounts()
  const { poolMembership } = getStakingLedger(activeAddress)
  const poolId = poolMembership?.poolId || 0

  let inviteLink = undefined
  let title = t('inviteStart', { ns: 'app' })

  if (poolMembership) {
    inviteLink = `https://staking.polkadot.cloud/#/overview?n=${network}&i=pool&id=${poolId}`
    title = t('copyPoolInviteLink', { ns: 'app' })
  }

  return (
    <>
      <Title />
      <Padding verticalOnly>
        <Wrapper>
          <FontAwesomeIcon icon={faEnvelopeOpenText} />
          {inviteLink ? (
            <>
              <button
                onClick={() => {
                  if (inviteLink) {
                    navigator.clipboard.writeText(inviteLink)
                  }
                }}
              >
                <h2>
                  {title}
                  &nbsp;
                  <FontAwesomeIcon icon={faCopy} transform="shrink-4" />
                </h2>
              </button>
              <p>{inviteLink}</p>
            </>
          ) : (
            <>
              <h2>{title}</h2>
              <p>{t('inviteDescription', { ns: 'app' })}</p>
            </>
          )}
        </Wrapper>
      </Padding>
    </>
  )
}
