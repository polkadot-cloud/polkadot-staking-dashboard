// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useVaultAccounts } from '@w3ux/react-connect-kit'
import type { AnyJson } from '@w3ux/types'
import { formatAccountSs58, isValidAddress } from '@w3ux/utils'
import { QrScanSignature } from 'library/QRCode/ScanSignature'
import { useEffect, useState } from 'react'
import type { QrReaderProps } from './types'
import { Wrapper } from './Wrapper'

export const QrReader = ({ network, ss58, onSuccess }: QrReaderProps) => {
  const { addVaultAccount, vaultAccountExists, vaultAccounts } =
    useVaultAccounts()

  // Store data from QR Code scanner.
  const [qrData, setQrData] = useState<AnyJson>(undefined)

  // Handle a newly received QR signature.
  const handleQrData = (signature: string) => {
    setQrData(signature.split(':')?.[1] || '')
  }

  const valid =
    isValidAddress(qrData) &&
    !vaultAccountExists(network, qrData) &&
    formatAccountSs58(qrData, ss58) !== null

  useEffect(() => {
    // Add account and close overlay if valid.
    if (valid) {
      const account = addVaultAccount(network, qrData, vaultAccounts.length)
      if (account) {
        onSuccess()
      }
    }
  })

  const exists = vaultAccountExists(network, qrData)

  // Display feedback.
  const feedback =
    qrData === undefined
      ? 'Waiting for QR Code'
      : isValidAddress(qrData)
        ? formatAccountSs58(qrData, ss58) === null
          ? 'Different Network Address'
          : exists
            ? 'Account Already Imported'
            : 'Address Received'
        : 'Invalid Address'

  return (
    <Wrapper>
      <div className="qrRegion">
        <QrScanSignature
          size={250}
          onScan={({ signature }) => handleQrData(signature)}
        />
      </div>
      <h4>{feedback}</h4>
    </Wrapper>
  )
}
