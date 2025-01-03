// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faChrome, faUsb } from '@fortawesome/free-brands-svg-icons'
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import LedgerLogoSVG from '@w3ux/extension-assets/Ledger.svg?react'
import { inChrome } from '@w3ux/utils'
import { useHelp } from 'contexts/Help'
import { useNetwork } from 'contexts/Network'
import { ButtonHelp, ButtonPrimaryInvert, ButtonText } from 'ui-buttons'
import { useOverlay } from 'ui-overlay'
import { ModalConnectItem, ModalHardwareItem } from 'ui-overlay/structure'

export const Ledger = () => {
  const { openHelp } = useHelp()
  const { replaceModal } = useOverlay().modal
  const { network } = useNetwork()
  const url = 'ledger.com'

  // Only render on Polkadot and Kusama networks.
  if (!['polkadot', 'kusama'].includes(network)) {
    return null
  }

  return (
    <ModalConnectItem>
      <ModalHardwareItem>
        <div className="body">
          <div className="status">
            <ButtonHelp onClick={() => openHelp('Ledger Hardware Wallets')} />
          </div>
          <div className="row">
            <LedgerLogoSVG className="logo" />
          </div>
          <div className="row margin">
            <ButtonText
              text="Chrome / Brave"
              disabled
              iconLeft={faChrome}
              style={{ opacity: 0.5 }}
            />
          </div>
          <div className="row margin">
            <ButtonPrimaryInvert
              text="USB"
              onClick={() => replaceModal({ key: 'ImportLedger' })}
              iconLeft={faUsb}
              iconTransform="shrink-1"
              disabled={!inChrome()}
            />
          </div>
        </div>
        <div className="foot">
          <a
            className="link"
            href={`https://${url}`}
            target="_blank"
            rel="noreferrer"
          >
            {url}
            <FontAwesomeIcon icon={faExternalLinkAlt} transform="shrink-6" />
          </a>
        </div>
      </ModalHardwareItem>
    </ModalConnectItem>
  )
}
