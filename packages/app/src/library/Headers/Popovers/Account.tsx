// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Polkicon } from '@w3ux/react-polkicon'
import { ButtonCopy } from 'library/ButtonCopy'
import { Separator } from 'ui-core/base'

export const Account = ({
  address,
  label,
}: {
  address: string
  label: string
}) => (
  <>
    <Polkicon address={address} fontSize="4rem" />
    <h4 style={{ marginTop: '1rem', marginBottom: '0' }}>{label}:</h4>
    <p style={{ marginTop: '0.2rem' }}>
      {address} &nbsp;
      <ButtonCopy value={address} size="0.95rem" />
    </p>
    <Separator />
  </>
)
