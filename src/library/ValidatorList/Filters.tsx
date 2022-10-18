// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  faBalanceScaleLeft,
  faClock,
  faExclamationTriangle,
  faPercentage,
  faUserSlash,
  faUserTag,
} from '@fortawesome/free-solid-svg-icons';
import { Category } from 'library/Filter/Category';
import { Container } from 'library/Filter/Container';
import { useValidatorFilter } from 'library/Filter/context';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation('common');

  const handleFilter = (fn: any, filter: string) => {
    fn(filter);
  };

  // scroll to top of the window on every filter.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [validatorFilters]);

  return (
    <Container>
      <Category title={t('library.order')}>
        <Item
          label={t('library.active_low_commission')}
          icon={faPercentage}
          transform="grow-4"
          active={validatorOrder === 'commission'}
          onClick={() => handleFilter(orderValidators, 'commission')}
          width={175}
        />
      </Category>
      <Category
        title={t('library.exclude')}
        buttons={[
          {
            title: t('library.all'),
            onClick: () => toggleAllValidatorFilters(1),
          },
          {
            title: t('library.clear'),
            onClick: () => toggleAllValidatorFilters(0),
            disabled: !validatorFilters.length,
          },
        ]}
      >
        <Item
          label={t('library.inactive_validators')}
          icon={faClock}
          transform="grow-4"
          active={validatorFilters?.includes('inactive') ?? false}
          onClick={() => {
            handleFilter(toggleFilterValidators, 'inactive');
          }}
          width={170}
        />
        <Item
          label={t('library.over_subscribed')}
          icon={faExclamationTriangle}
          transform="grow-4"
          active={validatorFilters?.includes('over_subscribed') ?? false}
          onClick={() => {
            handleFilter(toggleFilterValidators, 'over_subscribed');
          }}
          width={155}
        />
        <Item
          label={t('library.100%_commission')}
          icon={faBalanceScaleLeft}
          transform="grow-2"
          active={validatorFilters?.includes('all_commission') ?? false}
          onClick={() => {
            handleFilter(toggleFilterValidators, 'all_commission');
          }}
          width={170}
        />
        <Item
          label={t('library.blocked_nominations')}
          icon={faUserSlash}
          transform="grow-1"
          active={validatorFilters?.includes('blocked_nominations') ?? false}
          onClick={() => {
            handleFilter(toggleFilterValidators, 'blocked_nominations');
          }}
          width={190}
        />
        <Item
          label={t('library.missing_identity')}
          icon={faUserTag}
          transform="grow-2"
          active={validatorFilters?.includes('missing_identity') ?? false}
          onClick={() => {
            handleFilter(toggleFilterValidators, 'missing_identity');
          }}
          width={160}
        />
      </Category>
    </Container>
  );
};

export default Filters;
