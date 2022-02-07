import React from 'react';
import { Wrapper } from './Wrapper';
import Heading from './Heading';
import Item from './Item';
import { PAGE_CATEGORIES, PAGES_CONFIG } from '../../pages';
import { useLocation } from 'react-router-dom';

export const SideMenu = () => {

  const { pathname } = useLocation();

  return (
    <Wrapper>
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
    </Wrapper>
  );
}

export default SideMenu;