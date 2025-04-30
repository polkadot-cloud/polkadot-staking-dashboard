// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { planckToUnit } from '@w3ux/utils'
import BigNumber from 'bignumber.js'
import { getNetworkData } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { useBondedPools } from 'contexts/Pools/BondedPools'
import { useFavoritePools } from 'contexts/Pools/FavoritePools'
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
    const {
      setModalStatus,
      config: { options },
    } = useOverlay().modal
    const { network } = useNetwork()
    const { activePool } = useActivePool()
    const { getConsts, serviceApi } = useApi()
    const { activeAddress } = useActiveAccounts()
    const { removeFromBondedPools } = useBondedPools()
    const { getSignerWarnings } = useSignerWarnings()
    const { removeFavorite: removeFavoritePool } = useFavoritePools()

    const { unit, units } = getNetworkData(network)
    const { bondFor, poolClosure } = options || {}
    const { historyDepth } = getConsts(network)

    const isStaking = bondFor === 'nominator'
    const isPooling = bondFor === 'pool'

    // valid to submit transaction
    const [valid, setValid] = useState<boolean>(
      (unlock?.value || 0n) > 0 || false
    )

    const getTx = () => {
      if (!valid || !unlock) {
        return
      }
      if (task === 'rebond' && isStaking) {
        return serviceApi.tx.stakingRebond(unlock.value || 0n)
      }
      if (task === 'withdraw' && isStaking) {
        return serviceApi.tx.stakingWithdraw(historyDepth)
      }
      if (task === 'withdraw' && isPooling && activePool) {
        if (activeAddress) {
          return serviceApi.tx.poolWithdraw(activeAddress, historyDepth)
        }
      }
      return
    }

    const submitExtrinsic = useSubmitExtrinsic({
      tx: getTx(),
      from: activeAddress,
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
      },
    })

    const value = unlock?.value || 0n
    const warnings = getSignerWarnings(
      activeAddress,
      isStaking,
      submitExtrinsic.proxySupported
    )

    // Ensure unlock value is valid.
    useEffect(() => {
      setValid((unlock?.value || 0n) > 0 || false)
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
                    text={`${t('rebond')} ${new BigNumber(
                      planckToUnit(value, units)
                    ).toFormat()} ${unit}`}
                  />
                  <p>{t('rebondSubtitle')}</p>
                </>
              )}
              {task === 'withdraw' && (
                <>
                  <ActionItem
                    text={`${t('withdraw')} ${new BigNumber(
                      planckToUnit(value, units)
                    ).toFormat()} ${unit}`}
                  />
                  <p>{t('withdrawSubtitle')}</p>
                </>
              )}
            </div>
          </Padding>
          <SubmitTx
            requiresMigratedController={isStaking}
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
