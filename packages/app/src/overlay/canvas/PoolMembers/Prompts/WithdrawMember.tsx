// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Polkicon } from '@w3ux/react-polkicon'
import { ellipsisFn } from '@w3ux/utils'
import BigNumber from 'bignumber.js'
import { getNetworkData } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import type { FetchedPoolMember } from 'contexts/Pools/PoolMembers/types'
import { usePrompt } from 'contexts/Prompt'
import { useSignerWarnings } from 'hooks/useSignerWarnings'
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic'
import { Warning } from 'library/Form/Warning'
import { Title } from 'library/Prompt/Title'
import { SubmitTx } from 'library/SubmitTx'
import type { RefObject } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Notes, Padding, Warnings } from 'ui-core/modal'
import { planckToUnitBn } from 'utils'

export const WithdrawMember = ({
  who,
  member,
  memberRef,
}: {
  who: string
  member: FetchedPoolMember
  memberRef: RefObject<HTMLDivElement | null>
}) => {
  const { t } = useTranslation('modals')
  const { network } = useNetwork()
  const { serviceApi } = useApi()
  const { closePrompt } = usePrompt()
  const { getConsts, activeEra } = useApi()
  const { activeAddress } = useActiveAccounts()
  const { getSignerWarnings } = useSignerWarnings()
  const { unit, units } = getNetworkData(network)
  const { historyDepth } = getConsts(network)
  const { unbondingEras, points } = member

  // calculate total for withdraw
  let totalWithdrawUnit = new BigNumber(0)

  unbondingEras.forEach(([era, amount]) => {
    if (activeEra.index > Number(era)) {
      totalWithdrawUnit = totalWithdrawUnit.plus(new BigNumber(amount))
    }
  })

  const bonded = planckToUnitBn(new BigNumber(points), units)
  const totalWithdraw = planckToUnitBn(new BigNumber(totalWithdrawUnit), units)

  // valid to submit transaction
  const [valid] = useState<boolean>(!totalWithdraw.isZero())

  const getTx = () => {
    if (!valid) {
      return
    }
    return serviceApi.tx.poolWithdraw(who, historyDepth)
  }
  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(),
    from: activeAddress,
    shouldSubmit: valid,
    callbackSubmit: () => {
      // Remove the pool member from member list
      memberRef.current?.remove()
      closePrompt()
    },
  })

  const warnings = getSignerWarnings(
    activeAddress,
    false,
    submitExtrinsic.proxySupported
  )

  return (
    <>
      <Title title={t('withdrawPoolMember')} />
      <Padding>
        {warnings.length > 0 ? (
          <Warnings>
            {warnings.map((text, i) => (
              <Warning key={`warning${i}`} text={text} />
            ))}
          </Warnings>
        ) : null}

        <h3 style={{ display: 'flex', alignItems: 'center' }}>
          <Polkicon address={who} transform="grow-3" />
          &nbsp; {ellipsisFn(who, 7)}
        </h3>

        <Notes>
          <p>
            <p>
              {t('amountWillBeWithdrawn', { bond: bonded.toString(), unit })}
            </p>{' '}
          </p>
          <p>{t('withdrawRemoveNote')}</p>
        </Notes>
      </Padding>
      <SubmitTx valid={valid} {...submitExtrinsic} />
    </>
  )
}
