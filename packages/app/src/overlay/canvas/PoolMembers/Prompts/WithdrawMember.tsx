// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Polkicon } from '@w3ux/react-polkicon'
import { ellipsisFn, rmCommas } from '@w3ux/utils'
import { PoolWithdraw } from 'api/tx/poolWithdraw'
import BigNumber from 'bignumber.js'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import { usePoolMembers } from 'contexts/Pools/PoolMembers'
import type { PoolMembership } from 'contexts/Pools/types'
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
  member: PoolMembership
  memberRef: RefObject<HTMLDivElement>
}) => {
  const { t } = useTranslation('modals')
  const {
    network,
    networkData: { units, unit },
  } = useNetwork()
  const { closePrompt } = usePrompt()
  const { consts, activeEra } = useApi()
  const { activeAccount } = useActiveAccounts()
  const { removePoolMember } = usePoolMembers()
  const { getSignerWarnings } = useSignerWarnings()

  const { historyDepth } = consts
  const { unbondingEras, points } = member

  // calculate total for withdraw
  let totalWithdrawUnit = new BigNumber(0)

  Object.entries(unbondingEras).forEach((entry) => {
    const [era, amount] = entry
    if (activeEra.index.isGreaterThan(era)) {
      totalWithdrawUnit = totalWithdrawUnit.plus(
        new BigNumber(rmCommas(amount as string))
      )
    }
  })

  const bonded = planckToUnitBn(new BigNumber(rmCommas(points)), units)
  const totalWithdraw = planckToUnitBn(new BigNumber(totalWithdrawUnit), units)

  // valid to submit transaction
  const [valid] = useState<boolean>(!totalWithdraw.isZero())

  const getTx = () => {
    if (!valid) {
      return null
    }
    return new PoolWithdraw(network, who, historyDepth.toNumber()).tx()
  }
  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(),
    from: activeAccount,
    shouldSubmit: valid,
    callbackSubmit: () => {
      // remove the pool member from member list.
      memberRef.current?.remove()
      closePrompt()
    },
    callbackInBlock: () => {
      // remove the pool member from context if no more funds bonded.
      if (bonded.isZero()) {
        removePoolMember(who)
      }
    },
  })

  const warnings = getSignerWarnings(
    activeAccount,
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
