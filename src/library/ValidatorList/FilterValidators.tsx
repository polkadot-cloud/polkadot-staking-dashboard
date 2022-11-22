// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faCheckCircle, faCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFilters } from 'contexts/Filters';
import { Title } from 'library/Overlay/Title';
import { FilterListWrapper } from 'library/Overlay/Wrappers';

export const FilterValidators = () => {
  const { getExcludes, toggleExclude } = useFilters();

  const excludes = getExcludes('validators');

  return (
    <FilterListWrapper>
      <Title title="Filter Validators" />
      <div className="body">
        <button
          type="button"
          className="item"
          onClick={() => {
            toggleExclude('validators', 'inactive');
          }}
        >
          <FontAwesomeIcon
            transform="grow-2"
            icon={excludes?.includes('inactive') ? faCheckCircle : faCircle}
          />
          <h4>Inactive Validators</h4>
        </button>
        <button
          type="button"
          className="item"
          onClick={() => {
            toggleExclude('validators', 'over_subscribed');
          }}
        >
          <FontAwesomeIcon
            transform="grow-2"
            icon={
              excludes?.includes('over_subscribed') ? faCheckCircle : faCircle
            }
          />
          <h4>Over Subscribed</h4>
        </button>
        <button
          type="button"
          className="item"
          onClick={() => {
            toggleExclude('validators', 'all_commission');
          }}
        >
          <FontAwesomeIcon
            transform="grow-2"
            icon={
              excludes?.includes('all_commission') ? faCheckCircle : faCircle
            }
          />
          <h4>100% Commission</h4>
        </button>
        <button
          type="button"
          className="item"
          onClick={() => {
            toggleExclude('validators', 'blocked_nominations');
          }}
        >
          <FontAwesomeIcon
            transform="grow-2"
            icon={
              excludes?.includes('blocked_nominations')
                ? faCheckCircle
                : faCircle
            }
          />
          <h4>Blocked Nominations</h4>
        </button>
        <button
          type="button"
          className="item"
          onClick={() => {
            toggleExclude('validators', 'missing_identity');
          }}
        >
          <FontAwesomeIcon
            transform="grow-2"
            icon={
              excludes?.includes('missing_identity') ? faCheckCircle : faCircle
            }
          />
          <h4>Missing Identity</h4>
        </button>
      </div>
    </FilterListWrapper>
  );
};
