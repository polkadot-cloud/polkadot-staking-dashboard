// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useEffect, useRef } from 'react';
import { Wrapper, LogoWrapper } from './Wrapper';
import Heading from './Heading';
import Item from './Item';
import { PAGE_CATEGORIES, PAGES_CONFIG } from '../../pages';
import { useConnect } from '../../contexts/Connect'
import { useLocation } from 'react-router-dom';
import { useMessages } from '../../contexts/Messages';
import { ReactComponent as PolkadotLogoSVG } from '../../img/polkadot_logo.svg';
import { ReactComponent as PolkadotIconSVG } from '../../img/polkadot_icon.svg';
import { POLKADOT_URL, GLOBAL_MESSGE_KEYS } from '../../constants';
import { useUi } from '../../contexts/UI';
import { useOutsideAlerter } from '../../library/Hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faExpandAlt, faCompressAlt } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../../contexts/Themes';
import { SunnyOutline, Moon, LogoGithub, Cog } from 'react-ionicons'
import { useModal } from '../../contexts/Modal';
import throttle from 'lodash.throttle';
import { SIDE_MENU_STICKY_THRESHOLD } from '../../constants';

export const SideMenu = () => {

  const { openModalWith } = useModal();
  const { mode, toggleTheme } = useTheme();
  const { activeAccount, connected: connectStatus }: any = useConnect();
  const { getMessage }: any = useMessages();
  const { pathname }: any = useLocation();
  const { setSideMenu, sideMenuOpen, sideMenuMinimised, userSideMenuMinimised, setUserSideMenuMinimised }: any = useUi();

  const [pageConfig, setPageConfig]: any = useState({
    categories: Object.assign(PAGE_CATEGORIES),
    pages: Object.assign(PAGES_CONFIG),
  });


  // listen to window resize to hide SideMenu
  useEffect(() => {
    window.addEventListener('resize', windowThrottle);
    return (() => {
      window.removeEventListener("resize", windowThrottle);
    })
  }, []);

  const throttleCallback = () => {
    if (window.innerWidth >= SIDE_MENU_STICKY_THRESHOLD) {
      setSideMenu(0);
    }
  }
  const windowThrottle = throttle(throttleCallback, 200, { trailing: true, leading: false });

  useEffect(() => {

    // only process account messages and warnings once accounts are connected
    if (connectStatus === 1) {
      let _pageConfigWithMessages: any = Object.assign(pageConfig.pages);

      for (let i = 0; i < _pageConfigWithMessages.length; i++) {
        let { uri } = _pageConfigWithMessages[i];

        if (uri === '/stake') {
          let notImported = getMessage(GLOBAL_MESSGE_KEYS.CONTROLLER_NOT_IMPORTED);
          if (notImported === true) {
            _pageConfigWithMessages[i].action = faExclamationTriangle;
          } else {
            _pageConfigWithMessages[i].action = null;
          }
        }
      }

      setPageConfig({
        categories: pageConfig.categories,
        pages: _pageConfigWithMessages,
      });
    }
  }, [activeAccount, connectStatus, getMessage(GLOBAL_MESSGE_KEYS.CONTROLLER_NOT_IMPORTED)]);

  const ref = useRef(null);
  useOutsideAlerter(ref, () => {
    setSideMenu(0);
  });

  return (
    <Wrapper
      ref={ref}
      minimised={sideMenuMinimised}
    >
      <section>
        <button
          className='close-menu'
          style={{ fontVariationSettings: "'wght' 450", margin: '0.2rem 0 1rem 0', opacity: 0.7 }}
          onClick={() => { setSideMenu(sideMenuOpen ? 0 : 1); }}
        >
          Close
        </button>

        <LogoWrapper
          onClick={() => { window.open(POLKADOT_URL, '_blank') }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          minimised={sideMenuMinimised}
        >
          {sideMenuMinimised
            ? <PolkadotIconSVG style={{ maxHeight: '100%' }} />
            : <PolkadotLogoSVG style={{ maxHeight: '100%' }} />
          }
        </LogoWrapper>

        {pageConfig.categories.map((category: any, categoryIndex: number) =>
          <React.Fragment key={`sidemenu_category_${categoryIndex}`}>

            {/* display heading if not `default` (used for top links) */}
            {category.title !== 'default' && <Heading title={category.title} minimised={sideMenuMinimised} />}

            {/* display category links*/}
            {pageConfig.pages.map((page: any, pageIndex: number) =>
              <React.Fragment key={`sidemenu_page_${pageIndex}`}>
                {page.category === category._id &&
                  <Item
                    name={page.title}
                    to={page.hash}
                    active={page.hash === pathname}
                    icon={<FontAwesomeIcon icon={page.icon} />}
                    action={page.action}
                    minimised={sideMenuMinimised}
                  />
                }
              </React.Fragment>
            )}
          </React.Fragment>
        )}
      </section>

      <section>
        <button onClick={() => window.open('https://github.com/rossbulat/polkadot-staking-experience', '_blank')}>
          <LogoGithub width='1.45rem' height='1.45rem' />
        </button>
        <button onClick={() => openModalWith('Settings', {}, 'small')}>
          <Cog width='1.65rem' height='1.65rem' />
        </button>
        <button onClick={() => toggleTheme()}>
          {mode === 'light'
            ? <SunnyOutline width='1.65rem' height='1.65rem' />
            : <Moon width='1.45rem' height='1.45rem' />
          }
        </button>
        <button onClick={() => setUserSideMenuMinimised(userSideMenuMinimised ? 0 : 1)}>
          <FontAwesomeIcon icon={userSideMenuMinimised ? faExpandAlt : faCompressAlt} transform="grow-3" />
        </button>
      </section>
    </Wrapper>
  );
}

export default SideMenu;