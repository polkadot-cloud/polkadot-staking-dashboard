// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { PoolUpdateRoles } from 'api/tx/poolUpdateRoles'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useNetwork } from 'contexts/Network'
import { useBondedPools } from 'contexts/Pools/BondedPools'
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic'
import { SubmitTx } from 'library/SubmitTx'
import { useTranslation } from 'react-i18next'
import { Padding, Title } from 'ui-core/modal'
import { Close, useOverlay } from 'ui-overlay'
import { RoleChange } from './RoleChange'
import { Wrapper } from './Wrapper'

export const ChangePoolRoles = () => {
  const { t } = useTranslation('modals')
  const { network } = useNetwork()
  const { replacePoolRoles } = useBondedPools()
  const { activeAccount } = useActiveAccounts()
  const {
    setModalStatus,
    config: { options },
  } = useOverlay().modal
  const { id: poolId, roleEdits } = options

  const getTx = () =>
    new PoolUpdateRoles(network, poolId, {
      root: roleEdits?.root?.newAddress || undefined,
      nominator: roleEdits?.nominator?.newAddress || undefined,
      bouncer: roleEdits?.bouncer?.newAddress || undefined,
    }).tx()

  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(),
    from: activeAccount,
    shouldSubmit: true,
    callbackSubmit: () => {
      setModalStatus('closing')
    },
    callbackInBlock: () => {
      // manually update bondedPools with new pool roles
      replacePoolRoles(poolId, roleEdits)
    },
  })

  return (
    <>
      <Close />
      <Padding>
        <Title>{t('changePoolRoles')}</Title>
        <Wrapper>
          <RoleChange
            roleName={t('root')}
            oldAddress={roleEdits?.root?.oldAddress}
            newAddress={roleEdits?.root?.newAddress}
          />
          <RoleChange
            roleName={t('nominator')}
            oldAddress={roleEdits?.nominator?.oldAddress}
            newAddress={roleEdits?.nominator?.newAddress}
          />
          <RoleChange
            roleName={t('bouncer')}
            oldAddress={roleEdits?.bouncer?.oldAddress}
            newAddress={roleEdits?.bouncer?.newAddress}
          />
        </Wrapper>
      </Padding>
      <SubmitTx {...submitExtrinsic} valid />
    </>
  )
}
