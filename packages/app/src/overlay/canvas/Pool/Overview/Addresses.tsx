// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { CardWrapper } from 'library/Card/Wrappers'
import { CopyAddress } from 'library/ListItem/Buttons/CopyAddress'
import { useTranslation } from 'react-i18next'
import { Subheading } from 'ui-core/canvas'
import { Identity } from 'ui-identity'
import type { OverviewSectionProps } from '../types'
import { AddressesWrapper } from '../Wrappers'

export const Addresses = ({
  bondedPool: { addresses },
}: OverviewSectionProps) => {
  const { t } = useTranslation('app')
  return (
    <CardWrapper className="canvas secondary">
      <Subheading>
        <h3>{t('addresses')}</h3>
      </Subheading>

      <AddressesWrapper>
        <section>
          <Identity
            title={'Stash'}
            address={addresses.stash}
            Action={<CopyAddress address={addresses.stash} />}
          />
        </section>
        <section>
          <Identity
            title={'Reward'}
            address={addresses.reward}
            Action={<CopyAddress address={addresses.reward} />}
          />
        </section>
      </AddressesWrapper>
    </CardWrapper>
  )
}
