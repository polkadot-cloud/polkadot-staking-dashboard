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
import { Item } from 'library/Filter/Item';
import { useEffect } from 'react';
import { useValidatorFilters } from '../Hooks/useValidatorFilters';
import { FilterValidators } from './FilterValidators';
import { OrderValidators } from './OrderValidators';

export const Filters = () => {
  const { openOverlayWith } = useOverlay();
  const { resetExcludes, getExcludes, getOrder, toggleExclude } = useFilters();
  const { filtersToLabels, ordersToLabels } = useValidatorFilters();

  const excludes = getExcludes('validators');
  const order = getOrder('validators');

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
          text="Reset"
          onClick={() => {
            resetExcludes('validators');
          }}
          disabled={!excludes?.length}
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
