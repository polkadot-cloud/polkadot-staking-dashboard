// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import LedgerSVG from '@w3ux/extension-assets/LedgerSquare.svg?react'
import type { AnyJson } from '@w3ux/types'
import { capitalizeFirstLetter } from '@w3ux/utils'
import { useHelp } from 'contexts/Help'
import { useLedgerHardware } from 'contexts/LedgerHardware'
import { getLedgerApp } from 'contexts/LedgerHardware/Utils'
import { useNetwork } from 'contexts/Network'
import { usePrompt } from 'contexts/Prompt'
import { HardwareStatusBar } from 'library/Hardware/HardwareStatusBar'
import { Heading } from 'library/Import/Heading'
import { useTranslation } from 'react-i18next'
import { useOverlay } from 'ui-overlay'
import { Addresess } from './Addresses'
import { Reset } from './Reset'

export const Manage = ({
  addresses,
  onGetAddress,
  removeLedgerAddress,
}: AnyJson) => {
  const { t } = useTranslation()
  const { openHelp } = useHelp()
  const { network } = useNetwork()
  const { openPromptWith } = usePrompt()
  const { replaceModal } = useOverlay().modal
  const { handleResetLedgerTask, getIsExecuting, getFeedback } =
    useLedgerHardware()
  const { Icon } = getLedgerApp(network)
  const isExecuting = getIsExecuting()

  const fallbackMessage = `${t('ledgerAccounts', {
    ns: 'modals',
    count: addresses.length,
  })}`
  const feedback = getFeedback()
  const helpKey = feedback?.helpKey

  return (
    <>
      <Heading
        connectTo="Ledger"
        Icon={Icon}
        title={capitalizeFirstLetter(network)}
        handleReset={() => {
          openPromptWith(
            <Reset removeLedgerAddress={removeLedgerAddress} />,
            'small'
          )
        }}
        disabled={!addresses.length}
      />
      <Addresess
        addresses={addresses}
        removeLedgerAddress={removeLedgerAddress}
        onGetAddress={onGetAddress}
      />
      <HardwareStatusBar
        Icon={LedgerSVG}
        text={feedback?.message || fallbackMessage}
        help={
          helpKey
            ? {
                helpKey,
                handleHelp: openHelp,
              }
            : undefined
        }
        inProgress={isExecuting}
        handleCancel={() => handleResetLedgerTask()}
        handleDone={() =>
          replaceModal({ key: 'Connect', options: { disableScroll: true } })
        }
        show
        t={{
          tDone: t('done', { ns: 'library' }),
          tCancel: t('cancel', { ns: 'library' }),
        }}
      />
    </>
  )
}
