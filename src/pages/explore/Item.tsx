// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ReactComponent as KusamaIconSVG } from 'img/kusama_icon.svg';
import { faServer } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ItemWrapper } from './Wrappers';

export const Item = () => {
  const listItem = {
    hidden: {
      opacity: 0,
      y: 25,
      transition: {
        duration: 0.4,
      },
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        type: 'spring',
        bounce: 0.2,
      },
    },
  };

  return (
    <ItemWrapper whileHover={{ scale: 1.01 }} variants={listItem}>
      <div className="inner">
        <section>
          <KusamaIconSVG width="10rem" />
        </section>
        <section>
          <h2>Validator Owner Name</h2>
          <h3>
            <FontAwesomeIcon icon={faServer} /> 2 Validators
          </h3>
        </section>
      </div>
    </ItemWrapper>
  );
};

export default Item;
