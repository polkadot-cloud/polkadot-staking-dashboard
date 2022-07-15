// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faServer } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ItemWrapper } from './Wrappers';
import { useCommunitySections } from './context';

export const Item = (props: any) => {
  const { item, actionable } = props;
  const { name, Thumbnail, validators } = item;

  const { setActiveSection, setActiveItem, setScrollPos } =
    useCommunitySections();

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
    <ItemWrapper
      whileHover={{ scale: actionable ? 1.01 : 1 }}
      variants={listItem}
    >
      <div className="inner">
        <section>{Thumbnail !== null && <Thumbnail />}</section>
        <section>
          <h2>{name}</h2>
          <button
            disabled={!actionable}
            type="button"
            onClick={() => {
              if (actionable) {
                setActiveSection(1);
                setActiveItem(item);
                setScrollPos(window.scrollY);
              }
            }}
          >
            <h3>
              <FontAwesomeIcon icon={faServer} /> {validators.length} Validator
              {validators.length !== 1 && 's'}
            </h3>
          </button>
        </section>
      </div>
    </ItemWrapper>
  );
};

export default Item;
