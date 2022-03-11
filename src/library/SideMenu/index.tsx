// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useEffect } from 'react';
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
import { POLKADOT_URL, GLOBAL_MESSGE_KEYS } from '../../constants';

export const SideMenu = () => {

  const { activeAccount, accountExists, setMessage, status: connectStatus }: any = useConnect();
  const { getBondedAccount }: any = useBalances();
  const { pathname }: any = useLocation();

  const [pageConfigWithMessages, setPageConfigWithMessages]: any = useState(Object.assign(PAGES_CONFIG));

  // determine account messages here

  useEffect(() => {

    // only process account messages and warnings once accounts are connected
    if (connectStatus === 1) {
      let _pageConfigWithMessages: any = Object.assign(PAGES_CONFIG);

      let messages: any = [];

      for (let i = 0; i < _pageConfigWithMessages.length; i++) {
        let { uri } = _pageConfigWithMessages[i];
        let controller = getBondedAccount(activeAccount);

        if (uri === '/stake') {
          // inject Staking warning if controller account does not exist
          // ensure controller has been set
          if (controller !== null) {
            // check if it is a connected account
            if (!accountExists(controller)) {

              // add message to app context
              messages.push({
                key: GLOBAL_MESSGE_KEYS.CONTROLLER_NOT_IMPORTED,
                msg: true
              });
              // set warning symbol in menu
              _pageConfigWithMessages[i].action = faExclamationTriangle;
            } else {
              _pageConfigWithMessages[i].action = undefined;
            }
          }
        }
      }
      setPageConfigWithMessages(_pageConfigWithMessages);
      for (let msg of messages) {
        setMessage(msg.key, msg.msg);
      }
    }
  }, [activeAccount, connectStatus]);

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
            {pageConfigWithMessages.map((page: any, pageIndex: number) =>
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
        <button onClick={() => window.open('https://github.com/rossbulat/polkadot-staking-experience', '_blank')}>
          <FontAwesomeIcon icon={faGithub} transform='grow-10' />
        </button>
      </section>
    </Wrapper>
  );
}

export default SideMenu;