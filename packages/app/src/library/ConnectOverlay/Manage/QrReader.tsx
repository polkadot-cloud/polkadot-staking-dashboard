// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { useVaultAccounts } from '@w3ux/react-connect-kit'
import type { AnyJson } from '@w3ux/types'
import { formatAccountSs58, isValidAddress } from '@w3ux/utils'
import { QrScanSignature } from 'library/QRCode/ScanSignature'
import { useEffect, useState } from 'react'
import { ImportQRWrapper } from '../Wrappers'
import type { QrReaderProps } from '../types'

export const QrReader = ({
  network,
  ss58,
  importActive,
  onSuccess,
}: QrReaderProps) => {
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
    <ImportQRWrapper>
      {importActive && (
        <>
          <div className="qrRegion">
            <QrScanSignature
              size={250}
              onScan={({ signature }) => handleQrData(signature)}
            />
          </div>
          <h4>{feedback}</h4>
        </>
      )}
    </ImportQRWrapper>
  )
}
