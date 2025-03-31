// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createSafeContext, useEffectIgnoreInitial } from '@w3ux/hooks'
import { localStorageOrDefault, setStateWithRef } from '@w3ux/utils'
import { PageWidthMediumThreshold } from 'consts'
import type { MutableRefObject, ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import type { AnyJson } from 'types'
import type { UIContextInterface } from './types'

export const [UIContext, useUi] = createSafeContext<UIContextInterface>()

export const UIProvider = ({ children }: { children: ReactNode }) => {
  // Side whether the side menu is open
  const [sideMenuOpen, setSideMenu] = useState<boolean>(false)

  // Store whether in Brave browser. Used for light client warning
  const [isBraveBrowser, setIsBraveBrowser] = useState<boolean>(false)

  // Store references for main app containers
  const [containerRefs, setContainerRefsState] = useState<
    Record<string, MutableRefObject<HTMLDivElement | null>>
  >({})
  const setContainerRefs = (
    v: Record<string, MutableRefObject<HTMLDivElement | null>>
  ) => {
    setContainerRefsState(v)
  }

  // Get side menu minimised state from local storage, default to false
  const [userSideMenuMinimised, setUserSideMenuMinimisedState] =
    useState<boolean>(
      localStorageOrDefault('side_menu_minimised', false, true) as boolean
    )
  const userSideMenuMinimisedRef = useRef(userSideMenuMinimised)
  const setUserSideMenuMinimised = (v: boolean) => {
    localStorage.setItem('side_menu_minimised', String(v))
    setStateWithRef(v, setUserSideMenuMinimisedState, userSideMenuMinimisedRef)
  }

  // Automatic side menu minimised
  const [sideMenuMinimised, setSideMenuMinimised] = useState<boolean>(
    window.innerWidth <= PageWidthMediumThreshold
      ? true
      : userSideMenuMinimisedRef.current
  )

  // Resize side menu callback
  const resizeCallback = () => {
    if (window.innerWidth <= PageWidthMediumThreshold) {
      setSideMenuMinimised(false)
    } else {
      setSideMenuMinimised(userSideMenuMinimisedRef.current)
    }
  }

  // Resize event listener
  useEffect(() => {
    ;(window.navigator as AnyJson)?.brave
      ?.isBrave()
      .then(async (isBrave: boolean) => {
        setIsBraveBrowser(isBrave)
      })

    window.addEventListener('resize', resizeCallback)
    return () => {
      window.removeEventListener('resize', resizeCallback)
    }
  }, [])

  // Re-configure minimised on user change
  useEffectIgnoreInitial(() => {
    resizeCallback()
  }, [userSideMenuMinimised])

  return (
    <UIContext.Provider
      value={{
        setSideMenu,
        setUserSideMenuMinimised,
        setContainerRefs,
        sideMenuOpen,
        sideMenuMinimised,
        containerRefs,
        isBraveBrowser,
        userSideMenuMinimised,
      }}
    >
      {children}
    </UIContext.Provider>
  )
}
