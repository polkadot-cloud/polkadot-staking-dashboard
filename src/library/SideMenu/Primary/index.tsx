// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { useUi } from 'contexts/UI';
import { Wrapper, MinimisedWrapper } from './Wrappers';
import { ItemProps } from '../types';

export const Primary = (props: ItemProps) => {
  const { setSideMenu } = useUi();

  const { name, active, to, icon, action, minimised } = props;

  const StyledWrapper = minimised ? MinimisedWrapper : Wrapper;

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
        <div className="icon">{icon}</div>
        {!minimised && <h3 className="name">{name}</h3>}

        {action && (
          <div className={`action${minimised ? ` minimised` : ``}`}>
            <FontAwesomeIcon
              icon={faCircle as IconProp}
              color="rgba(242, 185, 27,0.75)"
              transform="shrink-3"
            />
          </div>
        )}
      </StyledWrapper>
    </Link>
  );
};

export default Primary;
