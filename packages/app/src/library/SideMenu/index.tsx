// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCompressAlt, faExpandAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { capitalizeFirstLetter } from '@w3ux/utils';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { SideMenuMaximisedWidth, PageWidthMediumThreshold } from 'consts';
import { useApi } from 'contexts/Api';
import { useHelp } from 'contexts/Help';
import { useTheme } from 'contexts/Themes';
import { useUi } from 'contexts/UI';
import type { UIContextInterface } from 'contexts/UI/types';
import CogOutlineSVG from 'img/cog-outline.svg?react';
import EnvelopeSVG from 'img/envelope.svg?react';
import BookSVG from 'img/book.svg?react';
import DiscordSVG from 'img/discord.svg?react';
import LanguageSVG from 'img/language.svg?react';
import LogoGithubSVG from 'img/logo-github.svg?react';
import MoonOutlineSVG from 'img/moon-outline.svg?react';
import SunnyOutlineSVG from 'img/sunny-outline.svg?react';
import { useOverlay } from 'kits/Overlay/Provider';
import { useNetwork } from 'contexts/Network';
import { Heading } from './Heading/Heading';
import { Main } from './Main';
import { Secondary } from './Secondary';
import { ConnectionSymbol, Separator, Wrapper, LogoWrapper } from './Wrapper';
import { useOutsideAlerter, useOnResize } from '@w3ux/hooks';
import { Side } from 'ui-structure';
import LogoSVG from 'img/logo.svg?react';

export const SideMenu = () => {
  const { t } = useTranslation('base');
  const { openHelp } = useHelp();
  const { apiStatus } = useApi();
  const {
    setSideMenu,
    sideMenuOpen,
    sideMenuMinimised,
    userSideMenuMinimised,
    setUserSideMenuMinimised,
  }: UIContextInterface = useUi();
  const { mode, toggleTheme } = useTheme();
  const { openModal } = useOverlay().modal;
  const { networkData, network } = useNetwork();

  // Listen to window resize to automatically hide the side menu on window resize.
  useOnResize(() => {
    if (window.innerWidth >= PageWidthMediumThreshold) {
      setSideMenu(false);
    }
  });

  // Define side menu ref and close the side menu when clicking outside of it.
  const ref = useRef(null);
  useOutsideAlerter(ref, () => {
    setSideMenu(false);
  });

  const apiStatusClass =
    apiStatus === 'connecting'
      ? 'warning'
      : ['connected', 'ready'].includes(apiStatus)
        ? 'success'
        : 'danger';

  return (
    <Side
      open={sideMenuOpen}
      minimised={sideMenuMinimised}
      width={`${SideMenuMaximisedWidth}px`}
    >
      <Wrapper ref={ref} $minimised={sideMenuMinimised}>
        <section>
          <LogoWrapper $minimised={sideMenuMinimised}>
            {sideMenuMinimised ? (
              <networkData.brand.icon
                style={{ maxHeight: '100%', width: '1.8rem' }}
              />
            ) : (
              <>
                <networkData.brand.icon
                  style={{
                    maxHeight: '100%',
                    height: '100%',
                    width: '1.5rem',
                  }}
                />

                <span>
                  <LogoSVG className="logo" />
                </span>
              </>
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
            action={
              <ConnectionSymbol
                className={apiStatusClass}
                style={{ opacity: 0.7 }}
              />
            }
          />
          <Separator />
          <Main />
          <div className="inner">
            <Heading title={t('support')} minimised={sideMenuMinimised} />
            <Secondary
              onClick={() => {
                openHelp(null);
              }}
              name={t('resources')}
              minimised={sideMenuMinimised}
              icon={{
                Svg: BookSVG,
                size: sideMenuMinimised ? '1.05em' : '0.95em',
              }}
            />

            <Secondary
              onClick={() => openModal({ key: 'DiscordSupport', size: 'sm' })}
              name="Discord"
              minimised={sideMenuMinimised}
              icon={{
                Svg: DiscordSVG,
                size: sideMenuMinimised ? '1.3em' : '1.2em',
              }}
            />

            <Secondary
              onClick={() => openModal({ key: 'MailSupport', size: 'sm' })}
              name={'Email'}
              minimised={sideMenuMinimised}
              icon={{
                Svg: EnvelopeSVG,
                size: sideMenuMinimised ? '1.1em' : '1em',
              }}
            />
          </div>
        </section>

        <section>
          <button
            type="button"
            onClick={() => setUserSideMenuMinimised(!userSideMenuMinimised)}
            aria-label="Menu"
          >
            <FontAwesomeIcon
              icon={userSideMenuMinimised ? faExpandAlt : faCompressAlt}
            />
          </button>
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
            <CogOutlineSVG width="1.3em" height="1.3em" />
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
    </Side>
  );
};
