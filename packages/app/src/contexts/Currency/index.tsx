// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FIAT_CURRENCY_KEY } from 'consts'
import { SupportedCurrencies } from 'consts/currencies'
import { getUserFiatCurrency } from 'locales'
import type { ReactNode } from 'react'
import { createContext, useContext, useState } from 'react'
import { defaultCurrencyContext } from './defaults'
import type { CurrencyContextInterface } from './types'

export const CurrencyContext = createContext<CurrencyContextInterface>(
  defaultCurrencyContext
)

export const useCurrency = () => useContext(CurrencyContext)

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrencyState] = useState<string>(getUserFiatCurrency())

  const setCurrency = (c: string) => {
    setCurrencyState(c)
    if (Object.keys(SupportedCurrencies).includes(c)) {
      localStorage.setItem(FIAT_CURRENCY_KEY, c)
    }
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
