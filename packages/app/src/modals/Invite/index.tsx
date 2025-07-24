// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faEnvelopeOpenText, faList } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useBalances } from 'contexts/Balances'
import { useNetwork } from 'contexts/Network'
import { useValidators } from 'contexts/Validators/ValidatorEntries'
import { ButtonCopy } from 'library/ButtonCopy'
import { Title } from 'library/Modal/Title'
import { useTranslation } from 'react-i18next'
import { Padding, Support } from 'ui-core/modal'

export const Invite = () => {
  const { network } = useNetwork()
  const { t } = useTranslation()
  const { formatWithPrefs } = useValidators()
  const { activeAddress } = useActiveAccounts()
  const { getPoolMembership, getNominations } = useBalances()

  const nominated = formatWithPrefs(getNominations(activeAddress))
  const { membership } = getPoolMembership(activeAddress)
  const poolId = membership?.poolId || 0

  const canCopy = nominated.length > 0 || membership !== undefined

  let inviteLink = undefined
  let toCopy = ''
  let title = t('inviteStart', { ns: 'app' })
  let subtitle = ''
  let faIcon = faEnvelopeOpenText

  if (membership) {
    inviteLink = `https://staking.polkadot.cloud/#/overview?n=${network}&i=pool&id=${poolId}`
    toCopy = inviteLink
    subtitle = inviteLink
    title = t('copyPoolInviteLink', { ns: 'app' })
  } else if (nominated.length > 0) {
    faIcon = faList
    toCopy = nominated.map((validator) => validator.address).join('\n')
    title = t('copyNominations', { ns: 'app' })
    subtitle = t('copyValidatorAddresses', { ns: 'app' })
  }

  return (
    <>
      <Title />
      <Padding verticalOnly>
        <Support>
          <FontAwesomeIcon icon={faIcon} />
          {canCopy ? (
            <>
              <ButtonCopy
                value={toCopy}
                size="1rem"
                style={{ marginTop: '1.5rem' }}
                children={
                  <h2>
                    {title}
                    &nbsp;
                  </h2>
                }
              />
              <p>{subtitle}</p>
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
