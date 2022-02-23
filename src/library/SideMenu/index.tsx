import React from 'react';
import { Wrapper, LogoWrapper, Separator } from './Wrapper';
import Heading from './Heading';
import Item from './Item';
import { PAGE_CATEGORIES, PAGES_CONFIG } from '../../pages';
import { useLocation } from 'react-router-dom';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactComponent as PolkadotLogoSVG } from '../../img/polkadot_logo.svg';
import { POLKADOT_URL } from '../../constants';

export const SideMenu = () => {

  const { pathname } = useLocation();

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
            {PAGES_CONFIG.map((page, pageIndex) =>
              <React.Fragment key={`sidemenu_page_${pageIndex}`}>
                {page.category === category._id &&
                  <Item
                    name={page.title}
                    to={page.uri}
                    active={page.uri === pathname}
                    icon={<FontAwesomeIcon icon={page.icon} transform='shrink-1' />}
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