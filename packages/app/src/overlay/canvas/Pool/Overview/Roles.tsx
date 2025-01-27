// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useHelp } from 'contexts/Help'
import { CardWrapper } from 'library/Card/Wrappers'
import { CopyAddress } from 'library/ListItem/Labels/CopyAddress'
import { useTranslation } from 'react-i18next'
import { ButtonHelp } from 'ui-buttons'
import { Subheading } from 'ui-core/canvas'
import { Identity } from 'ui-identity'
import type { OverviewSectionProps } from '../types'
import { AddressesWrapper } from '../Wrappers'

export const Roles = ({ bondedPool }: OverviewSectionProps) => {
  const { t } = useTranslation('pages')
  const { openHelp } = useHelp()
  const iconSize = '3rem'

  return (
    <div>
      <CardWrapper className="canvas secondary">
        <Subheading>
          <h3>
            {t('pools.roles')}
            <ButtonHelp marginLeft onClick={() => openHelp('Pool Roles')} />
          </h3>
        </Subheading>
        <AddressesWrapper>
          {bondedPool.roles.root && (
            <section>
              <Identity
                title={t('pools.root')}
                address={bondedPool.roles.root}
                Action={<CopyAddress address={bondedPool.roles.root} outline />}
                iconSize={iconSize}
              />
            </section>
          )}
          {bondedPool.roles.nominator && (
            <section>
              <Identity
                title={t('pools.nominator')}
                address={bondedPool.roles.nominator}
                Action={
                  <CopyAddress address={bondedPool.roles.nominator} outline />
                }
                iconSize={iconSize}
              />
            </section>
          )}
          {bondedPool.roles.bouncer && (
            <section>
              <Identity
                title={t('pools.bouncer')}
                address={bondedPool.roles.bouncer}
                Action={
                  <CopyAddress address={bondedPool.roles.bouncer} outline />
                }
                iconSize={iconSize}
              />
            </section>
          )}
          {bondedPool.roles.depositor && (
            <section>
              <Identity
                title={t('pools.depositor')}
                address={bondedPool.roles.depositor}
                Action={
                  <CopyAddress address={bondedPool.roles.depositor} outline />
                }
                iconSize={iconSize}
              />
            </section>
          )}
        </AddressesWrapper>
      </CardWrapper>
    </div>
  )
}
