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
import { faCheck, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { ConnectItem } from 'ui-core/popover'
import type { InnerProps } from './types'
import { ItemWrapper } from './Wrappers'

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
        <ItemWrapper
          className={`asButton ${selectedConnectItem === 'polkadot_vault' ? ` last` : ``}`}
          onClick={() => {
            setSelectedConnectItem(
              selectedConnectItem === 'polkadot_vault'
                ? undefined
                : 'polkadot_vault'
            )
          }}
        >
          <div>
            <div className="icon">
              <PolkadotVaultSVG />
            </div>
          </div>
          <div>
            <div>
              <h3>Polkadot Vault</h3>
              <ConnectItem.WebUrl
                url={'https://vault.novasama.io'}
                text={'vault.novasama.io'}
              />
            </div>
            <ConnectItem.Icon
              faIcon={
                selectedConnectItem === 'polkadot_vault'
                  ? faCheck
                  : faChevronRight
              }
            />
          </div>
        </ItemWrapper>
      </motion.section>

      <motion.section {...getMotionProps('ledger')}>
        <ItemWrapper
          className={`asButton ${selectedConnectItem === 'ledger' ? ` last` : ``}`}
          onClick={() => {
            setSelectedConnectItem(
              selectedConnectItem === 'ledger' ? undefined : 'ledger'
            )
          }}
        >
          <div>
            <div className="icon">
              <LedgerSquareSVG style={{ width: '1.4rem', height: '1.4rem' }} />
            </div>
          </div>
          <div>
            <div>
              <h3>Ledger</h3>
              <ConnectItem.WebUrl
                url={'https://ledger.com'}
                text={'ledger.com'}
              />
            </div>
            <ConnectItem.Icon
              faIcon={
                selectedConnectItem === 'ledger' ? faCheck : faChevronRight
              }
            />
          </div>
        </ItemWrapper>
      </motion.section>

      <motion.section {...getMotionProps('wallet_connect')}>
        <ItemWrapper
          className={`asButton ${selectedConnectItem === 'wallet_connect' ? ` last` : ``}`}
          style={{ border: 'none' }}
          onClick={() => {
            setSelectedConnectItem(
              selectedConnectItem === 'wallet_connect'
                ? undefined
                : 'wallet_connect'
            )
          }}
        >
          <div>
            <div className="icon">
              <WalletConnectSVG style={{ width: '2rem', height: '2rem' }} />
            </div>
          </div>
          <div>
            <div>
              <h3>Wallet Connect</h3>
              <ConnectItem.WebUrl
                url={'https://reown.com'}
                text={'reown.com'}
              />
            </div>
            <ConnectItem.Icon
              faIcon={
                selectedConnectItem === 'wallet_connect'
                  ? faCheck
                  : faChevronRight
              }
            />
          </div>
        </ItemWrapper>
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

      {/* <motion.section {...getManageProps('polkadot_vault')}>
        <ManageVault
          getMotionProps={getMotionProps}
          selectedConnectItem={selectedConnectItem}
        />
      </motion.section>

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
