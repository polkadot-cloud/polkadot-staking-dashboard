// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { planckToUnit } from '@w3ux/utils'
import { PayoutStakersByPage } from 'api/tx/payoutStakersByPage'
import BigNumber from 'bignumber.js'
import type { AnyApi } from 'common-types'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
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
    const {
      network,
      networkData: { units, unit },
    } = useNetwork()
    const { newBatchCall } = useBatchCall()
    const { setModalStatus } = useOverlay().modal
    const { activeAccount } = useActiveAccounts()
    const { getSignerWarnings } = useSignerWarnings()
    const { unclaimedRewards, setUnclaimedRewards } = usePayouts()

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
            const tx = new PayoutStakersByPage(
              network,
              v,
              Number(era),
              page
            ).tx()
            if (tx) {
              acc.push(tx)
            }
          })
          return acc
        }, []) || []
      return calls
    }

    const getTx = () => {
      const tx = null
      const calls = getCalls()
      if (!valid || !calls.length) {
        return tx
      }
      return calls.length === 1
        ? calls.pop()
        : newBatchCall(calls, activeAccount)
    }

    const submitExtrinsic = useSubmitExtrinsic({
      tx: getTx(),
      from: activeAccount,
      shouldSubmit: valid,
      callbackSubmit: () => {
        setModalStatus('closing')
      },
      callbackInBlock: () => {
        if (payouts && activeAccount) {
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
      activeAccount,
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
            fromController={false}
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
