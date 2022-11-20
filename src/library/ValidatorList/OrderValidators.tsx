// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faCheckCircle, faCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Title } from 'library/Overlay/Title';
import { FilterListWrapper } from 'library/Overlay/Wrappers';

export const OrderValidators = () => {
  return (
    <FilterListWrapper>
      <Title title="Order Validators" />
      <div className="body">
        <h5>Order By:</h5>
        <button
          type="button"
          className="item"
          onClick={() => {
            /* TODO: add filter */
          }}
        >
          <FontAwesomeIcon transform="grow-2" icon={faCheckCircle} />
          <h4>Default</h4>
        </button>
        <button
          type="button"
          className="item"
          onClick={() => {
            /* TODO: add filter */
          }}
        >
          <FontAwesomeIcon transform="grow-2" icon={faCircle} />
          <h4>Low Commission</h4>
        </button>
      </div>
    </FilterListWrapper>
  );
};
