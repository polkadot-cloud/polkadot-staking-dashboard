// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import LedgerSquareSVG from '@w3ux/extension-assets/LedgerSquare.svg?react'
import PolkadotVaultSVG from '@w3ux/extension-assets/PolkadotVault.svg?react'
import WalletConnectSVG from '@w3ux/extension-assets/WalletConnect.svg?react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Extension } from './Extension'
// import { ManageLedger } from './ManageLedger'
// import { ManageVault } from './ManageVault'
// import { ManageWalletConnect } from './ManageWalletConnect'
import { Hardware } from './Hardware'
import { Vault } from './Manage/Vault'
import type { InnerProps } from './types'

export const Inner = ({ installed, other }: InnerProps) => {
  // Store the active hardware wallet, if selected.
  const [selectedConnectItem, setSelectedConnectItem] = useState<
    string | undefined
  >(undefined)

  const variants = {
    hidden: {
      height: 0,
      opacity: 0,
    },
    show: {
      height: 'auto',
      opacity: 1,
    },
  }

  // Gets framer motion props for either a element that needs to be hidden and shown.
  const getMotionProps = (item: string, active = true) => {
    // Whether to show this element if it is a heading.
    const showHeading = item === 'heading' && selectedConnectItem === undefined

    // Whether to show this element if it is a connect item.
    const showConnectItem =
      item !== undefined &&
      (item === selectedConnectItem || selectedConnectItem === undefined)

    // Whether to show this element if it is an imported address.
    const showImportedAddress = item === 'address' && active

    // Whether to show this element if it is an  address label.
    const showAddressLabel = item === 'address_config' && active

    // Whether to show this element if it is an import container.
    const showImportContainer = item === 'import_container' && active

    const show =
      showHeading ||
      showConnectItem ||
      showImportedAddress ||
      showAddressLabel ||
      showImportContainer

    return {
      initial: 'show',
      variants,
      transition: {
        duration: 0.4,
        ease: [0.25, 1, 0.25, 1],
      },
      animate: show ? 'show' : 'hidden',
      className: `motion${show ? `` : ` hidden`}`,
    }
  }

  // Gets framer motion props for a management ui item.
  const getManageProps = (item: string) => ({
    initial: 'hidden',
    variants,
    transition: {
      duration: 0.2,
    },
    animate: selectedConnectItem === item ? 'show' : 'hidden',
    className: 'motion',
  })
  console.debug(getManageProps(''))

  const extensionItems = installed.concat(other)

  return (
    <>
      <motion.h4 {...getMotionProps('heading')}>Hardware</motion.h4>
      <motion.section {...getMotionProps('polkadot_vault')}>
        <Hardware
          hardwareId="polkadot_vault"
          active={selectedConnectItem === 'polkadot_vault'}
          setSelectedConnectItem={setSelectedConnectItem}
          Svg={PolkadotVaultSVG}
          title="Polkadot Vault"
          websiteUrl="https://vault.novasama.io"
          websiteText="vault.novasama.io"
        />
      </motion.section>

      <motion.section {...getMotionProps('ledger')}>
        <Hardware
          hardwareId="ledger"
          active={selectedConnectItem === 'ledger'}
          setSelectedConnectItem={setSelectedConnectItem}
          Svg={LedgerSquareSVG}
          title="Ledger"
          websiteUrl="https://ledger.com"
          websiteText="ledger.com"
        />
      </motion.section>

      <motion.section {...getMotionProps('wallet_connect')}>
        <Hardware
          hardwareId="wallet_connect"
          active={selectedConnectItem === 'wallet_connect'}
          setSelectedConnectItem={setSelectedConnectItem}
          Svg={WalletConnectSVG}
          title="Wallet Connect"
          websiteUrl="https://reown.com"
          websiteText="reown.com"
        />
      </motion.section>

      <motion.h4 {...getMotionProps('heading')}>Web Extensions</motion.h4>

      {extensionItems.map((extension, i) => (
        <motion.section
          {...getMotionProps('heading')}
          key={`extension_item_${extension.id}`}
        >
          <Extension
            extension={extension}
            last={i === extensionItems.length - 1}
          />
        </motion.section>
      ))}

      <motion.section {...getManageProps('polkadot_vault')}>
        <Vault
          getMotionProps={getMotionProps}
          selectedConnectItem={selectedConnectItem}
        />
      </motion.section>

      {/*
      <motion.section {...getManageProps('ledger')}>
        <ManageLedger
          getMotionProps={getMotionProps}
          selectedConnectItem={selectedConnectItem}
        />
      </motion.section>

      <motion.section {...getManageProps('wallet_connect')}>
        <ManageWalletConnect
          getMotionProps={getMotionProps}
          selectedConnectItem={selectedConnectItem}
        />
      </motion.section> */}
    </>
  )
}
