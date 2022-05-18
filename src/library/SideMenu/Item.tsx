// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useUi } from '../../contexts/UI';
import { ItemWrapper, MinimisedItemWrapper } from './Wrapper';

export const Item = (props: any) => {
  const { setSideMenu }: any = useUi();

  const {
    name, active, to, icon, action, minimised,
  } = props;

  const StyledWrapper = minimised ? MinimisedItemWrapper : ItemWrapper;

  return (
    <Link to={to} onClick={() => setSideMenu(0)}>
      <StyledWrapper
        className={active ? 'active' : 'inactive'}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{
          duration: 0.1,
        }}
      >
        <div className="icon">
          {icon}
        </div>
        {!minimised
          && (
          <>
            <h3 className="name">
              {name}
            </h3>

            {action
              && (
              <div className="action">
                <FontAwesomeIcon icon={action as IconProp} color="rgba(242, 185, 27,0.5)" />
              </div>
              )}
          </>
          )}
      </StyledWrapper>
    </Link>
  );
};

export default Item;
