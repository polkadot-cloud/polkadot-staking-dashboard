// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faCheckCircle, faCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFilters } from 'contexts/Filters';
import { FilterType } from 'contexts/Filters/types';
import { usePoolFilters } from 'library/Hooks/usePoolFilters';
import { Title } from 'library/Overlay/Title';
import { FilterListButton, FilterListWrapper } from 'library/Overlay/Wrappers';
import { useTranslation } from 'react-i18next';

export const FilterPools = () => {
  const { getFilters, toggleFilter } = useFilters();
  const { includesToLabels, excludesToLabels } = usePoolFilters();
  const { t } = useTranslation('library');

  const includes = getFilters(FilterType.Include, 'pools');
  const excludes = getFilters(FilterType.Exclude, 'pools');

  return (
    <FilterListWrapper>
      <Title title={t('filter_pools')} />
      <div className="body">
        <h4>{t('include')}</h4>
        {Object.entries(includesToLabels).map(([f, l]: any, i: number) => (
          <FilterListButton
            active={includes?.includes(f) ?? false}
            key={`pool_include_${i}`}
            type="button"
            onClick={() => {
              toggleFilter(FilterType.Include, 'pools', f);
            }}
          >
            <FontAwesomeIcon
              transform="grow-4"
              icon={includes?.includes(f) ? faCheckCircle : faCircle}
            />
            <h4>{l}</h4>
          </FilterListButton>
        ))}

        <h4>{t('exclude')}</h4>
        {Object.entries(excludesToLabels).map(([f, l]: any, i: number) => (
          <FilterListButton
            active={excludes?.includes(f) ?? false}
            key={`validator_filter_${i}`}
            type="button"
            onClick={() => {
              toggleFilter(FilterType.Exclude, 'pools', f);
            }}
          >
            <FontAwesomeIcon
              transform="grow-5"
              icon={excludes?.includes(f) ? faCheckCircle : faCircle}
            />
            <h4>{l}</h4>
          </FilterListButton>
        ))}
      </div>
    </FilterListWrapper>
  );
};
