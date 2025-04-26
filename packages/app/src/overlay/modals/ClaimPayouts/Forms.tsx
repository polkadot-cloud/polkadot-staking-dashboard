// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { planckToUnit } from '@w3ux/utils'
import BigNumber from 'bignumber.js'
import type { AnyApi } from 'common-types'
import { getNetworkData } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import { usePayouts } from 'contexts/Payouts'
import { useBatchCall } from 'hooks/useBatchCall'
import { useSignerWarnings } from 'hooks/useSignerWarnings'
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic'
import { ActionItem } from 'library/ActionItem'
import { Warning } from 'library/Form/Warning'
import { SubmitTx } from 'library/SubmitTx'
import type { ForwardedRef } from 'react'
import { forwardRef, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ButtonSubmitInvert } from 'ui-buttons'
import { Padding, Warnings } from 'ui-core/modal'
import { useOverlay } from 'ui-overlay'
import type { ActivePayout, FormProps } from './types'
import { ContentWrapper } from './Wrappers'

export const Forms = forwardRef(
  (
    { setSection, payouts, setPayouts, onResize }: FormProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const { t } = useTranslation('modals')
    const { network } = useNetwork()
    const { serviceApi } = useApi()
    const { newBatchCall } = useBatchCall()
    const { setModalStatus } = useOverlay().modal
    const { activeAddress } = useActiveAccounts()
    const { getSignerWarnings } = useSignerWarnings()
    const { unclaimedRewards, setUnclaimedRewards } = usePayouts()
    const { unit, units } = getNetworkData(network)

    // Get the total payout amount
    const totalPayout =
      payouts?.reduce(
        (total: BigNumber, cur: ActivePayout) => total.plus(cur.payout),
        new BigNumber(0)
      ) || new BigNumber(0)

    // Get the total number of validators per payout per era
    const totalPayoutValidators =
      payouts?.reduce(
        (prev, { paginatedValidators }) =>
          prev + (paginatedValidators?.length || 0),
        0
      ) || 0

    const [valid, setValid] = useState<boolean>(
      totalPayout.isGreaterThan(0) && totalPayoutValidators > 0
    )

    const getCalls = () => {
      const calls =
        payouts?.reduce((acc: AnyApi[], { era, paginatedValidators }) => {
          if (!paginatedValidators.length) {
            return acc
          }
          paginatedValidators.forEach(([page, v]) => {
            const tx = serviceApi.tx.payoutStakersByPage(v, Number(era), page)
            if (tx) {
              acc.push(tx)
            }
          })
          return acc
        }, []) || []
      return calls
    }

    const getTx = () => {
      const calls = getCalls()
      if (!valid || !calls.length) {
        return
      }
      return calls.length === 1
        ? calls.pop()
        : newBatchCall(calls, activeAddress)
    }

    const submitExtrinsic = useSubmitExtrinsic({
      tx: getTx(),
      from: activeAddress,
      shouldSubmit: valid,
      callbackSubmit: () => {
        setModalStatus('closing')
      },
      callbackInBlock: () => {
        if (payouts && activeAddress) {
          // Deduct unclaimed payout value from state value
          const eraPayouts: string[] = []
          payouts.forEach(({ era }) => {
            eraPayouts.push(String(era))
          })
          const newUnclaimedRewards = {
            total: new BigNumber(unclaimedRewards.total)
              .minus(totalPayout)
              .toString(),
            entries: unclaimedRewards.entries.filter(
              (entry) => !eraPayouts.includes(String(entry.era))
            ),
          }
          setUnclaimedRewards(newUnclaimedRewards)
        }
        // Reset active form payouts for this modal
        setPayouts([])
      },
    })

    const warnings = getSignerWarnings(
      activeAddress,
      false,
      submitExtrinsic.proxySupported
    )

    // Ensure payouts value is valid
    useEffect(
      () => setValid(totalPayout.isGreaterThan(0) && totalPayoutValidators > 0),
      [payouts]
    )

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
              <ActionItem
                text={`${t('claim')} ${planckToUnit(
                  totalPayout.toString(),
                  units
                )} ${unit}`}
              />
              <p>{t('afterClaiming')}</p>
            </div>
          </Padding>
          <SubmitTx
            onResize={onResize}
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
          />
        </div>
      </ContentWrapper>
    )
  }
)

Forms.displayName = 'Forms'
