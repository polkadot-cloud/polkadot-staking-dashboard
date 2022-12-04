// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faCompressAlt, faExpandAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SideMenuStickyThreshold } from 'consts';
import { useApi } from 'contexts/Api';
import { ConnectionStatus } from 'contexts/Api/types';
import { useHelp } from 'contexts/Help';
import { useModal } from 'contexts/Modal';
import { useTheme } from 'contexts/Themes';
import { useUi } from 'contexts/UI';
import { UIContextInterface } from 'contexts/UI/types';
import { ReactComponent as CogOutlineSVG } from 'img/cog-outline.svg';
import { ReactComponent as ForumSVG } from 'img/forum.svg';
import { ReactComponent as InfoSVG } from 'img/info.svg';
import { ReactComponent as LogoGithubSVG } from 'img/logo-github.svg';
import { ReactComponent as MoonOutlineSVG } from 'img/moon-outline.svg';
import { ReactComponent as SunnyOutlineSVG } from 'img/sunny-outline.svg';
import { useOutsideAlerter } from 'library/Hooks';
import throttle from 'lodash.throttle';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { defaultThemes } from 'theme/default';
import Heading from './Heading/Heading';
import { Main } from './Main';
import { Secondary } from './Secondary';
import { ConnectionSymbol, Separator, Wrapper } from './Wrapper';

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
  const { t } = useTranslation('base');

  // listen to window resize to hide SideMenu
  useEffect(() => {
    window.addEventListener('resize', windowThrottle);
    return () => {
      window.removeEventListener('resize', windowThrottle);
    };
  }, []);

  const throttleCallback = () => {
    if (window.innerWidth >= SideMenuStickyThreshold) {
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
        <Heading title={t('support')} minimised={sideMenuMinimised} />
        <Secondary
          onClick={() => {
            openHelpWith(null, {});
          }}
          name={t('resources')}
          minimised={sideMenuMinimised}
          icon={{
            Svg: InfoSVG,
            size: sideMenuMinimised ? '1.6em' : '1.4em',
          }}
        />
        <Secondary
          onClick={() => openModalWith('GoToFeedback')}
          name={t('feedback')}
          minimised={sideMenuMinimised}
          icon={{
            Svg: ForumSVG,
            size: sideMenuMinimised ? '1.6em' : '1.4em',
          }}
        />
        <Separator />
        <Heading title={t('network')} minimised={sideMenuMinimised} />
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
          <LogoGithubSVG width="1.4em" height="1.4em" />
        </button>
        <button
          type="button"
          onClick={() => openModalWith('Settings', {}, 'large')}
        >
          <CogOutlineSVG width="1.6em" height="1.6em" />
        </button>

        {mode === 'light' ? (
          <button type="button" onClick={() => toggleTheme()}>
            <SunnyOutlineSVG width="1.7em" height="1.7em" />
          </button>
        ) : (
          <button type="button" onClick={() => toggleTheme()}>
            <MoonOutlineSVG width="1.4em" height="1.4em" />
          </button>
        )}
      </section>
    </Wrapper>
  );
};

export default SideMenu;
