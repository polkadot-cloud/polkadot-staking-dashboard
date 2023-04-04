// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  faArrowDownWideShort,
  faBan,
  faCheck,
  faFilterCircleXmark,
} from '@fortawesome/free-solid-svg-icons';
import { ButtonPrimaryInvert, ButtonSecondary } from '@polkadotcloud/core-ui';
import { useFilters } from 'contexts/Filters';
import { useOverlay } from 'contexts/Overlay';
import { Container } from 'library/Filter/Container';
import { Item } from 'library/Filter/Item';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useValidatorFilters } from '../Hooks/useValidatorFilters';
import { FilterValidators } from './FilterValidators';
import { OrderValidators } from './OrderValidators';

export const Filters = () => {
  const { t } = useTranslation('library');
  const { openOverlayWith } = useOverlay();
  const { resetFilters, getFilters, getOrder, toggleFilter } = useFilters();
  const { includesToLabels, excludesToLabels, ordersToLabels } =
    useValidatorFilters();

  const includes = getFilters('include', 'validators');
  const excludes = getFilters('exclude', 'validators');
  const hasFilters = includes?.length || excludes?.length;
  const order = getOrder('validators');

  // scroll to top of the window on every filter.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [includes, excludes]);

  return (
    <>
      <div style={{ marginBottom: '1.1rem' }}>
        <ButtonPrimaryInvert
          text={t('order')}
          marginRight
          iconLeft={faArrowDownWideShort}
          onClick={() => {
            openOverlayWith(<OrderValidators />);
          }}
        />
        <ButtonPrimaryInvert
          text={t('filter')}
          marginRight
          iconLeft={faFilterCircleXmark}
          onClick={() => {
            openOverlayWith(<FilterValidators />);
          }}
        />
        <ButtonSecondary
          text={t('clear')}
          onClick={() => {
            resetFilters('include', 'validators');
            resetFilters('exclude', 'validators');
          }}
          disabled={!hasFilters}
        />
      </div>
      <Container>
        <div className="items">
          <Item
            label={
              order === 'default'
                ? `${t('unordered')}`
                : `${t('order')}: ${ordersToLabels[order]}`
            }
            disabled
          />
          {!hasFilters && <Item label={`${t('noFilters')}`} disabled />}
          {includes?.map((e: string, i: number) => (
            <Item
              key={`validator_include_${i}`}
              label={includesToLabels[e]}
              icon={faCheck}
              onClick={() => {
                toggleFilter('include', 'validators', e);
              }}
            />
          ))}
          {excludes?.map((e: string, i: number) => (
            <Item
              key={`validator_exclude_${i}`}
              label={excludesToLabels[e]}
              icon={faBan}
              transform="shrink-2"
              onClick={() => {
                toggleFilter('exclude', 'validators', e);
              }}
            />
          ))}
        </div>
      </Container>
    </>
  );
};
