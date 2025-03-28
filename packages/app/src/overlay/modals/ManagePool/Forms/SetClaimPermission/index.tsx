// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { PoolSetClaimPermission } from 'api/tx/poolSetClaimPermission'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useBalances } from 'contexts/Balances'
import { useNetwork } from 'contexts/Network'
import { useActivePool } from 'contexts/Pools/ActivePool'
import type { ClaimPermission } from 'contexts/Pools/types'
import { defaultClaimPermission } from 'controllers/ActivePools/defaults'
import { useSignerWarnings } from 'hooks/useSignerWarnings'
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic'
import { ClaimPermissionInput } from 'library/Form/ClaimPermissionInput'
import { Warning } from 'library/Form/Warning'
import { SubmitTx } from 'library/SubmitTx'
import type { Dispatch, SetStateAction } from 'react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ButtonSubmitInvert } from 'ui-buttons'
import { Padding, Warnings } from 'ui-core/modal'
import { useOverlay } from 'ui-overlay'

export const SetClaimPermission = ({
  setSection,
  section,
  onResize,
}: {
  section: number
  setSection: Dispatch<SetStateAction<number>>
  onResize: () => void
}) => {
  const { t } = useTranslation('modals')
  const { network } = useNetwork()
  const { getPoolMembership } = useBalances()
  const { activeAccount } = useActiveAccounts()
  const { setModalStatus } = useOverlay().modal
  const { isOwner, isMember } = useActivePool()
  const { getSignerWarnings } = useSignerWarnings()

  const membership = getPoolMembership(activeAccount)

  // Valid to submit transaction.
  const [valid, setValid] = useState<boolean>(false)

  // Updated claim permission value.
  const [claimPermission, setClaimPermission] = useState<
    ClaimPermission | undefined
  >(membership?.claimPermission)

  // Determine current pool metadata and set in state.
  useEffect(() => {
    const current = membership?.claimPermission
    if (current) {
      setClaimPermission(membership?.claimPermission)
    }
  }, [section, membership])

  useEffect(() => {
    setValid(isOwner() || (isMember() && claimPermission !== undefined))
  }, [isOwner(), isMember()])

  const getTx = () => {
    if (!valid || !claimPermission) {
      return null
    }
    return new PoolSetClaimPermission(network, claimPermission).tx()
  }

  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(),
    from: activeAccount,
    shouldSubmit: true,
    callbackSubmit: () => {
      setModalStatus('closing')
    },
  })

  const warnings = getSignerWarnings(
    activeAccount,
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

        <ClaimPermissionInput
          current={membership?.claimPermission || defaultClaimPermission}
          onChange={(val: ClaimPermission | undefined) => {
            setClaimPermission(val)
          }}
        />
      </Padding>
      <SubmitTx
        valid={valid && claimPermission !== membership?.claimPermission}
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
