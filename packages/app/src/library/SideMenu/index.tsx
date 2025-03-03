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
import LogoGithubSVG from 'assets/svg/brands/github.svg?react'
import BookSVG from 'assets/svg/icons/book.svg?react'
import CloudSVG from 'assets/svg/icons/cloud.svg?react'
import CogSVG from 'assets/svg/icons/cog.svg?react'
import EnvelopeSVG from 'assets/svg/icons/envelope.svg?react'
import LanguageSVG from 'assets/svg/icons/language.svg?react'
import LogoSVG from 'assets/svg/icons/logo.svg?react'
import MoonOutlineSVG from 'assets/svg/icons/moon.svg?react'
import SunnyOutlineSVG from 'assets/svg/icons/sun.svg?react'
import { PageWidthMediumThreshold } from 'consts'
import { useApi } from 'contexts/Api'
import { useHelp } from 'contexts/Help'
import { useNetwork } from 'contexts/Network'
import { useTheme } from 'contexts/Themes'
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
  const { mode, toggleTheme } = useTheme()
  const { openModal } = useOverlay().modal
  const { networkData, network } = useNetwork()

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
              onClick={() => openModal({ key: 'Invite', size: 'sm' })}
              name={t('invite')}
              minimised={sideMenuMinimised}
              icon={{
                Svg: DiscordSVG,
                size: sideMenuMinimised ? '1.05em' : '1em',
              }}
            />
          </div>
        </section>
        <section>
          <button
            type="button"
            onClick={() =>
              window.open(
                'https://github.com/polkadot-cloud/polkadot-staking-dashboard',
                '_blank'
              )
            }
            aria-label="Github"
          >
            <LogoGithubSVG width="1.2em" height="1.2em" />
          </button>
          <button
            type="button"
            onClick={() => openModal({ key: 'Settings' })}
            aria-label="Settings"
          >
            <CogSVG width="1.3em" height="1.3em" />
          </button>
          <button
            type="button"
            onClick={() => openModal({ key: 'ChooseLanguage' })}
          >
            <LanguageSVG width="1.25em" height="1.25em" />
          </button>
          {mode === 'dark' ? (
            <button
              type="button"
              onClick={() => toggleTheme()}
              aria-label="aria-label"
            >
              <SunnyOutlineSVG width="1.25em" height="1.25em" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => toggleTheme()}
              aria-label="Toggle"
            >
              <MoonOutlineSVG width="1.1em" height="1.1em" />
            </button>
          )}
        </section>
      </Wrapper>
    </Page.Side>
  )
}
