// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useCombobox } from 'downshift';
import Identicon from 'library/Identicon';
import { clipAddress, convertRemToPixels } from 'Utils';
import { useTheme } from 'contexts/Themes';
import { defaultThemes } from 'theme/default';
import { StatusLabel } from 'library/StatusLabel';
import { StyledDownshift, StyledSelect, StyledController } from './Wrappers';

export const AccountSelect = (props: any) => {
  const { items, onChange, placeholder, value }: any = props;

  const [inputItems, setInputItems] = useState(items);

  useEffect(() => {
    setInputItems(items);
  }, [items]);

  const itemToString = (item: any) => (item ? item.name : '');

  const c: any = useCombobox({
    items: inputItems,
    itemToString,
    onSelectedItemChange: onChange,
    initialSelectedItem: value,
    onInputValueChange: ({ inputValue }: any) => {
      setInputItems(
        items.filter((item: any) =>
          item.name.toLowerCase().startsWith(inputValue.toLowerCase())
        )
      );
    },
  });

  return (
    <StyledDownshift>
      <div>
        <div style={{ position: 'relative' }}>
          <div className="input-wrap" {...c.getComboboxProps()}>
            {value !== null && (
              <Identicon
                value={value?.address ?? ''}
                size={convertRemToPixels('2rem')}
              />
            )}
            <input {...c.getInputProps({ placeholder })} className="input" />
          </div>

          {c.selectedItem && (
            <StyledController
              onClick={() => c.selectItem(null)}
              aria-label="clear selection"
            >
              <FontAwesomeIcon transform="grow-2" icon={faTimes} />
            </StyledController>
          )}
          <StyledSelect {...c.getMenuProps()}>
            {inputItems.map((item: any, index: number) => (
              <DropdownItem
                key={`controller_acc_${index}`}
                c={c}
                item={item}
                index={index}
              />
            ))}
          </StyledSelect>
        </div>
      </div>
    </StyledDownshift>
  );
};

const DropdownItem = ({ c, item, index }: any) => {
  const { mode } = useTheme();

  // disable item in list if account doesn't satisfy controller budget.
  const itemProps = item.active ? c.getItemProps({ index, item }) : {};

  const color =
    c.selectedItem?.address === item?.address
      ? defaultThemes.primary[mode]
      : defaultThemes.text.primary[mode];

  const border =
    c.selectedItem?.address === item?.address
      ? `2px solid ${defaultThemes.primary[mode]}`
      : `2px solid ${defaultThemes.transparent[mode]}`;

  const opacity = item.active ? 1 : 0.1;

  return (
    <div className="wrapper" key={item.name} {...itemProps}>
      {!item.active && (
        <StatusLabel
          status="sync_or_setup"
          title={item.alert}
          topOffset="40%"
        />
      )}
      <div
        className="item"
        style={{
          color,
          border,
          opacity,
        }}
      >
        <div className="icon">
          <Identicon value={item.address} size={40} />
        </div>
        <div className="title">
          <h3 style={{ color }}>{item.name}</h3>
        </div>
        <p>{clipAddress(item.address)}</p>
      </div>
    </div>
  );
};

export default AccountSelect;
