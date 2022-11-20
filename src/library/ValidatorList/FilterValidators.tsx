// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Title } from 'library/Overlay/Title';
import { FilterListWrapper } from 'library/Overlay/Wrappers';

export const FilterValidators = () => {
  return (
    <FilterListWrapper>
      <Title title="Filter Validators" />
      <div className="body">
        <h5>Exclude:</h5>
        <button
          type="button"
          className="item"
          onClick={() => {
            /* TODO: add filter */
          }}
        >
          <FontAwesomeIcon transform="grow-2" icon={faCircle} />
          <h4>Inactive Validators</h4>
        </button>
        <button
          type="button"
          className="item"
          onClick={() => {
            /* TODO: add filter */
          }}
        >
          <FontAwesomeIcon transform="grow-2" icon={faCircle} />
          <h4>Over Subscribed</h4>
        </button>
        <button
          type="button"
          className="item"
          onClick={() => {
            /* TODO: add filter */
          }}
        >
          <FontAwesomeIcon transform="grow-2" icon={faCircle} />
          <h4>100% Commission</h4>
        </button>
        <button
          type="button"
          className="item"
          onClick={() => {
            /* TODO: add filter */
          }}
        >
          <FontAwesomeIcon transform="grow-2" icon={faCircle} />
          <h4>Blocked Nominations</h4>
        </button>
        <button
          type="button"
          className="item"
          onClick={() => {
            /* TODO: add filter */
          }}
        >
          <FontAwesomeIcon transform="grow-2" icon={faCircle} />
          <h4>Missing Identity</h4>
        </button>
      </div>
    </FilterListWrapper>
  );
};
