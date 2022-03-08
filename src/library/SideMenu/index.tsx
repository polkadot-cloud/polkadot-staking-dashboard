// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Wrapper, LogoWrapper, Separator } from './Wrapper';
import Heading from './Heading';
import Item from './Item';
import { PAGE_CATEGORIES, PAGES_CONFIG } from '../../pages';
import { useConnect } from '../../contexts/Connect'
import { useBalances } from '../../contexts/Balances';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { ReactComponent as PolkadotLogoSVG } from '../../img/polkadot_logo.svg';
import { POLKADOT_URL } from '../../constants';

export const SideMenu = () => {

  const { activeAccount, accountExists }: any = useConnect();
  const { getBondedAccount }: any = useBalances();
  const { pathname }: any = useLocation();

  // inject actions into PAGE_CONFIG
  let PAGES_CONFIG_WITH_ACTIONS: any = Object.values(PAGES_CONFIG);

  for (let i = 0; i < PAGES_CONFIG_WITH_ACTIONS.length; i++) {
    let { uri } = PAGES_CONFIG_WITH_ACTIONS[i];

    switch (uri) {
      // inject Staking warning if controller account does not exist
      case '/stake':
        let controller = getBondedAccount(activeAccount);
        // ensure controller has been set
        if (controller !== null) {
          // check if it is a connected account
          if (!accountExists(controller)) {
            PAGES_CONFIG_WITH_ACTIONS[i].action = faExclamationTriangle;
          }
        }
        break;
    }
  }

  return (
    <Wrapper>
      <section>
        <LogoWrapper
          onClick={() => { window.open(POLKADOT_URL, '_blank') }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <PolkadotLogoSVG style={{ maxHeight: '100%' }} />
        </LogoWrapper>

        {PAGE_CATEGORIES.map((category, categoryIndex) =>
          <React.Fragment key={`sidemenu_category_${categoryIndex}`}>

            {/* display heading if not `default` (used for top links) */}
            {category.title !== 'default' && <Heading title={category.title} />}

            {/* display category links*/}
            {PAGES_CONFIG_WITH_ACTIONS.map((page: any, pageIndex: number) =>
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
        <Separator />
        <button onClick={() => console.log("go to github")}>
          <FontAwesomeIcon icon={faGithub} transform='grow-10' />
        </button>
      </section>
    </Wrapper>
  );
}

export default SideMenu;