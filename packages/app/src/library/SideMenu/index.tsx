// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useOnResize, useOutsideAlerter } from '@w3ux/hooks'
import { capitalizeFirstLetter } from '@w3ux/utils'
import DiscordSVG from 'assets/svg/brands/discord.svg?react'
import BookSVG from 'assets/svg/icons/book.svg?react'
import CloudSVG from 'assets/svg/icons/cloud.svg?react'
import EnvelopeSVG from 'assets/svg/icons/envelope.svg?react'
import LinkSVG from 'assets/svg/icons/link.svg?react'
import LogoSVG from 'assets/svg/icons/logo.svg?react'
import { PageWidthMediumThreshold } from 'consts'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useHelp } from 'contexts/Help'
import { useNetwork } from 'contexts/Network'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { useUi } from 'contexts/UI'
import type { UIContextInterface } from 'contexts/UI/types'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Page } from 'ui-core/base'
import { useOverlay } from 'ui-overlay'
import { Heading } from './Heading/Heading'
import { Main } from './Main'
import { Secondary } from './Secondary'
import { LogoWrapper, Separator, Wrapper } from './Wrapper'

export const SideMenu = () => {
  const { t } = useTranslation('app')
  const { openHelp } = useHelp()
  const { apiStatus } = useApi()
  const {
    setSideMenu,
    sideMenuOpen,
    sideMenuMinimised,
    userSideMenuMinimised,
    setUserSideMenuMinimised,
  }: UIContextInterface = useUi()
  const { openModal } = useOverlay().modal
  const { networkData, network } = useNetwork()
  const { activeAccount } = useActiveAccounts()
  const { activePool } = useActivePool()

  // Listen to window resize to automatically hide the side menu on window resize.
  useOnResize(() => {
    if (window.innerWidth >= PageWidthMediumThreshold) {
      setSideMenu(false)
    }
  })

  // Define side menu ref and close the side menu when clicking outside of it.
  const ref = useRef(null)
  useOutsideAlerter(ref, () => {
    setSideMenu(false)
  })

  const apiStatusClass =
    apiStatus === 'connecting'
      ? 'warning'
      : ['connected', 'ready'].includes(apiStatus)
        ? 'success'
        : 'danger'

  // Check if user can create invite links
  const canCreateInvites = activeAccount !== null

  // Handle opening invite modal based on account status
  const handleInviteClick = () => {
    if (canCreateInvites) {
      openModal({
        key: 'Invite',
        size: 'sm',
        options: {
          activePool,
        },
      })
    }
  }

  return (
    <Page.Side open={sideMenuOpen} minimised={sideMenuMinimised}>
      <Wrapper ref={ref} $minimised={sideMenuMinimised}>
        <section>
          <LogoWrapper
            $minimised={sideMenuMinimised}
            type="button"
            onClick={() => setUserSideMenuMinimised(!userSideMenuMinimised)}
          >
            {sideMenuMinimised ? (
              <CloudSVG style={{ maxHeight: '100%', width: '2rem' }} />
            ) : (
              <>
                <CloudSVG
                  style={{
                    maxHeight: '100%',
                    height: '100%',
                    width: '1.55rem',
                  }}
                />
                <span>
                  <LogoSVG className="logo" />
                </span>
              </>
            )}
            {!sideMenuOpen && (
              <span className="toggle">
                <span className="label">
                  <FontAwesomeIcon
                    icon={sideMenuMinimised ? faChevronRight : faChevronLeft}
                    transform="shrink-6"
                  />
                </span>
              </span>
            )}
          </LogoWrapper>
          <Heading title={t('network')} minimised={sideMenuMinimised} />
          <Secondary
            classes={[apiStatusClass]}
            name={capitalizeFirstLetter(network)}
            onClick={() => openModal({ key: 'Networks' })}
            icon={{
              Svg: networkData.brand.inline.svg,
              size: networkData.brand.inline.size,
            }}
            minimised={sideMenuMinimised}
            bullet={apiStatusClass}
          />
          <Separator />
          <Main />
          <div className="inner">
            <Heading title={t('support')} minimised={sideMenuMinimised} />
            <Secondary
              onClick={() => {
                openHelp(null)
              }}
              name={t('resources')}
              minimised={sideMenuMinimised}
              icon={{
                Svg: BookSVG,
                size: sideMenuMinimised ? '0.95em' : '0.8em',
              }}
            />
            <Secondary
              onClick={() => openModal({ key: 'DiscordSupport', size: 'sm' })}
              name="Discord"
              minimised={sideMenuMinimised}
              icon={{
                Svg: DiscordSVG,
                size: sideMenuMinimised ? '1.2em' : '1em',
              }}
            />
            <Secondary
              onClick={() => openModal({ key: 'MailSupport', size: 'sm' })}
              name={t('email', { ns: 'app' })}
              minimised={sideMenuMinimised}
              icon={{
                Svg: EnvelopeSVG,
                size: sideMenuMinimised ? '1.05em' : '0.9em',
              }}
            />

            <Secondary
              onClick={handleInviteClick}
              name={t('invite')}
              minimised={sideMenuMinimised}
              icon={{
                Svg: LinkSVG,
                size: sideMenuMinimised ? '1.05em' : '0.9em',
              }}
              classes={!canCreateInvites ? ['inactive'] : undefined}
            />
          </div>
        </section>
      </Wrapper>
    </Page.Side>
  )
}
