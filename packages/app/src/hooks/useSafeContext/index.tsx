// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Context } from 'react'
import { createContext, useContext } from 'react'

export const useSafeContext = <T,>(ctx: T | null | undefined): T => {
  if (ctx === null || ctx === undefined) {
    throw new Error(
      'Context value is null or undefined. Please ensure the context Provider is used correctly.'
    )
  }
  return ctx
}

export const createSafeContext = <T,>(): [Context<T | null>, () => T] => {
  const Context = createContext<T | null>(null)
  const useHook = () => useSafeContext<T>(useContext(Context))
  return [Context, useHook]
}
