// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Polkicon } from '@w3ux/react-polkicon'
import { ellipsisFn } from '@w3ux/utils'
import { motion } from 'framer-motion'
import { ButtonCopy } from 'library/ButtonCopy'
import { getIdentityDisplay } from 'library/List/Utils'
import { useTranslation } from 'react-i18next'
import type { PoolAccountProps } from '../types'
import { Wrapper } from './Wrapper'

export const PoolAccount = ({ address, pool }: PoolAccountProps) => {
  const { t } = useTranslation('pages')

  const roleIdentities = pool?.bondedPool?.roleIdentities
  const identities = roleIdentities?.identities || {}
  const supers = roleIdentities?.supers || {}
  const synced = roleIdentities !== undefined

  const display = address
    ? getIdentityDisplay(identities[address], supers[address]).node
    : null

  return (
    <Wrapper>
      <motion.div
        className="account"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {address === null ? (
          <h4>{t('pools.notSet')}</h4>
        ) : synced && display !== null ? (
          <>
            <div className="icon">
              <Polkicon address={address} />
            </div>
            <h4>{display}</h4>
          </>
        ) : (
          <>
            <div className="icon">
              <Polkicon address={address} />
            </div>
            <h4>{ellipsisFn(address)}</h4>
          </>
        )}
        <div>
          {address !== null && (
            <span className="copy">
              <ButtonCopy value={address} size="1rem" />
            </span>
          )}
        </div>
      </motion.div>
    </Wrapper>
  )
}
