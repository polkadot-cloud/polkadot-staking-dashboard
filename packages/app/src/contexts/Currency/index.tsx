// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { getUserFiatCurrency, setLocalCurrency } from 'locales'
import type { ReactNode } from 'react'
import { createContext, useContext, useState } from 'react'
import { defaultCurrencyContext } from './defaults'
import type { CurencyContextInterface } from './types'

export const CurrencyContext = createContext<CurencyContextInterface>(
  defaultCurrencyContext
)

export const useCurrency = () => useContext(CurrencyContext)

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrencyState] = useState<string>(getUserFiatCurrency())

  const setCurrency = (newCurrency: string) => {
    setLocalCurrency(newCurrency)
    setCurrencyState(newCurrency)
  }
  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  )
}
