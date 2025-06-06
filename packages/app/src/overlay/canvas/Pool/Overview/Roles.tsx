// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { CardWrapper } from 'library/Card/Wrappers'
import { getIdentityDisplay } from 'library/List/Utils'
import { CopyAddress } from 'library/ListItem/Buttons/CopyAddress'
import { useTranslation } from 'react-i18next'
import { Subheading } from 'ui-core/canvas'
import { Identity } from 'ui-identity'
import type { OverviewSectionProps } from '../types'
import { AddressesWrapper } from '../Wrappers'

export const Roles = ({
  bondedPool,
  roleIdentities: { identities, supers },
}: OverviewSectionProps) => {
  const { t } = useTranslation('pages')
  const iconSize = '3rem'

  const rootAddress = bondedPool?.roles?.root || ''
  const nominatorAddress = bondedPool?.roles?.nominator || ''
  const bouncerAddress = bondedPool?.roles?.bouncer || ''
  const depositorAddress = bondedPool?.roles?.depositor || ''

  // Get formatted role identity data
  const rootIdentity = getIdentityDisplay(
    identities[rootAddress],
    supers[rootAddress]
  )?.data?.display

  const nominatorIdentity = getIdentityDisplay(
    identities[nominatorAddress],
    supers[nominatorAddress]
  )?.data?.display

  const bouncerIdentity = getIdentityDisplay(
    identities[bouncerAddress],
    supers[bouncerAddress]
  )?.data?.display

  const depositorIdentity = getIdentityDisplay(
    identities[depositorAddress],
    supers[depositorAddress]
  )?.data?.display

  return (
    <div>
      <CardWrapper className="canvas secondary">
        <Subheading>
          <h3>{t('roles')}</h3>
        </Subheading>
        <AddressesWrapper>
          {bondedPool.roles.root && (
            <section>
              <Identity
                title={t('root')}
                address={rootAddress}
                identity={rootIdentity}
                Action={<CopyAddress address={rootAddress} />}
                iconSize={iconSize}
              />
            </section>
          )}
          {bondedPool.roles.nominator && (
            <section>
              <Identity
                title={t('nominator')}
                address={nominatorAddress}
                identity={nominatorIdentity}
                Action={<CopyAddress address={nominatorAddress} />}
                iconSize={iconSize}
              />
            </section>
          )}
          {bondedPool.roles.bouncer && (
            <section>
              <Identity
                title={t('bouncer')}
                address={bouncerAddress}
                identity={bouncerIdentity}
                Action={<CopyAddress address={bouncerAddress} />}
                iconSize={iconSize}
              />
            </section>
          )}
          {bondedPool.roles.depositor && (
            <section>
              <Identity
                title={t('depositor')}
                address={depositorAddress}
                identity={depositorIdentity}
                Action={<CopyAddress address={depositorAddress} />}
                iconSize={iconSize}
              />
            </section>
          )}
        </AddressesWrapper>
      </CardWrapper>
    </div>
  )
}
