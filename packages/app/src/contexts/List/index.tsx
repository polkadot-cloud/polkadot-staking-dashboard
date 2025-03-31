// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createSafeContext } from '@w3ux/hooks'
import { useState } from 'react'
import type { AnyJson } from 'types'
import type {
  ListContextInterface,
  ListFormat,
  ListProviderProps,
} from './types'

export const [ListContext, useList] = createSafeContext<ListContextInterface>()

export const useListContext = () => {
  const context = useList()
  return context
}
export const ListProvider = ({
  selectable: initialSelectable = false,
  children,
}: ListProviderProps) => {
  // Current page
  const [page, setPage] = useState<number>(1)

  // Store the currently selected validators from the list.
  const [selected, setSelected] = useState<AnyJson[]>([])

  // Store whether validator selection is active
  const [selectable] = useState<boolean>(initialSelectable ?? false)

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

  const setListFormat = (v: ListFormat) => {
    _setListFormat(v)
  }

  return (
    <ListContext.Provider
      value={{
        addToSelected,
        removeFromSelected,
        resetSelected,
        setListFormat,
        selected,
        selectable,
        listFormat,
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
