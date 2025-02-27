// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { PoolSetState } from 'api/tx/poolSetState'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useNetwork } from 'contexts/Network'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { useBondedPools } from 'contexts/Pools/BondedPools'
import { useSignerWarnings } from 'hooks/useSignerWarnings'
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic'
import { ActionItem } from 'library/ActionItem'
import { Warning } from 'library/Form/Warning'
import { SubmitTx } from 'library/SubmitTx'
import type { Dispatch, SetStateAction } from 'react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ButtonSubmitInvert } from 'ui-buttons'
import { Padding, Warnings } from 'ui-core/modal'
import { useOverlay } from 'ui-overlay'

export const SetPoolState = ({
  setSection,
  task = '',
  onResize,
}: {
  setSection: Dispatch<SetStateAction<number>>
  task?: string
  onResize: () => void
}) => {
  const { t } = useTranslation('modals')
  const { network } = useNetwork()
  const { setModalStatus } = useOverlay().modal
  const { activeAccount } = useActiveAccounts()
  const { getSignerWarnings } = useSignerWarnings()
  const { isOwner, isBouncer, activePool } = useActivePool()
  const { updateBondedPools, getBondedPool } = useBondedPools()

  const poolId = activePool?.id

  // valid to submit transaction
  const [valid, setValid] = useState<boolean>(false)

  // ensure account has relevant roles for task
  const canToggle =
    (isOwner() || isBouncer()) &&
    ['destroy_pool', 'unlock_pool', 'lock_pool'].includes(task)

  useEffect(() => {
    setValid(canToggle)
  }, [canToggle])

  const content = (() => {
    let title
    let message
    switch (task) {
      case 'destroy_pool':
        title = <ActionItem text={t('setToDestroying')} />
        message = <p>{t('setToDestroyingSubtitle')}</p>
        break
      case 'unlock_pool':
        title = <ActionItem text={t('unlockPool')} />
        message = <p>{t('unlockPoolSubtitle')}</p>
        break
      default:
        title = <ActionItem text={t('lockPool')} />
        message = <p>{t('lockPoolSubtitle')}</p>
    }
    return { title, message }
  })()

  const poolStateFromTask = (s: string) => {
    switch (s) {
      case 'destroy_pool':
        return 'Destroying'
      case 'lock_pool':
        return 'Blocked'
      default:
        return 'Open'
    }
  }

  const getTx = () => {
    if (!valid || poolId === undefined) {
      return null
    }
    let tx
    switch (task) {
      case 'destroy_pool':
        tx = new PoolSetState(network, poolId, 'Destroying').tx()
        break
      case 'unlock_pool':
        tx = new PoolSetState(network, poolId, 'Open').tx()

        break
      case 'lock_pool':
        tx = new PoolSetState(network, poolId, 'Blocked').tx()
        break
      default:
        tx = null
    }
    return tx
  }

  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(),
    from: activeAccount,
    shouldSubmit: true,
    callbackSubmit: () => {
      setModalStatus('closing')
    },
    callbackInBlock: () => {
      // reflect updated state in `bondedPools` list.
      if (
        ['destroy_pool', 'unlock_pool', 'lock_pool'].includes(task) &&
        poolId
      ) {
        const pool = getBondedPool(poolId)
        if (pool) {
          updateBondedPools([
            {
              ...pool,
              state: poolStateFromTask(task),
            },
          ])
        }
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
      <Padding horizontalOnly>
        {warnings.length > 0 ? (
          <Warnings>
            {warnings.map((text, i) => (
              <Warning key={`warning${i}`} text={text} />
            ))}
          </Warnings>
        ) : null}
        {content.title}
        {content.message}
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
