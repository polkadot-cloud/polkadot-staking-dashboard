// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Polkicon } from '@w3ux/react-polkicon'
import { ellipsisFn } from '@w3ux/utils'
import { Identity as IdentityBase } from 'ui-core/base'
import type { IdentityProps } from './types'

export const Identity = ({ title, address, Action }: IdentityProps) => {
  const Icon = <Polkicon address={address} />
  return (
    <IdentityBase
      Icon={Icon}
      label={title}
      address={address}
      subheading={ellipsisFn(address, 5)}
      Action={Action}
    />
  )
}
