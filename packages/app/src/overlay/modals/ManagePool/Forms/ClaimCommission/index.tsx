// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import BigNumber from 'bignumber.js'
import { getStakingChainData } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { useSignerWarnings } from 'hooks/useSignerWarnings'
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic'
import { ActionItem } from 'library/ActionItem'
import { Warning } from 'library/Form/Warning'
import { SubmitTx } from 'library/SubmitTx'
import type { Dispatch, SetStateAction } from 'react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ButtonSubmitInvert } from 'ui-buttons'
import { Notes, Padding, Warnings } from 'ui-core/modal'
import { useOverlay } from 'ui-overlay'
import { planckToUnitBn } from 'utils'

export const ClaimCommission = ({
  setSection,
  onResize,
}: {
  setSection: Dispatch<SetStateAction<number>>
  onResize: () => void
}) => {
  const { t } = useTranslation('modals')
  const { network } = useNetwork()
  const { serviceApi } = useApi()
  const { setModalStatus } = useOverlay().modal
  const { activeAddress } = useActiveAccounts()
  const { isOwner, activePool } = useActivePool()
  const { getSignerWarnings } = useSignerWarnings()

  const { unit, units } = getStakingChainData(network)
  const poolId = activePool?.id
  const pendingCommission = new BigNumber(
    activePool?.rewardPool?.totalCommissionPending || 0
  )

  // valid to submit transaction
  const [valid, setValid] = useState<boolean>(false)

  useEffect(() => {
    setValid(isOwner() && pendingCommission.isGreaterThan(0))
  }, [activePool, pendingCommission])

  const getTx = () => {
    if (!valid || poolId === undefined) {
      return
    }
    return serviceApi.tx.poolClaimCommission(poolId)
  }

  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(),
    from: activeAddress,
    shouldSubmit: true,
    callbackSubmit: () => {
      setModalStatus('closing')
    },
  })

  const warnings = getSignerWarnings(
    activeAddress,
    false,
    submitExtrinsic.proxySupported
  )

  return (
    <>
      <Padding horizontalOnly>
        {warnings.length > 0 ? (
          <Warnings>
            {warnings.map((text, i) => (
              <Warning key={`warning${i}`} text={text} />
            ))}
          </Warnings>
        ) : null}
        <ActionItem
          text={`${t('claim')} ${planckToUnitBn(
            pendingCommission,
            units
          ).toString()} ${unit} `}
        />
        <Notes>
          <p>{t('sentToCommissionPayee')}</p>
        </Notes>
      </Padding>
      <SubmitTx
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
        onResize={onResize}
        {...submitExtrinsic}
      />
    </>
  )
}
