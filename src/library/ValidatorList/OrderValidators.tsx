// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faCheckCircle, faCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFilters } from 'contexts/Filters';
import { Title } from 'library/Overlay/Title';
import { FilterListButton, FilterListWrapper } from 'library/Overlay/Wrappers';

export const OrderValidators = () => {
  const { getOrder, setOrder } = useFilters();

  const order = getOrder('validators');

  const ordersToLabels = {
    default: 'Default',
    low_commission: 'Low Commission',
  };

  return (
    <FilterListWrapper>
      <Title title="Order Validators" />
      <div className="body">
        {Object.entries(ordersToLabels).map(([o, l]: any, i: number) => (
          <FilterListButton
            active={order === o ?? false}
            key={`validator_filter_${i}`}
            type="button"
            onClick={() => {
              setOrder('validators', o);
            }}
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
