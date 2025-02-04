// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { u8aToString, u8aUnwrapBytes } from '@polkadot/util'
import { Polkicon } from '@w3ux/react-polkicon'
import { ellipsisFn } from '@w3ux/utils'
import { useBondedPools } from 'contexts/Pools/BondedPools'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Wrapper } from './Wrapper'
import type { PoolAccountProps } from './types'

const PoolAccount = ({ label, pool, syncing }: PoolAccountProps) => {
  const { t } = useTranslation('library')
  const { poolsMetaData } = useBondedPools()

  // Default display text value.
  const defaultDisplay = ellipsisFn(pool.addresses.stash)

  let text = syncing ? t('syncing') : (poolsMetaData[pool.id] ?? defaultDisplay)

  // Check if super identity has been byte encoded.
  const displayAsBytes = u8aToString(u8aUnwrapBytes(text))
  if (displayAsBytes !== '') {
    text = displayAsBytes
  }
  // If still empty string, default to clipped address.
  if (text === '') {
    text = defaultDisplay
  }

  return (
    <Wrapper>
      {label !== undefined && <div className="account-label">{label}</div>}
      <Polkicon address={pool.addresses.stash} transform="grow-3" />
      <span className={`title${syncing === true ? ` syncing` : ``}`}>
        {text}
      </span>
    </Wrapper>
  )
}

export default memo(PoolAccount)
