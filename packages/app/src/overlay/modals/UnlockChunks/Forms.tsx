// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { rmCommas } from '@w3ux/utils'
import { PoolWithdraw } from 'api/tx/poolWithdraw'
import { StakingRebond } from 'api/tx/stakingRebond'
import { StakingWithdraw } from 'api/tx/stakingWithdraw'
import BigNumber from 'bignumber.js'
import { getNetworkData } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useBalances } from 'contexts/Balances'
import { useBonded } from 'contexts/Bonded'
import { useNetwork } from 'contexts/Network'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { useBondedPools } from 'contexts/Pools/BondedPools'
import { useFavoritePools } from 'contexts/Pools/FavoritePools'
import { usePoolMembers } from 'contexts/Pools/PoolMembers'
import { useSignerWarnings } from 'hooks/useSignerWarnings'
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic'
import { ActionItem } from 'library/ActionItem'
import { Warning } from 'library/Form/Warning'
import { SubmitTx } from 'library/SubmitTx'
import { forwardRef, useEffect, useState, type ForwardedRef } from 'react'
import { useTranslation } from 'react-i18next'
import { ButtonSubmitInvert } from 'ui-buttons'
import { Padding, Warnings } from 'ui-core/modal'
import { useOverlay } from 'ui-overlay'
import { planckToUnitBn } from 'utils'
import type { FormsProps } from './types'
import { ContentWrapper } from './Wrappers'

export const Forms = forwardRef(
  (
    {
      setSection,
      unlock,
      task,
      incrementCalculateHeight,
      onResize,
    }: FormsProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const { t } = useTranslation('modals')
    const { consts } = useApi()
    const { network } = useNetwork()
    const { activePool } = useActivePool()
    const { activeAccount } = useActiveAccounts()
    const { removePoolMember } = usePoolMembers()
    const { removeFromBondedPools } = useBondedPools()
    const {
      setModalStatus,
      config: { options },
    } = useOverlay().modal
    const { getBondedAccount } = useBonded()
    const { getPoolMembership } = useBalances()
    const { getSignerWarnings } = useSignerWarnings()
    const { removeFavorite: removeFavoritePool } = useFavoritePools()

    const { unit, units } = getNetworkData(network)
    const membership = getPoolMembership(activeAccount)
    const { bondFor, poolClosure } = options || {}
    const { historyDepth } = consts
    const controller = getBondedAccount(activeAccount)

    const isStaking = bondFor === 'nominator'
    const isPooling = bondFor === 'pool'

    // valid to submit transaction
    const [valid, setValid] = useState<boolean>(
      (unlock?.value?.toNumber() || 0) > 0 || false
    )

    const getTx = () => {
      if (!valid || !unlock) {
        return null
      }
      if (task === 'rebond' && isStaking) {
        return new StakingRebond(
          network,
          BigInt(unlock.value.toNumber() || 0)
        ).tx()
      }
      if (task === 'withdraw' && isStaking) {
        return new StakingWithdraw(network, historyDepth.toNumber()).tx()
      }
      if (task === 'withdraw' && isPooling && activePool) {
        if (activeAccount) {
          return new PoolWithdraw(
            network,
            activeAccount,
            historyDepth.toNumber()
          ).tx()
        }
      }
      return null
    }
    const signingAccount = isStaking ? controller : activeAccount
    const submitExtrinsic = useSubmitExtrinsic({
      tx: getTx(),
      from: signingAccount,
      shouldSubmit: valid,
      callbackSubmit: () => {
        setModalStatus('closing')
      },
      callbackInBlock: () => {
        // if pool is being closed, remove from static lists
        if (poolClosure) {
          removeFavoritePool(activePool?.addresses?.stash ?? '')
          removeFromBondedPools(activePool?.id ?? 0)
        }

        // if no more bonded funds from pool, remove from poolMembers list
        if (bondFor === 'pool') {
          const points = membership?.points ? rmCommas(membership.points) : 0
          const bonded = planckToUnitBn(new BigNumber(points), units)
          if (bonded.isZero()) {
            removePoolMember(activeAccount)
          }
        }
      },
    })

    const value = unlock?.value ?? new BigNumber(0)

    const warnings = getSignerWarnings(
      activeAccount,
      isStaking,
      submitExtrinsic.proxySupported
    )

    // Ensure unlock value is valid.
    useEffect(() => {
      setValid((unlock?.value?.toNumber() || 0) > 0 || false)
    }, [unlock])

    // Trigger modal resize when commission options are enabled / disabled.
    useEffect(() => {
      incrementCalculateHeight()
    }, [valid])

    return (
      <ContentWrapper>
        <div ref={ref}>
          <Padding horizontalOnly>
            {warnings.length > 0 ? (
              <Warnings>
                {warnings.map((text, i) => (
                  <Warning key={`warning${i}`} text={text} />
                ))}
              </Warnings>
            ) : null}
            <div style={{ marginBottom: '2rem' }}>
              {task === 'rebond' && (
                <>
                  <ActionItem
                    text={`${t('rebond')} ${planckToUnitBn(
                      value,
                      units
                    )} ${unit}`}
                  />
                  <p>{t('rebondSubtitle')}</p>
                </>
              )}
              {task === 'withdraw' && (
                <>
                  <ActionItem
                    text={`${t('withdraw')} ${planckToUnitBn(
                      value,
                      units
                    )} ${unit}`}
                  />
                  <p>{t('withdrawSubtitle')}</p>
                </>
              )}
            </div>
          </Padding>
          <SubmitTx
            fromController={isStaking}
            valid={valid}
            buttons={[
              <ButtonSubmitInvert
                key="button_back"
                text={t('back')}
                iconLeft={faChevronLeft}
                iconTransform="shrink-1"
                onClick={() => setSection(0)}
              />,
            ]}
            {...submitExtrinsic}
            onResize={onResize}
          />
        </div>
      </ContentWrapper>
    )
  }
)

Forms.displayName = 'Forms'
