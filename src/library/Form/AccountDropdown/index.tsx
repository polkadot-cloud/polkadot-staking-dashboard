// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faAnglesRight, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useApi } from 'contexts/Api';
import { useCombobox, UseComboboxStateChange } from 'downshift';
import { Identicon } from 'library/Identicon';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { remToUnit } from 'Utils';
import { AccountDropdownProps, InputItem } from '../types';
import { StyledController, StyledDownshift, StyledDropdown } from './Wrappers';

export const AccountDropdown = ({
  items,
  onChange,
  placeholder,
  value,
  current,
  height,
}: AccountDropdownProps) => {
  const { t } = useTranslation('library');

  // store input items
  const [inputItems, setInputItems] = useState<Array<InputItem>>(items);

  useEffect(() => {
    setInputItems(items);
  }, [items]);

  const itemToString = (item: InputItem) => {
    const name = item?.name ?? '';
    return name;
  };

  const c = useCombobox({
    items: inputItems,
    itemToString,
    onSelectedItemChange: onChange,
    initialSelectedItem: value,
    onInputValueChange: ({ inputValue }: UseComboboxStateChange<InputItem>) => {
      setInputItems(
        items.filter((item: InputItem) =>
          inputValue
            ? item?.name?.toLowerCase().startsWith(inputValue?.toLowerCase())
            : true
        )
      );
    },
  });

  return (
    <StyledDownshift>
      <div>
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
              {value !== null && (
                <Identicon
                  value={value?.address ?? ''}
                  size={remToUnit('2rem')}
                />
              )}
              <input className="input" disabled value={value?.name ?? '...'} />
            </div>
          </div>

          <StyledDropdown {...c.getMenuProps()} height={height}>
            <div className="input-wrap" {...c.getComboboxProps()}>
              <input {...c.getInputProps({ placeholder })} className="input" />
            </div>

            <div className="items">
              {c.selectedItem && (
                <StyledController
                  onClick={() => c.reset()}
                  aria-label={t('clearSelection')}
                >
                  <FontAwesomeIcon transform="grow-2" icon={faTimes} />
                </StyledController>
              )}

              {inputItems.map((item: InputItem, index: number) => (
                <DropdownItem
                  key={`controller_acc_${index}`}
                  c={c}
                  item={item}
                  index={index}
                />
              ))}
            </div>
          </StyledDropdown>
        </div>
      </div>
    </StyledDownshift>
  );
};

const DropdownItem = ({ c, item, index }: any) => {
  const { t } = useTranslation('library');
  const { unit } = useApi().network;
  return (
    <div
      className={`item${c.selectedItem === item ? ' selected' : ''}${
        item.active ? '' : ' inactive'
      }`}
      {...(item.active ? c.getItemProps({ key: item.name, index, item }) : {})}
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
    </div>
  );
};
