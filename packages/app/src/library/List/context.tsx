// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/types'
import type { ListFormat } from 'library/PoolList/types'
import { createContext, useContext, useState } from 'react'
import { defaultContext } from './defaults'
import type { ListContextInterface, ListProviderProps } from './types'

export const ListContext = createContext<ListContextInterface>(defaultContext)

export const useList = () => useContext(ListContext)

export const ListProvider = ({
  selectToggleable = true,
  selectActive: initialSelctActive = false,
  children,
}: ListProviderProps) => {
  // Current page
  const [page, setPage] = useState<number>(1)

  // Store the currently selected validators from the list.
  const [selected, setSelected] = useState<AnyJson[]>([])

  // Store whether validator selection is active
  const [selectActive, setSelectActiveState] = useState<boolean>(
    initialSelctActive ?? false
  )

  // Store the list format of the list
  const [listFormat, _setListFormat] = useState<ListFormat>('col')

  const addToSelected = (_item: AnyJson) => {
    setSelected([...selected].concat(_item))
  }

  const removeFromSelected = (items: AnyJson[]) => {
    setSelected([...selected].filter((item) => !items.includes(item)))
  }

  const resetSelected = () => {
    setSelected([])
  }

  const setSelectActive = (_selectActive: boolean) => {
    setSelectActiveState(_selectActive)
    if (_selectActive === false) {
      resetSelected()
    }
  }

  const setListFormat = (v: ListFormat) => {
    _setListFormat(v)
  }

  return (
    <ListContext.Provider
      value={{
        setSelectActive,
        addToSelected,
        removeFromSelected,
        resetSelected,
        setListFormat,
        selected,
        selectActive,
        listFormat,
        selectToggleable,
        pagination: {
          page,
          setPage,
        },
      }}
    >
      {children}
    </ListContext.Provider>
  )
}
