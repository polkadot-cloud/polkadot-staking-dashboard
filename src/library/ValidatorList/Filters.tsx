// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  faArrowDownWideShort,
  faBan,
  faFilterCircleXmark,
} from '@fortawesome/free-solid-svg-icons';
import {
  ButtonInvertRounded,
  ButtonSecondary,
} from '@rossbulat/polkadot-dashboard-ui';
import { useOverlay } from 'contexts/Overlay';
import { Container } from 'library/Filter/Container';
import { useValidatorFilter } from 'library/Filter/context';
import { Item } from 'library/Filter/Item';
import { useEffect } from 'react';

export const Filters = () => {
  const {
    validatorOrder,
    validatorFilters,
    orderValidators,
    toggleFilterValidators,
    toggleAllValidatorFilters,
  } = useValidatorFilter();
  const { openOverlayWith } = useOverlay();

  const handleFilter = (fn: any, filter: string) => {
    fn(filter);
  };

  // scroll to top of the window on every filter.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [validatorFilters]);

  return (
    <>
      <div style={{ marginBottom: '1.1rem' }}>
        <ButtonInvertRounded
          text="Order"
          marginRight
          iconLeft={faArrowDownWideShort}
          onClick={() => {
            openOverlayWith('', {});
          }}
        />
        <ButtonInvertRounded
          text="Filter"
          marginRight
          iconLeft={faFilterCircleXmark}
          onClick={() => {
            openOverlayWith('', {});
          }}
        />
        <ButtonSecondary
          text="Apply All"
          marginRight
          onClick={() => toggleAllValidatorFilters(1)}
        />
        <ButtonSecondary
          text="Clear"
          onClick={() => {
            toggleAllValidatorFilters(0);
            handleFilter(orderValidators, 'default');
          }}
          disabled={!validatorFilters.length && validatorOrder === 'default'}
        />
      </div>
      <Container>
        <div className="items">
          <Item
            label="Order: Low Commission"
            active={validatorOrder === 'commission'}
            onClick={() => handleFilter(orderValidators, 'commission')}
          />
          <Item
            label="Inactive Validators"
            icon={faBan}
            transform="grow-2"
            active={validatorFilters?.includes('inactive') ?? false}
            onClick={() => {
              handleFilter(toggleFilterValidators, 'inactive');
            }}
          />
          <Item
            label="Over Subscribed"
            icon={faBan}
            transform="grow-2"
            active={validatorFilters?.includes('over_subscribed') ?? false}
            onClick={() => {
              handleFilter(toggleFilterValidators, 'over_subscribed');
            }}
          />
          <Item
            label="100% Commission"
            icon={faBan}
            transform="grow-2"
            active={validatorFilters?.includes('all_commission') ?? false}
            onClick={() => {
              handleFilter(toggleFilterValidators, 'all_commission');
            }}
          />
          <Item
            label="Blocked Nominations"
            icon={faBan}
            transform="grow-2"
            active={validatorFilters?.includes('blocked_nominations') ?? false}
            onClick={() => {
              handleFilter(toggleFilterValidators, 'blocked_nominations');
            }}
          />
          <Item
            label="Missing Identity"
            icon={faBan}
            transform="grow-2"
            active={validatorFilters?.includes('missing_identity') ?? false}
            onClick={() => {
              handleFilter(toggleFilterValidators, 'missing_identity');
            }}
          />
        </div>
      </Container>
    </>
  );
};

export default Filters;
