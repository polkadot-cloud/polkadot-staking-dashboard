// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffectIgnoreInitial } from '@w3ux/hooks'
import { useExtensions } from '@w3ux/react-connect-kit'
import type { AnyFunction } from '@w3ux/types'
import { ActionItem } from 'library/ActionItem'
import { SelectItems } from 'library/SelectItems'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ButtonTab } from 'ui-buttons'
import {
  CustomHeader,
  FixedTitle,
  Multi,
  MultiThree,
  Padding,
  Section,
} from 'ui-core/modal'
import { Close, useOverlay } from 'ui-overlay'
import { Ledger } from './Ledger'
import { Proxies } from './Proxies'
import { ReadOnly } from './ReadOnly'
import { mobileCheck } from './Utils'
import { Vault } from './Vault'
import { WalletConnect } from './WalletConnect'
import { ExtensionsWrapper } from './Wrappers'

export const Connect = () => {
  const { t } = useTranslation('modals')
  const { extensionsStatus } = useExtensions()
  const { setModalHeight, modalMaxHeight } = useOverlay().modal

  // Whether the app is running on mobile.
  const isMobile = mobileCheck()

  // Whether the app is running in Nova Wallet.
  const inNova = !!window?.walletExtension?.isNovaWallet || false

  // Whether the app is running in a SubWallet Mobile.
  const inSubWallet = !!window.injectedWeb3?.['subwallet-js'] && isMobile

  // Whether the app is running on of mobile wallets.
  const inMobileWallet = inNova || inSubWallet

  // toggle read only management
  const [readOnlyOpen, setReadOnlyOpen] = useState<boolean>(false)

  // toggle proxy delegate management
  const [newProxyOpen, setNewProxyOpen] = useState<boolean>(false)

  // active modal section
  const [section, setSection] = useState<number>(0)

  // refs for wrappers
  const headerRef = useRef<HTMLDivElement>(null)
  const homeRef = useRef<HTMLDivElement>(null)
  const readOnlyRef = useRef<HTMLDivElement>(null)
  const proxiesRef = useRef<HTMLDivElement>(null)

  const refreshModalHeight = () => {
    // Preserve height by taking largest height from modals.
    let height = headerRef.current?.clientHeight || 0
    height += Math.max(
      homeRef.current?.clientHeight || 0,
      readOnlyRef.current?.clientHeight || 0,
      proxiesRef.current?.clientHeight || 0
    )
    setModalHeight(height)
  }

  // Resize modal on state change.
  useEffectIgnoreInitial(() => {
    refreshModalHeight()
  }, [section, readOnlyOpen, newProxyOpen, extensionsStatus])

  useEffect(() => {
    window.addEventListener('resize', refreshModalHeight)
    return () => {
      window.removeEventListener('resize', refreshModalHeight)
    }
  }, [])

  // Hardware connect options JSX.
  const ConnectHardwareJSX = (
    <>
      <ActionItem text={t('hardware')} />
      <ExtensionsWrapper>
        <SelectItems layout="two-col">
          {[Vault, Ledger, WalletConnect].map(
            (Item: AnyFunction, i: number) => (
              <Item key={`hardware_item_${i}`} />
            )
          )}
        </SelectItems>
      </ExtensionsWrapper>
    </>
  )

  // Display hardware before extensions. If in Nova Wallet or SubWallet Mobile, display extension
  // before hardware.
  const ConnectCombinedJSX = !inMobileWallet
    ? ConnectHardwareJSX
    : ConnectHardwareJSX

  return (
    <Section type="carousel">
      <Close />
      <FixedTitle ref={headerRef} withStyle>
        <CustomHeader>
          <div>
            <h1>{t('connect')}</h1>
          </div>
          <Section type="tab">
            <ButtonTab
              title={t('extensions')}
              onClick={() => setSection(0)}
              active={section === 0}
            />
            <ButtonTab
              title={t('readOnly')}
              onClick={() => setSection(1)}
              active={section === 1}
            />
            <ButtonTab
              title={t('proxies')}
              onClick={() => setSection(2)}
              active={section === 2}
            />
          </Section>
        </CustomHeader>
      </FixedTitle>

      <MultiThree
        style={{
          maxHeight: modalMaxHeight - (headerRef.current?.clientHeight || 0),
        }}
        animate={
          section === 0 ? 'home' : section === 1 ? 'readOnly' : 'proxies'
        }
        transition={{
          duration: 0.5,
          type: 'spring',
          bounce: 0.1,
        }}
        variants={{
          home: {
            left: 0,
          },
          readOnly: {
            left: '-100%',
          },
          proxies: {
            left: '-200%',
          },
        }}
      >
        <Multi>
          <Padding horizontalOnly ref={homeRef}>
            {ConnectCombinedJSX}
          </Padding>
        </Multi>
        <Multi>
          <Padding horizontalOnly ref={readOnlyRef}>
            <ReadOnly setInputOpen={setReadOnlyOpen} inputOpen={readOnlyOpen} />
          </Padding>
        </Multi>
        <Multi>
          <Padding horizontalOnly ref={proxiesRef}>
            <Proxies setInputOpen={setNewProxyOpen} inputOpen={newProxyOpen} />
          </Padding>
        </Multi>
      </MultiThree>
    </Section>
  )
}
