// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faEnvelopeOpenText } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useBalances } from 'contexts/Balances'
import { useNetwork } from 'contexts/Network'
import { ButtonCopy } from 'library/ButtonCopy'
import { Title } from 'library/Modal/Title'
import { useTranslation } from 'react-i18next'
import { Padding, Support } from 'ui-core/modal'

export const Invite = () => {
  const { network } = useNetwork()
  const { t } = useTranslation()
  const { getPoolMembership } = useBalances()
  const { activeAddress } = useActiveAccounts()
  const { membership } = getPoolMembership(activeAddress)
  const poolId = membership?.poolId || 0

  let inviteLink = undefined
  let title = t('inviteStart', { ns: 'app' })

  if (membership) {
    inviteLink = `https://staking.polkadot.cloud/#/overview?n=${network}&i=pool&id=${poolId}`
    title = t('copyPoolInviteLink', { ns: 'app' })
  }

  return (
    <>
      <Title />
      <Padding verticalOnly>
        <Support>
          <FontAwesomeIcon icon={faEnvelopeOpenText} />
          {inviteLink ? (
            <>
              <ButtonCopy
                value={inviteLink}
                size="1rem"
                style={{ marginTop: '1.5rem' }}
                children={
                  <h2>
                    {title}
                    &nbsp;
                  </h2>
                }
              />
              <p>{inviteLink}</p>
            </>
          ) : (
            <>
              <h2>{title}</h2>
              <p>{t('inviteDescription', { ns: 'app' })}</p>
            </>
          )}
        </Support>
      </Padding>
    </>
  )
}
