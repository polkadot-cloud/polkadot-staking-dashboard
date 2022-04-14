// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
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
import { POLKADOT_URL, GLOBAL_MESSGE_KEYS } from '../../constants';
import { useUi } from '../../contexts/UI';
import { useOutsideAlerter } from '../../library/Hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faExclamationTriangle, faMoon as faDark } from '@fortawesome/free-solid-svg-icons';
import { faCircle as faLight } from '@fortawesome/free-regular-svg-icons';
import { useTheme } from '../../contexts/Themes';

export const SideMenu = () => {

  const { mode, toggleTheme } = useTheme();
  const { activeAccount, status: connectStatus }: any = useConnect();
  const { getMessage }: any = useMessages();
  const { pathname }: any = useLocation();
  const { setSideMenu, sideMenuOpen }: any = useUi();

  const [pageConfig, setPageConfig]: any = useState({
    categories: Object.assign(PAGE_CATEGORIES),
    pages: Object.assign(PAGES_CONFIG),
  });

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
    <Wrapper ref={ref}>
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
        >
          <PolkadotLogoSVG style={{ maxHeight: '100%' }} />
        </LogoWrapper>

        {pageConfig.categories.map((category: any, categoryIndex: number) =>
          <React.Fragment key={`sidemenu_category_${categoryIndex}`}>

            {/* display heading if not `default` (used for top links) */}
            {category.title !== 'default' && <Heading title={category.title} />}

            {/* display category links*/}
            {pageConfig.pages.map((page: any, pageIndex: number) =>
              <React.Fragment key={`sidemenu_page_${pageIndex}`}>
                {page.category === category._id &&
                  <Item
                    name={page.title}
                    to={page.uri}
                    active={page.uri === pathname}
                    icon={<FontAwesomeIcon icon={page.icon} transform='shrink-1' />}
                    action={page.action}
                  />
                }
              </React.Fragment>
            )}
          </React.Fragment>
        )}
      </section>

      <section>
        <button onClick={() => toggleTheme()}>
          <FontAwesomeIcon icon={mode === 'light' ? faLight : faDark} transform={mode === 'light' ? 'grow-9' : 'grow-7'} />
        </button>
        <button onClick={() => window.open('https://github.com/rossbulat/polkadot-staking-experience', '_blank')}>
          <FontAwesomeIcon icon={faGithub} transform='grow-9' />
        </button>

      </section>
    </Wrapper>
  );
}

export default SideMenu;