// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCheckCircle, faCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';
import { Title } from 'library/Prompt/Title';
import { FilterListButton, FilterListWrapper } from 'library/Prompt/Wrappers';
import { useFilters } from 'contexts/Filters';
import { useValidatorFilters } from '../Hooks/useValidatorFilters';

export const OrderValidators = () => {
  const { t } = useTranslation('library');
  const { getOrder, setOrder } = useFilters();
  const { ordersToLabels } = useValidatorFilters();

  const order = getOrder('validators');

  return (
    <FilterListWrapper>
      <Title title={t('orderValidators')} />
      <div className="body">
        {Object.entries(ordersToLabels).map(([o, l], i: number) => (
          <FilterListButton
            $active={order === o || false}
            key={`validator_filter_${i}`}
            type="button"
            onClick={() => setOrder('validators', o)}
          >
            <FontAwesomeIcon
              transform="grow-5"
              icon={order === o ? faCheckCircle : faCircle}
            />
            <h4>{l}</h4>
          </FilterListButton>
        ))}
      </div>
    </FilterListWrapper>
  );
};
