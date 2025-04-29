// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
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
  const { serviceApi } = useApi()
  const { replacePoolRoles } = useBondedPools()
  const { activeAddress } = useActiveAccounts()
  const {
    setModalStatus,
    config: { options },
  } = useOverlay().modal
  const { id: poolId, roleEdits } = options

  const getTx = () =>
    serviceApi.tx.poolUpdateRoles(poolId, {
      root: roleEdits?.root?.newAddress || undefined,
      nominator: roleEdits?.nominator?.newAddress || undefined,
      bouncer: roleEdits?.bouncer?.newAddress || undefined,
    })

  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(),
    from: activeAddress,
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
