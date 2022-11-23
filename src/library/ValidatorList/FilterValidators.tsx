// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faCheckCircle, faCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFilters } from 'contexts/Filters';
import { Title } from 'library/Overlay/Title';
import { FilterListButton, FilterListWrapper } from 'library/Overlay/Wrappers';

export const FilterValidators = () => {
  const { getExcludes, toggleExclude } = useFilters();

  const excludes = getExcludes('validators');

  const filtersToLabels = {
    inactive: 'Inactive Validators',
    over_subscribed: 'Over Subscribed',
    all_commission: '100% Commission',
    blocked_nominations: 'Blocked Nominations',
    missing_identity: 'Missing Identity',
  };

  return (
    <FilterListWrapper>
      <Title title="Filter Validators" />
      <div className="body">
        {Object.entries(filtersToLabels).map(([f, l]: any, i: number) => (
          <FilterListButton
            active={excludes?.includes(f) ?? false}
            key={`validator_filter_${i}`}
            type="button"
            onClick={() => {
              toggleExclude('validators', f);
            }}
          >
            <FontAwesomeIcon
              transform="grow-2"
              icon={excludes?.includes(f) ? faCheckCircle : faCircle}
            />
            <h4>{l}</h4>
          </FilterListButton>
        ))}
      </div>
    </FilterListWrapper>
  );
};
