// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { faExternalLinkAlt, faPlug } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import LedgerSquareSVG from '@w3ux/extension-assets/LedgerSquare.svg?react'
import PolkadotVaultSVG from '@w3ux/extension-assets/PolkadotVault.svg?react'
import WalletConnectSVG from '@w3ux/extension-assets/WalletConnect.svg?react'
import { useConnectNew } from 'contexts/ConnectNew'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Extension } from './Extension'
// import { ManageLedger } from './ManageLedger'
// import { ManageVault } from './ManageVault'
// import { ManageWalletConnect } from './ManageWalletConnect'
import type { InnerProps } from './types'
import { ItemWrapper } from './Wrappers'

export const Inner = ({ installed, other }: InnerProps) => {
  const { dismissOverlay } = useConnectNew()

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
      <div className="title">
        <h3>
          <FontAwesomeIcon icon={faPlug} transform="shrink-2" />
          Connect Accounts
        </h3>
        <button type="button" onClick={() => dismissOverlay()}>
          Close
        </button>
      </div>

      <motion.h4 {...getMotionProps('heading')}>Hardware</motion.h4>
      <motion.span {...getMotionProps('polkadot_vault')}>
        <ItemWrapper
          className={`${selectedConnectItem === 'polkadot_vault' ? ` last` : ``}`}
        >
          <div>
            <PolkadotVaultSVG className="icon" />
          </div>
          <div>
            <div>
              <h4>Polkadot Vault</h4>
              <h5>
                <a
                  href="https://signer.parity.io"
                  target="_blank"
                  rel="noreferrer"
                >
                  signer.parity.io
                  <FontAwesomeIcon
                    icon={faExternalLinkAlt}
                    transform="shrink-5"
                  />
                </a>
              </h5>
            </div>
            <div>
              <button
                onClick={() =>
                  setSelectedConnectItem(
                    selectedConnectItem === 'polkadot_vault'
                      ? undefined
                      : 'polkadot_vault'
                  )
                }
              >
                {selectedConnectItem === 'polkadot_vault' ? 'Done' : 'Manage'}
              </button>
            </div>
          </div>
        </ItemWrapper>
      </motion.span>

      <motion.span {...getMotionProps('ledger')}>
        <ItemWrapper
          className={`${selectedConnectItem === 'ledger' ? ` last` : ``}`}
        >
          <div>
            <LedgerSquareSVG style={{ width: '1.4rem', height: '1.4rem' }} />
          </div>
          <div>
            <div>
              <h4>Ledger</h4>
              <h5>
                <a href="https://ledger.com" target="_blank" rel="noreferrer">
                  ledger.com
                  <FontAwesomeIcon
                    icon={faExternalLinkAlt}
                    transform="shrink-5"
                  />
                </a>
              </h5>
            </div>
            <div>
              <button
                onClick={() =>
                  setSelectedConnectItem(
                    selectedConnectItem === 'ledger' ? undefined : 'ledger'
                  )
                }
              >
                {selectedConnectItem === 'ledger' ? 'Done' : 'Manage'}
              </button>
            </div>
          </div>
        </ItemWrapper>
      </motion.span>

      <motion.h4 {...getMotionProps('heading')}>Wallets</motion.h4>

      <motion.span {...getMotionProps('wallet_connect')}>
        <ItemWrapper
          className={`${selectedConnectItem === 'wallet_connect' ? ` last` : ``}`}
        >
          <div>
            <WalletConnectSVG style={{ width: '2rem', height: '2rem' }} />
          </div>
          <div>
            <div>
              <h4>Wallet Connect (Beta)</h4>
              <h5>
                <a href="https://reown.com/" target="_blank" rel="noreferrer">
                  reown.com
                  <FontAwesomeIcon
                    icon={faExternalLinkAlt}
                    transform="shrink-5"
                  />
                </a>
              </h5>
            </div>
            <div>
              <button
                onClick={() =>
                  setSelectedConnectItem(
                    selectedConnectItem === 'wallet_connect'
                      ? undefined
                      : 'wallet_connect'
                  )
                }
              >
                {selectedConnectItem === 'wallet_connect' ? 'Done' : 'Manage'}
              </button>
            </div>
          </div>
        </ItemWrapper>
      </motion.span>

      <motion.h4 {...getMotionProps('heading')}>Web Extensions</motion.h4>

      {extensionItems.map((extension, i) => (
        <motion.span
          {...getMotionProps('heading')}
          key={`extension_item_${extension.id}`}
        >
          <Extension
            extension={extension}
            last={i === extensionItems.length - 1}
          />
        </motion.span>
      ))}

      {/* <motion.span {...getManageProps('polkadot_vault')}>
        <ManageVault
          getMotionProps={getMotionProps}
          selectedConnectItem={selectedConnectItem}
        />
      </motion.span>

      <motion.span {...getManageProps('ledger')}>
        <ManageLedger
          getMotionProps={getMotionProps}
          selectedConnectItem={selectedConnectItem}
        />
      </motion.span>

      <motion.span {...getManageProps('wallet_connect')}>
        <ManageWalletConnect
          getMotionProps={getMotionProps}
          selectedConnectItem={selectedConnectItem}
        />
      </motion.span> */}
    </>
  )
}
