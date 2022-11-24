// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faBan, faFilterCircleXmark } from '@fortawesome/free-solid-svg-icons';
import {
  ButtonInvertRounded,
  ButtonSecondary,
} from '@rossbulat/polkadot-dashboard-ui';
import { useFilters } from 'contexts/Filters';
import { FilterType } from 'contexts/Filters/types';
import { useOverlay } from 'contexts/Overlay';
import { Container } from 'library/Filter/Container';
import { Item } from 'library/Filter/Item';
import { useEffect } from 'react';
import { usePoolFilters } from '../Hooks/usePoolFilters';
import { FilterPools } from './FilterPools';

export const Filters = () => {
  const { resetFilters, getFilters, toggleFilter } = useFilters();
  const { filtersToLabels } = usePoolFilters();
  const { openOverlayWith } = useOverlay();

  const excludes = getFilters(FilterType.Exclude, 'pools');

  // scroll to top of the window on every filter.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [excludes]);

  return (
    <>
      <div style={{ marginBottom: '1.1rem' }}>
        <ButtonInvertRounded
          text="Filter"
          marginRight
          iconLeft={faFilterCircleXmark}
          onClick={() => {
            openOverlayWith(<FilterPools />);
          }}
        />
        <ButtonSecondary
          text="Reset"
          onClick={() => {
            resetFilters(FilterType.Exclude, 'pools');
          }}
          disabled={!excludes?.length}
        />
      </div>
      <Container>
        <div className="items">
          {!excludes?.length && <Item label="No filters" disabled />}
          {excludes?.map((e: string, i: number) => (
            <Item
              key={`pool_filter_${i}`}
              label={filtersToLabels[e]}
              icon={faBan}
              transform="grow-2"
              onClick={() => {
                toggleFilter(FilterType.Exclude, 'pools', e);
              }}
            />
          ))}
        </div>
      </Container>
    </>
  );
};

export default Filters;
