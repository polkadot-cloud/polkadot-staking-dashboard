// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { useBondedPools } from 'contexts/Pools/BondedPools'
import { useStaking } from 'contexts/Staking'
import { useSyncing } from 'hooks/useSyncing'
import { useTranslation } from 'react-i18next'
import { ButtonRow } from 'ui-core/base'
import DefaultAccount from '../Account/DefaultAccount'
import PoolAccount from '../Account/PoolAccount'

export const Connected = () => {
  const { t } = useTranslation('library')
  const { isNominating } = useStaking()
  const { activePool } = useActivePool()
  const { poolsMetaData } = useBondedPools()
  const { syncing } = useSyncing(['initialization'])
  const { accountHasSigner } = useImportedAccounts()
  const { activeAccount, activeProxy } = useActiveAccounts()

  return (
    activeAccount && (
      <>
        {/* Default account display / stash label if actively nominating. */}
        <ButtonRow xMargin>
          <DefaultAccount
            value={activeAccount}
            label={
              syncing ? undefined : isNominating() ? 'Nominator' : undefined
            }
            readOnly={!accountHasSigner(activeAccount)}
          />
        </ButtonRow>

        {/* Pool account display / hide if not in pool or if syncing. */}
        {activePool !== null && !syncing && (
          <ButtonRow xMargin>
            <PoolAccount
              label={t('pool')}
              pool={activePool}
              syncing={!Object.values(poolsMetaData).length}
            />
          </ButtonRow>
        )}

        {/* Proxy account display / hide if no proxy. */}
        {activeProxy && (
          <ButtonRow xMargin>
            <DefaultAccount
              value={activeProxy}
              label={t('proxy')}
              readOnly={!accountHasSigner(activeProxy)}
            />
          </ButtonRow>
        )}
      </>
    )
  )
}
