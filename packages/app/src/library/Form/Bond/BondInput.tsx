// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js'
import { getStakingChainData } from 'consts/util'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useNetwork } from 'contexts/Network'
import { useDebounce } from 'hooks/useDebounce'
import type { ChangeEvent } from 'react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ButtonSubmitInvert } from 'ui-buttons'
import { InputWrapper } from '../Wrappers'
import type { BondInputProps } from '../types'

export const BondInput = ({
  setters = [],
  disabled,
  defaultValue,
  freeToBond,
  disableTxFeeUpdate = false,
  value = '0',
  syncing = false,
}: BondInputProps) => {
  const { t } = useTranslation('app')
  const { network } = useNetwork()
  const { activeAddress } = useActiveAccounts()
  const { unit } = getStakingChainData(network)

  // the current local bond value
  const [localBond, setLocalBond] = useState<string>(value)

  // reset value to default when changing account.
  useEffect(() => {
    setLocalBond(defaultValue ?? '0')
  }, [activeAddress])

  useEffect(() => {
    if (!disableTxFeeUpdate) {
      setLocalBond(value.toString())
    }
  }, [value])

  // apply bond to parent setters.
  const updateParentState = (val: string) => {
    val = val || '0'
    if (new BigNumber(val).isNaN()) {
      return
    }
    for (const setter of setters) {
      setter({
        bond: new BigNumber(val),
      })
    }
  }

  // Create debounced handler for expensive parent state updates
  const handleDebouncedBondChange = useDebounce((val: string) => {
    if (val !== '' && new BigNumber(val).isNaN()) {
      return
    }
    updateParentState(val)
  }, 500) // 500ms delay for bond amount calculations

  // Handle immediate input changes for UI responsiveness
  const handleBondInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    if (val !== '' && new BigNumber(val).isNaN()) {
      return
    }
    // Update local state immediately for responsive UI
    setLocalBond(val)
    // Debounce the expensive parent state updates
    handleDebouncedBondChange(val)
  }

  // available funds as jsx.
  const availableFundsJsx = (
    <p>
      {syncing ? '...' : `${freeToBond.toFormat()} ${unit} ${t('available')}`}
    </p>
  )

  return (
    <InputWrapper>
      <div className="inner">
        <section style={{ opacity: disabled ? 0.5 : 1 }}>
          <div className="input">
            <div>
              <input
                type="text"
                placeholder={`0 ${unit}`}
                value={localBond}
                onChange={(e) => {
                  handleBondInputChange(e)
                }}
                disabled={disabled}
              />
            </div>
            <div>{availableFundsJsx}</div>
          </div>
        </section>
        <section>
          <ButtonSubmitInvert
            text={t('max')}
            disabled={disabled || syncing || freeToBond.isZero()}
            onClick={() => {
              setLocalBond(freeToBond.toString())
              updateParentState(freeToBond.toString())
            }}
          />
        </section>
      </div>
      <div className="availableOuter">{availableFundsJsx}</div>
    </InputWrapper>
  )
}
