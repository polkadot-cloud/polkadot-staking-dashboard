// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Polkicon } from '@w3ux/react-polkicon'
import { ButtonCopy } from 'library/ButtonCopy'
import { Separator } from 'ui-core/base'
import { Padding, Stat } from 'ui-core/popover'

export const Account = ({
  address,
  label,
}: {
  address: string
  label: string
}) => (
  <>
    <Padding>
      <Polkicon address={address} fontSize="3.5rem" />
      <Stat.Label>{label}</Stat.Label>
      <Stat.Value>
        {address} &nbsp;
        <ButtonCopy value={address} size="0.95rem" />
      </Stat.Value>
    </Padding>
    <Separator />
  </>
)
