// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useApi } from 'contexts/Api';
import { useTheme } from 'contexts/Themes';
import { useCombobox, UseComboboxStateChange } from 'downshift';
import Identicon from 'library/Identicon';
import { StatusLabel } from 'library/StatusLabel';
import { useEffect, useState } from 'react';
import { defaultThemes, networkColors } from 'theme/default';
import { clipAddress, convertRemToPixels } from 'Utils';
import { AccountSelectProps, InputItem } from '../types';
import { StyledController, StyledDownshift, StyledSelect } from './Wrappers';

export const AccountSelect = ({
  items,
  onChange,
  placeholder,
  value,
}: AccountSelectProps) => {
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
              onClick={() => c.reset()}
              aria-label="clear selection"
            >
              <FontAwesomeIcon transform="grow-4" icon={faTimes} />
            </StyledController>
          )}
          <StyledSelect {...c.getMenuProps()}>
            {inputItems.map((item: InputItem, index: number) => (
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
  const { network } = useApi();
  const { mode } = useTheme();

  // disable item in list if account doesn't satisfy controller budget.
  const itemProps = item.active ? c.getItemProps({ index, item }) : {};

  const color =
    c.selectedItem?.address === item?.address
      ? networkColors[`${network.name}-${mode}`]
      : defaultThemes.text.primary[mode];

  const border =
    c.selectedItem?.address === item?.address
      ? `2px solid ${networkColors[`${network.name}-${mode}`]}`
      : `2px solid ${defaultThemes.transparent[mode]}`;

  const opacity = item.active ? 1 : 0.1;

  return (
    <div className="wrapper" key={item.name} {...itemProps}>
      {!item.active && (
        <StatusLabel
          status="not_enough_unit"
          title={item.alert}
          topOffset="40%"
          helpKey="Controller Account Eligibility"
          hideIcon
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
