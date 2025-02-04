// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ListFormat, PoolListContextProps } from 'library/PoolList/types'
import type { ReactNode } from 'react'
import { createContext, useContext, useState } from 'react'

export const PayoutListContext = createContext<PoolListContextProps>({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setListFormat: (v: ListFormat) => {},
  listFormat: 'col',
})

export const usePayoutList = () => useContext(PayoutListContext)

export const PayoutListProvider = ({ children }: { children: ReactNode }) => {
  const [listFormat, _setListFormat] = useState<ListFormat>('col')

  const setListFormat = (v: ListFormat) => {
    _setListFormat(v)
  }

  return (
    <PayoutListContext.Provider
      value={{
        setListFormat,
        listFormat,
      }}
    >
      {children}
    </PayoutListContext.Provider>
  )
}
