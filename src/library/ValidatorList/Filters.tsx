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
import { useFilters } from 'contexts/Filters';
import { useOverlay } from 'contexts/Overlay';
import { Container } from 'library/Filter/Container';
import { useValidatorFilter } from 'library/Filter/context';
import { Item } from 'library/Filter/Item';
import { useEffect } from 'react';
import { FilterValidators } from './FilterValidators';
import { OrderValidators } from './OrderValidators';
import { useValidatorFilters } from './useValidatorFilters';

export const Filters = () => {
  const { validatorOrder, orderValidators } = useValidatorFilter();
  const { openOverlayWith } = useOverlay();
  const {
    clearExcludes,
    getExcludes,
    getOrder,
    setMultiExcludes,
    toggleExclude,
  } = useFilters();
  const { filtersToLabels, ordersToLabels } = useValidatorFilters();

  const excludes = getExcludes('validators');
  const order = getOrder('validators');

  const handleFilter = (fn: any, filter: string) => {
    fn(filter);
  };

  // scroll to top of the window on every filter.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [excludes]);

  return (
    <>
      <div style={{ marginBottom: '1.1rem' }}>
        <ButtonInvertRounded
          text="Order"
          marginRight
          iconLeft={faArrowDownWideShort}
          onClick={() => {
            openOverlayWith(<OrderValidators />);
          }}
        />
        <ButtonInvertRounded
          text="Filter"
          marginRight
          iconLeft={faFilterCircleXmark}
          onClick={() => {
            openOverlayWith(<FilterValidators />);
          }}
        />
        <ButtonSecondary
          text="Apply All"
          marginRight
          onClick={() =>
            setMultiExcludes('validators', [
              'missing_identity',
              'over_subscribed',
              'all_commission',
              'blocked_nominations',
              'inactive',
            ])
          }
          disabled={excludes?.length === 5}
        />
        <ButtonSecondary
          text="Clear"
          onClick={() => {
            clearExcludes('validators');
            handleFilter(orderValidators, 'default');
          }}
          disabled={!excludes?.length && validatorOrder === 'default'}
        />
      </div>
      <Container>
        <div className="items">
          <Item
            label={
              order === 'default'
                ? 'Unordered'
                : `Order: ${ordersToLabels[order]}`
            }
            disabled
          />
          {!excludes?.length && <Item label="No filters" disabled />}
          {excludes?.map((e: string, i: number) => (
            <Item
              key={`validator_filter_${i}`}
              label={filtersToLabels[e]}
              icon={faBan}
              transform="grow-2"
              onClick={() => {
                toggleExclude('validators', e);
              }}
            />
          ))}
        </div>
      </Container>
    </>
  );
};

export default Filters;
