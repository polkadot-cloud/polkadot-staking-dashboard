// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpandAlt, faCompressAlt } from '@fortawesome/free-solid-svg-icons';
import throttle from 'lodash.throttle';
import { useUi } from 'contexts/UI';
import { useModal } from 'contexts/Modal';
import { useApi } from 'contexts/Api';
import { ReactComponent as CogOutlineSVG } from 'img/cog-outline.svg';
import { ReactComponent as LogoGithubSVG } from 'img/logo-github.svg';
import { ReactComponent as InfoSVG } from 'img/info.svg';
import { ReactComponent as ForumSVG } from 'img/forum.svg';
import { ReactComponent as MoonOutlineSVG } from 'img/moon-outline.svg';
import { ReactComponent as SunnyOutlineSVG } from 'img/sunny-outline.svg';
import { SIDE_MENU_STICKY_THRESHOLD } from 'consts';
import { useOutsideAlerter } from 'library/Hooks';
import { UIContextInterface } from 'contexts/UI/types';
import { ConnectionStatus } from 'contexts/Api/types';
import { defaultThemes } from 'theme/default';
import { useTheme } from 'contexts/Themes';
import { useHelp } from 'contexts/Help';
import { TranslationButtons } from 'translation';
import { useTranslation } from 'react-i18next';
import { Separator, Wrapper, ConnectionSymbol } from './Wrapper';
import { Secondary } from './Secondary';
import Heading from './Heading/Heading';
import { Main } from './Main';

export const SideMenu = () => {
  const { network, status } = useApi();
  const { mode, toggleTheme } = useTheme();
  const { openModalWith } = useModal();
  const {
    setSideMenu,
    sideMenuMinimised,
    userSideMenuMinimised,
    setUserSideMenuMinimised,
  }: UIContextInterface = useUi();
  const { openHelpWith } = useHelp();
  const { t } = useTranslation('common');

  // listen to window resize to hide SideMenu
  useEffect(() => {
    window.addEventListener('resize', windowThrottle);
    return () => {
      window.removeEventListener('resize', windowThrottle);
    };
  }, []);

  const throttleCallback = () => {
    if (window.innerWidth >= SIDE_MENU_STICKY_THRESHOLD) {
      setSideMenu(0);
    }
  };
  const windowThrottle = throttle(throttleCallback, 200, {
    trailing: true,
    leading: false,
  });

  const ref = useRef(null);
  useOutsideAlerter(ref, () => {
    setSideMenu(0);
  });

  // handle connection symbol
  const symbolColor =
    status === ConnectionStatus.Connecting
      ? defaultThemes.status.warning.solid[mode]
      : status === ConnectionStatus.Connected
      ? defaultThemes.status.success.solid[mode]
      : defaultThemes.status.danger.solid[mode];

  // handle transparent border color
  const borderColor =
    status === ConnectionStatus.Connecting
      ? defaultThemes.status.warning.transparent[mode]
      : status === ConnectionStatus.Connected
      ? defaultThemes.status.success.transparent[mode]
      : defaultThemes.status.danger.transparent[mode];

  return (
    <Wrapper ref={ref} minimised={sideMenuMinimised}>
      <section>
        <Main />
        <Heading title={t('library.support')} minimised={sideMenuMinimised} />
        <Secondary
          onClick={() => {
            openHelpWith(null, {});
          }}
          name={t('library.help')}
          minimised={sideMenuMinimised}
          icon={{
            Svg: InfoSVG,
            size: sideMenuMinimised ? '1.6rem' : '1.4rem',
          }}
        />
        <Heading title="Feedback" minimised={sideMenuMinimised} />
        <Secondary
          onClick={() => openModalWith('GoToFeedback')}
          name="Feedback"
          minimised={sideMenuMinimised}
          icon={{
            Svg: ForumSVG,
            size: sideMenuMinimised ? '1.6rem' : '1.4rem',
          }}
        />
        <Separator />
        <Heading title={t('library.network')} minimised={sideMenuMinimised} />
        <Secondary
          name={network.name}
          borderColor={borderColor}
          onClick={() => openModalWith('Networks')}
          icon={{
            Svg: network.brand.inline.svg,
            size: network.brand.inline.size,
          }}
          minimised={sideMenuMinimised}
          action={
            <ConnectionSymbol color={[symbolColor]} style={{ opacity: 0.7 }} />
          }
        />
      </section>

      <section>
        <button
          type="button"
          onClick={() =>
            setUserSideMenuMinimised(userSideMenuMinimised ? 0 : 1)
          }
        >
          <FontAwesomeIcon
            icon={userSideMenuMinimised ? faExpandAlt : faCompressAlt}
            transform="grow-3"
          />
        </button>
        <button
          type="button"
          onClick={() =>
            window.open(
              'https://github.com/paritytech/polkadot-staking-dashboard',
              '_blank'
            )
          }
        >
          <LogoGithubSVG width="1.4rem" height="1.4rem" />
        </button>
        <button
          type="button"
          onClick={() => openModalWith('Settings', {}, 'small')}
        >
          <CogOutlineSVG width="1.6rem" height="1.6rem" />
        </button>

        {mode === 'light' ? (
          <button type="button" onClick={() => toggleTheme()}>
            <SunnyOutlineSVG width="1.7rem" height="1.7rem" />
          </button>
        ) : (
          <button type="button" onClick={() => toggleTheme()}>
            <MoonOutlineSVG width="1.4rem" height="1.4rem" />
          </button>
        )}
        <TranslationButtons />
      </section>
    </Wrapper>
  );
};

export default SideMenu;
