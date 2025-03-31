// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useHelp } from 'contexts/Help'
import { CardWrapper } from 'library/Card/Wrappers'
import { getIdentityDisplay } from 'library/List/Utils'
import { CopyAddress } from 'library/ListItem/Buttons/CopyAddress'
import { useTranslation } from 'react-i18next'
import { ButtonHelp } from 'ui-buttons'
import { Subheading } from 'ui-core/canvas'
import { Identity } from 'ui-identity'
import type { OverviewSectionProps } from '../types'
import { AddressesWrapper } from '../Wrappers'

export const Roles = ({
  bondedPool,
  roleIdentities: { identities, supers },
}: OverviewSectionProps) => {
  const { t } = useTranslation('pages')
  const { openHelp } = useHelp()
  const iconSize = '3rem'

  // Get formatted role identity data
  const rootIdentity = getIdentityDisplay(
    identities[bondedPool?.roles?.root || ''],
    supers[bondedPool?.roles?.root || '']
  )?.data?.display

  const nominatorIdentity = getIdentityDisplay(
    identities[bondedPool?.roles?.nominator || ''],
    supers[bondedPool?.roles?.nominator || '']
  )?.data?.display

  const bouncerIdentity = getIdentityDisplay(
    identities[bondedPool?.roles?.bouncer || ''],
    supers[bondedPool?.roles?.bouncer || '']
  )?.data?.display

  const depositorIdentity = getIdentityDisplay(
    identities[bondedPool?.roles?.depositor || ''],
    supers[bondedPool?.roles?.depositor || '']
  )?.data?.display

  return (
    <div>
      <CardWrapper className="canvas secondary">
        <Subheading>
          <h3>
            {t('roles')}
            <ButtonHelp marginLeft onClick={() => openHelp('Pool Roles')} />
          </h3>
        </Subheading>
        <AddressesWrapper>
          {bondedPool.roles.root && (
            <section>
              <Identity
                title={t('root')}
                address={bondedPool.roles.root}
                identity={rootIdentity}
                Action={<CopyAddress address={bondedPool.roles.root} />}
                iconSize={iconSize}
              />
            </section>
          )}
          {bondedPool.roles.nominator && (
            <section>
              <Identity
                title={t('nominator')}
                address={bondedPool.roles.nominator}
                identity={nominatorIdentity}
                Action={<CopyAddress address={bondedPool.roles.nominator} />}
                iconSize={iconSize}
              />
            </section>
          )}
          {bondedPool.roles.bouncer && (
            <section>
              <Identity
                title={t('bouncer')}
                address={bondedPool.roles.bouncer}
                identity={bouncerIdentity}
                Action={<CopyAddress address={bondedPool.roles.bouncer} />}
                iconSize={iconSize}
              />
            </section>
          )}
          {bondedPool.roles.depositor && (
            <section>
              <Identity
                title={t('depositor')}
                address={bondedPool.roles.depositor}
                identity={depositorIdentity}
                Action={<CopyAddress address={bondedPool.roles.depositor} />}
                iconSize={iconSize}
              />
            </section>
          )}
        </AddressesWrapper>
      </CardWrapper>
    </div>
  )
}
