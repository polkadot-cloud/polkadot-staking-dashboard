// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faAnglesRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { remToUnit } from '@polkadotcloud/utils';
import { useApi } from 'contexts/Api';
import { Identicon } from 'library/Identicon';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { AccountDropdownProps, InputItem } from '../types';
import { StyledDropdown, StyledSelect } from './Wrappers';

export const AccountDropdown = ({
  items,
  onChange,
  selected,
  current,
  height,
}: AccountDropdownProps) => {
  // store input items
  const [inputItems, setInputItems] = useState<Array<InputItem>>(items);

  useEffect(() => {
    setInputItems(items);
  }, [items]);

  return (
    <StyledSelect>
      <div>
        <div className="current">
          <div className="input-wrap selected">
            {current !== null && (
              <Identicon
                value={current?.address ?? ''}
                size={remToUnit('2rem')}
              />
            )}
            <input className="input" disabled value={current?.name ?? ''} />
          </div>
          <span>
            <FontAwesomeIcon icon={faAnglesRight} />
          </span>
          <div className="input-wrap selected">
            {selected?.active ? (
              <Identicon
                value={selected?.address ?? ''}
                size={remToUnit('2rem')}
              />
            ) : undefined}
            <input
              className="input"
              disabled
              value={selected?.active ? selected?.name : '...'}
            />
          </div>
        </div>
        <StyledDropdown height={height}>
          <div className="items">
            {inputItems.map((item: InputItem, index: number) => (
              <DropdownItem
                key={`controller_acc_${index}`}
                item={item}
                onChange={onChange}
                selected={item === selected}
              />
            ))}
          </div>
        </StyledDropdown>
      </div>
    </StyledSelect>
  );
};

const DropdownItem = ({ item, onChange, selected }: any) => {
  const { t } = useTranslation('library');
  const { unit } = useApi().network;
  return (
    <button
      className={`${selected ? 'selected' : undefined} ${
        !item.active ? ' inactive' : ''
      }`}
      type="button"
      onClick={() => onChange(item)}
      disabled={!item.active}
    >
      <div className="icon">
        <Identicon value={item.address} size={26} />
      </div>
      {!item.active && (
        <span>
          {t('notEnough')} {unit}
        </span>
      )}
      <p>{item.name}</p>
    </button>
  );
};
