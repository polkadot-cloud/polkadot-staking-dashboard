// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ItemWrapper as Wrapper } from './Wrapper';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const Item = (props: any) => {

  const { name, active, to, icon, action } = props;


  return (
    <Link to={to}>
      <Wrapper
        className={active ? `active` : `inactive`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{
          duration: 0.1,
        }}
      >
        <div className='icon'>
          {icon}
        </div>

        <div className='name'>
          {name}
        </div>
        {action &&
          <div className='action'>
            <FontAwesomeIcon icon={action} color="rgba(242, 185, 27,0.5)" />
          </div>
        }

      </Wrapper>
    </Link>
  )

}

export default Item;