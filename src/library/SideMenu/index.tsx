import React from 'react';
import { Wrapper, Separator } from './Wrapper';
import Heading from './Heading';
import Item from './Item';
import { PAGE_CATEGORIES, PAGES_CONFIG } from '../../pages';
import { useLocation } from 'react-router-dom';
import Connect from '../Connect';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useConnect } from '../../contexts/Connect';

export const SideMenu = () => {

  const connect = useConnect();
  const { pathname } = useLocation();

  return (
    <Wrapper>
      <section>
        {connect.status === 0 && <Connect />}

        {PAGE_CATEGORIES.map((category, categoryIndex) =>
          <React.Fragment key={`sidemenu_category_${categoryIndex}`}>

            {/* display heading if not `default` (used for top links) */}
            {category.title !== 'default' && <Heading title={category.title} />}

            {/* display category links*/}
            {PAGES_CONFIG.map((page, pageIndex) =>
              <React.Fragment key={`sidemenu_page_${pageIndex}`}>
                {page.category === category._id &&
                  <Item name={page.title} to={page.uri} active={page.uri === pathname} />
                }
              </React.Fragment>
            )
            }
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