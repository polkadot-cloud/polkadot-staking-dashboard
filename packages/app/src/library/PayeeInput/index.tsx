// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Polkicon } from '@w3ux/react-polkicon'
import { formatAccountSs58, isValidAddress, remToUnit } from '@w3ux/utils'
import { getNetworkData } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useBonded } from 'contexts/Bonded'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useNetwork } from 'contexts/Network'
import type { ChangeEvent } from 'react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Wrapper } from './Wrapper'
import type { PayeeInputProps } from './types'

export const PayeeInput = ({
  payee,
  account,
  setAccount,
  handleChange,
}: PayeeInputProps) => {
  const { t } = useTranslation('app')
  const { getBondedAccount } = useBonded()
  const { accounts } = useImportedAccounts()
  const { network } = useNetwork()
  const { activeAddress } = useActiveAccounts()

  const { ss58 } = getNetworkData(network)
  const controller = getBondedAccount(activeAddress)
  const accountMeta = accounts.find((a) => a.address === activeAddress)

  // store whether account value is valid.
  const [valid, setValid] = useState<boolean>(isValidAddress(account || ''))

  // Store whether input is currently active.
  const [inputActive, setInputActive] = useState<boolean>(false)

  const hiddenRef = useRef<HTMLInputElement>(null)
  const showingRef = useRef<HTMLInputElement>(null)

  // Adjust the width of account input based on text length.
  const handleAdjustWidth = () => {
    if (hiddenRef.current && showingRef.current) {
      const hiddenWidth = hiddenRef.current.offsetWidth
      showingRef.current.style.width = `${hiddenWidth + remToUnit('2.5rem')}px`
    }
  }

  // Handle change of account value. Updates setup progress if the account is a valid value.
  const handleChangeAccount = (e: ChangeEvent<HTMLInputElement>) => {
    const newAddress = e.target.value
    const formattedAccount =
      formatAccountSs58(newAddress, ss58) || newAddress || null
    const isValid =
      formattedAccount !== null && isValidAddress(formattedAccount)

    setValid(isValid)
    setAccount(formattedAccount)

    if (isValid) {
      handleChange(formattedAccount)
    } else {
      handleChange(null)
    }
  }

  // Adjust width as ref values change.
  useEffect(() => {
    handleAdjustWidth()
  }, [hiddenRef.current, showingRef.current, payee.destination])

  // Adjust width on window resize.
  useEffect(() => {
    window.addEventListener('resize', handleAdjustWidth)
    return () => {
      window.removeEventListener('resize', handleAdjustWidth)
    }
  }, [])

  // Show empty Identicon on `None` and invalid `Account` accounts.
  const showEmpty =
    payee.destination === 'None' || (payee.destination === 'Account' && !valid)

  const accountDisplay =
    payee.destination === 'Account'
      ? account
      : payee.destination === 'None'
        ? ''
        : payee.destination === 'Controller'
          ? controller
          : activeAddress

  const placeholderDisplay =
    payee.destination === 'None' ? t('noPayoutAddress') : t('payoutAddress')

  return (
    <Wrapper $activeInput={inputActive}>
      <div className="inner">
        <h4>{t('payoutAccount')}:</h4>
        <div className="account">
          {showEmpty ? (
            <div className="emptyIcon" />
          ) : (
            <Polkicon address={accountDisplay || ''} fontSize="2.5rem" />
          )}
          <div className="input" ref={showingRef}>
            <input
              type="text"
              placeholder={placeholderDisplay}
              disabled={payee.destination !== 'Account'}
              value={accountDisplay || ''}
              onFocus={() => setInputActive(true)}
              onBlur={() => setInputActive(false)}
              onChange={handleChangeAccount}
            />
            <div ref={hiddenRef} className="hidden">
              {payee.destination === 'Account' ? activeAddress : accountDisplay}
            </div>
          </div>
        </div>
      </div>
      <div className="label">
        <h5>
          {payee.destination === 'Account' ? (
            account === '' ? (
              t('insertPayoutAddress')
            ) : !valid ? (
              t('notValidAddress')
            ) : (
              <>
                <FontAwesomeIcon icon={faCheck} />
                {t('validAddress')}
              </>
            )
          ) : payee.destination === 'None' ? null : (
            <>
              <FontAwesomeIcon icon={faCheck} />
              {accountMeta?.name || ''}
            </>
          )}
        </h5>
      </div>
    </Wrapper>
  )
}
