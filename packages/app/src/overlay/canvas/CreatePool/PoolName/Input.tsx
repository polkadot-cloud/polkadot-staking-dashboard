// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/types'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export const Input = ({
  listenIsValid,
  defaultValue,
  setters = [],
  value = '',
}: AnyJson) => {
  const { t } = useTranslation('pages')
  const { activeAccount } = useActiveAccounts()

  // the current local bond value
  const [metadata, setMetadata] = useState<string>(value)

  // handle change for bonding
  const handleChange = (e: AnyJson) => {
    const val = e.target.value
    listenIsValid(val !== '')
    setMetadata(val)

    // apply value to parent setters
    for (const s of setters) {
      s.set({
        ...s.current,
        metadata: val,
      })
    }
  }

  // reset value to default when changing account
  useEffect(() => {
    setMetadata(defaultValue ?? '')
  }, [activeAccount])

  return (
    <>
      <div style={{ margin: '1rem 0' }}>
        <input
          className="underline"
          style={{ width: '100%', fontFamily: 'InterSemiBold, sans-serif' }}
          placeholder={t('pools.poolName')}
          type="text"
          onChange={(e: FormEvent<HTMLInputElement>) => handleChange(e)}
          value={metadata ?? ''}
        />
      </div>
      <p>{t('pools.poolNameSupport')}</p>
    </>
  )
}
