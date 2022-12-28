// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  faBan,
  faCheck,
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
import { useTranslation } from 'react-i18next';
import { usePoolFilters } from '../Hooks/usePoolFilters';
import { FilterPools } from './FilterPools';

export const Filters = () => {
  const { resetFilters, getFilters, toggleFilter } = useFilters();
  const { includesToLabels, excludesToLabels } = usePoolFilters();
  const { openOverlayWith } = useOverlay();
  const { t } = useTranslation('library');

  const includes = getFilters('include', 'pools');
  const excludes = getFilters('exclude', 'pools');
  const hasFilters = includes?.length || excludes?.length;

  // scroll to top of the window on every filter.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [includes, excludes]);

  return (
    <>
      <div style={{ marginBottom: '1.1rem' }}>
        <ButtonInvertRounded
          text={t('filter')}
          marginRight
          iconLeft={faFilterCircleXmark}
          onClick={() => {
            openOverlayWith(<FilterPools />);
          }}
        />
        <ButtonSecondary
          text={t('clear')}
          onClick={() => {
            resetFilters('include', 'pools');
            resetFilters('exclude', 'pools');
          }}
          disabled={!hasFilters}
        />
      </div>
      <Container>
        <div className="items">
          {!hasFilters && <Item label={t('noFilters') || ''} disabled />}
          {includes?.map((e: string, i: number) => (
            <Item
              key={`pool_include_${i}`}
              label={includesToLabels[e]}
              icon={faCheck}
              transform="grow-2"
              onClick={() => {
                toggleFilter('include', 'pools', e);
              }}
            />
          ))}
          {excludes?.map((e: string, i: number) => (
            <Item
              key={`pool_filter_${i}`}
              label={excludesToLabels[e]}
              icon={faBan}
              transform="grow-0"
              onClick={() => {
                toggleFilter('exclude', 'pools', e);
              }}
            />
          ))}
        </div>
      </Container>
    </>
  );
};
