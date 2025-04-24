// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { isValidAddress } from '@w3ux/utils'
import { StakingSetPayee } from 'api/tx/stakingSetPayee'
import { getNetworkData } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useBalances } from 'contexts/Balances'
import { useBonded } from 'contexts/Bonded'
import { useNetwork } from 'contexts/Network'
import type { PayeeConfig, PayeeOptions } from 'contexts/Setup/types'
import { usePayeeConfig } from 'hooks/usePayeeConfig'
import { useSignerWarnings } from 'hooks/useSignerWarnings'
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic'
import { Warning } from 'library/Form/Warning'
import { Title } from 'library/Modal/Title'
import { PayeeInput } from 'library/PayeeInput'
import { SelectItems } from 'library/SelectItems'
import { SelectItem } from 'library/SelectItems/Item'
import { SubmitTx } from 'library/SubmitTx'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { MaybeAddress } from 'types'
import { Padding, Warnings } from 'ui-core/modal'
import { useOverlay } from 'ui-overlay'

export const UpdatePayee = () => {
  const { t } = useTranslation('modals')
  const { network } = useNetwork()
  const { getBondedAccount } = useBonded()
  const { getStakingLedger } = useBalances()
  const { getPayeeItems } = usePayeeConfig()
  const { activeAddress } = useActiveAccounts()
  const { setModalStatus } = useOverlay().modal
  const { getSignerWarnings } = useSignerWarnings()

  const { ss58 } = getNetworkData(network)
  const controller = getBondedAccount(activeAddress)
  const payee = getStakingLedger(activeAddress).payee

  const DefaultSelected: PayeeConfig = {
    destination: null,
    account: null,
  }

  // Store the current user-inputted custom payout account.
  const [account, setAccount] = useState<MaybeAddress>(
    payee?.account?.address(ss58) || null
  )

  // Store the currently selected payee option.
  const [selected, setSelected] = useState<PayeeConfig>(DefaultSelected)

  // update setup progress with payee config.
  const handleChangeDestination = (destination: PayeeOptions) => {
    setSelected({
      destination,
      account: isValidAddress(account || '') ? account : null,
    })
  }

  // update setup progress with payee account.
  const handleChangeAccount = (newAccount: MaybeAddress) => {
    setSelected({
      destination: selected?.destination ?? null,
      account: newAccount,
    })
  }

  // determine whether this section is completed.
  const isComplete = () =>
    selected.destination !== null &&
    !(selected.destination === 'Account' && selected.account === null)

  const getTx = () => {
    if (!selected.destination) {
      return null
    }
    if (selected.destination === 'Account' && !selected.account) {
      return null
    }
    return new StakingSetPayee(
      network,
      !isComplete()
        ? { type: 'Staked', value: undefined }
        : selected.destination === 'Account'
          ? {
              type: 'Account',
              value: selected.account as string,
            }
          : { type: selected.destination, value: undefined }
    ).tx()
  }

  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(),
    from: controller,
    shouldSubmit: isComplete(),
    callbackSubmit: () => {
      setModalStatus('closing')
    },
  })

  // Reset selected value on account change.
  useEffect(() => {
    setSelected(DefaultSelected)
  }, [activeAddress])

  // Inject default value after component mount.
  useEffect(() => {
    const initialSelected = getPayeeItems(true).find(
      (item) => item.value === payee?.destination
    )
    setSelected(
      initialSelected
        ? {
            destination: initialSelected.value,
            account,
          }
        : DefaultSelected
    )
  }, [])

  const warnings = getSignerWarnings(
    activeAddress,
    true,
    submitExtrinsic.proxySupported
  )

  return (
    <>
      <Title
        title={t('updatePayoutDestination')}
        helpKey="Payout Destination"
      />
      <Padding horizontalOnly>
        {warnings.length > 0 ? (
          <Warnings>
            {warnings.map((text, i) => (
              <Warning key={`warning${i}`} text={text} />
            ))}
          </Warnings>
        ) : null}
        <div style={{ width: '100%', padding: '0 0.5rem' }}>
          <PayeeInput
            payee={selected}
            account={account}
            setAccount={setAccount}
            handleChange={handleChangeAccount}
          />
        </div>
        <SelectItems>
          {getPayeeItems(true).map((item) => (
            <SelectItem
              key={`payee_option_${item.value}`}
              account={account}
              setAccount={setAccount}
              selected={selected.destination === item.value}
              onClick={() => handleChangeDestination(item.value)}
              {...item}
            />
          ))}
        </SelectItems>
      </Padding>
      <SubmitTx fromController valid={isComplete()} {...submitExtrinsic} />
    </>
  )
}
