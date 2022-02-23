import React from 'react';
import { Wrapper, Separator } from './Wrapper';
import Heading from './Heading';
import Item from './Item';
import { PAGE_CATEGORIES, PAGES_CONFIG } from '../../pages';
import { useLocation } from 'react-router-dom';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactComponent as PolkadotLogoSVG } from '../../img/polkadot_logo.svg';

export const SideMenu = () => {

  const { pathname } = useLocation();

  return (
    <Wrapper>
      <section>
        <div className='logo'>
          <PolkadotLogoSVG style={{ maxHeight: '100%' }} />
        </div>

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