// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { unitToPlanck } from '@w3ux/utils'
import { getNetworkData } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import { useBatchCall } from 'hooks/useBatchCall'
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic'
import { SubmitTx } from 'library/SubmitTx'
import { Padding, Title } from 'ui-core/modal'
import { Close, useOverlay } from 'ui-overlay'

export const BalanceTest = () => {
  const { serviceApi } = useApi()
  const { network } = useNetwork()
  const { newBatchCall } = useBatchCall()
  const { activeAddress } = useActiveAccounts()
  const { setModalStatus } = useOverlay().modal
  const { units } = getNetworkData(network)

  const getTx = () => {
    if (!activeAddress) {
      return
    }
    const txs = [
      serviceApi.tx.transferKeepAlive(
        '1554u1a67ApEt5xmjbZwjgDNaVckbzB6cjRHWAQ1SpNkNxTd',
        unitToPlanck('0.1', units)
      ),
      serviceApi.tx.transferKeepAlive(
        '1554u1a67ApEt5xmjbZwjgDNaVckbzB6cjRHWAQ1SpNkNxTd',
        unitToPlanck('0.1', units)
      ),
    ].filter((tx) => tx !== undefined)

    const batch = newBatchCall(txs, activeAddress)
    return batch
  }

  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(),
    from: activeAddress,
    shouldSubmit: true,
    callbackSubmit: () => {
      setModalStatus('closing')
    },
  })

  return (
    <>
      <Close />
      <Padding>
        <Title>Balance Test</Title>
      </Padding>
      <SubmitTx valid {...submitExtrinsic} />
    </>
  )
}
