// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { faQrcode } from '@fortawesome/free-solid-svg-icons'
import { useEffectIgnoreInitial } from '@w3ux/hooks'
import { useVaultAccounts } from '@w3ux/react-connect-kit'
import { Polkicon } from '@w3ux/react-polkicon'
import type { VaultAccount } from '@w3ux/types'
import { useNetwork } from 'contexts/Network'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { ButtonText } from 'ui-buttons'
import { ConnectItem } from 'ui-core/popover'
import type { ManageHardwareProps } from '../types'
import { HardwareAddress } from './HardwareAddress'
import { QrReader } from './QrReader'

export const Vault = ({
  getMotionProps,
  selectedConnectItem,
}: ManageHardwareProps) => {
  const {
    getVaultAccounts,
    vaultAccountExists,
    renameVaultAccount,
    removeVaultAccount,
  } = useVaultAccounts()
  const {
    network,
    networkData: { ss58 },
  } = useNetwork()

  // Whether the import account button is active.
  const [importActive, setImportActive] = useState<boolean>(false)

  const vaultAccounts = getVaultAccounts(network)

  // Whether to show address entries. Requires both searching and importing to be inactive.
  const showAddresses = true

  // Handle renaming a vault address.
  const handleRename = (address: string, newName: string) => {
    renameVaultAccount(network, address, newName)
  }

  // Handle removing a vault address.
  const handleRemove = (address: string): void => {
    if (confirm('Are you sure you want to remove this account?')) {
      removeVaultAccount(network, address)
    }
  }

  // Resets UI when the selected connect item changes from `polakdot_vault`, Cancelling import and
  // search if active.
  useEffectIgnoreInitial(() => {
    if (selectedConnectItem !== 'polkadot_vault') {
      setImportActive(false)
    }
  }, [selectedConnectItem])

  return (
    <>
      <ConnectItem.Heading text="Polkadot Vault">
        <ButtonText
          text={!importActive ? 'Add Account' : 'Cancel'}
          iconLeft={faQrcode}
          onClick={() => {
            setImportActive(!importActive)
          }}
          style={{ fontSize: '1.1rem' }}
        />
      </ConnectItem.Heading>

      <motion.div {...getMotionProps('import_container', importActive)}>
        <QrReader
          network={network}
          ss58={ss58}
          importActive={importActive}
          onSuccess={() => {
            setImportActive(false)
          }}
        />
      </motion.div>

      <motion.div {...getMotionProps('address', showAddresses)}>
        {vaultAccounts.map(({ address, name }: VaultAccount, i) => (
          <HardwareAddress
            key={`vault_imported_${i}`}
            network={network}
            address={address}
            index={i}
            initial={name}
            Identicon={<Polkicon address={address} fontSize="2.9rem" />}
            existsHandler={vaultAccountExists}
            renameHandler={handleRename}
            onRemove={handleRemove}
            onConfirm={() => {
              /* Do nothing. Not shown in UI. */
            }}
          />
        ))}
      </motion.div>
    </>
  )
}
