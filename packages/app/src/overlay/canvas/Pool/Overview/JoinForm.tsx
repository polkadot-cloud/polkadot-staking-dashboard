// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { unitToPlanck } from '@w3ux/utils'
import type BigNumber from 'bignumber.js'
import { getNetworkData } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import { useSetup } from 'contexts/Setup'
import { defaultPoolProgress } from 'contexts/Setup/defaults'
import { useTransferOptions } from 'contexts/TransferOptions'
import { defaultClaimPermission } from 'global-bus'
import { useBatchCall } from 'hooks/useBatchCall'
import { useBondGreatestFee } from 'hooks/useBondGreatestFee'
import { useSignerWarnings } from 'hooks/useSignerWarnings'
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic'
import { BondFeedback } from 'library/Form/Bond/BondFeedback'
import { ClaimPermissionInput } from 'library/Form/ClaimPermissionInput'
import { SubmitTx } from 'library/SubmitTx'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ClaimPermission } from 'types'
import { useOverlay } from 'ui-overlay'
import { planckToUnitBn } from 'utils'
import type { OverviewSectionProps } from '../types'
import { JoinFormWrapper } from '../Wrappers'

export const JoinForm = ({ bondedPool }: OverviewSectionProps) => {
  const { t } = useTranslation()
  const { serviceApi } = useApi()
  const { network } = useNetwork()
  const {
    closeCanvas,
    config: { options },
  } = useOverlay().canvas
  const { newBatchCall } = useBatchCall()
  const { setActiveAccountSetup } = useSetup()
  const { activeAddress } = useActiveAccounts()
  const { getSignerWarnings } = useSignerWarnings()
  const { getTransferOptions } = useTransferOptions()
  const { unit, units } = getNetworkData(network)
  const largestTxFee = useBondGreatestFee({ bondFor: 'pool' })

  const {
    pool: { totalPossibleBond },
  } = getTransferOptions(activeAddress)

  // Pool claim permission value.
  const [claimPermission, setClaimPermission] = useState<ClaimPermission>(
    defaultClaimPermission
  )

  // Bond amount to join pool with.
  const [bond, setBond] = useState<{ bond: string }>({
    bond: planckToUnitBn(totalPossibleBond, units).toString(),
  })

  // Whether the bond amount is valid.
  const [bondValid, setBondValid] = useState<boolean>(false)

  // feedback errors to trigger modal resize
  const [feedbackErrors, setFeedbackErrors] = useState<string[]>([])

  // Handler to set bond on input change.
  const handleSetBond = (value: { bond: BigNumber }) => {
    setBond({ bond: value.bond.toString() })
  }

  // Whether the form is ready to submit.
  const formValid = bondValid && feedbackErrors.length === 0

  const getTx = () => {
    if (!claimPermission || !formValid) {
      return
    }
    const tx = serviceApi.tx.joinPool(
      bondedPool.id,
      unitToPlanck(!bondValid ? 0 : bond.bond, units),
      claimPermission
    )
    if (!tx) {
      return
    }
    if (!Array.isArray(tx)) {
      return tx
    }
    return newBatchCall(tx, activeAddress)
  }

  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(),
    from: activeAddress,
    shouldSubmit: bondValid,
    callbackSubmit: () => {
      closeCanvas()
      // Optional callback function on join success.
      const onJoinCallback = options?.onJoinCallback
      if (typeof onJoinCallback === 'function') {
        onJoinCallback()
      }
    },
    callbackInBlock: async () => {
      // Reset local storage setup progress
      setActiveAccountSetup('pool', defaultPoolProgress)
    },
  })

  const warnings = getSignerWarnings(
    activeAddress,
    false,
    submitExtrinsic.proxySupported
  )

  return (
    <JoinFormWrapper>
      <h2>{t('joinPool', { ns: 'pages' })}</h2>
      <h4>
        {t('bond', { ns: 'app' })} {unit}
      </h4>
      <div className="input">
        <div>
          <BondFeedback
            joiningPool
            displayFirstWarningOnly
            syncing={largestTxFee.isZero()}
            bondFor={'pool'}
            listenIsValid={(valid, errors) => {
              setBondValid(valid)
              setFeedbackErrors(errors)
            }}
            defaultBond={null}
            setters={[handleSetBond]}
            parentErrors={warnings}
            txFees={BigInt(largestTxFee.toString())}
          />
        </div>
      </div>
      <h4 className="underline">{t('claimSetting', { ns: 'app' })}</h4>
      <ClaimPermissionInput
        current={claimPermission}
        onChange={(val: ClaimPermission) => {
          setClaimPermission(val)
        }}
      />
      <div className="submit">
        <SubmitTx
          displayFor="card"
          submitText={t('joinPool', { ns: 'pages' })}
          valid={formValid}
          {...submitExtrinsic}
          noMargin
        />
      </div>
    </JoinFormWrapper>
  )
}
