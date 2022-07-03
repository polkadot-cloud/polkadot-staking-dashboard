// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faAnglesRight } from '@fortawesome/free-solid-svg-icons';
import { useCombobox, UseComboboxStateChange } from 'downshift';
import { useTheme } from 'contexts/Themes';
import { defaultThemes, networkColors } from 'theme/default';
import { convertRemToPixels } from 'Utils';
import Identicon from 'library/Identicon';
import { useApi } from 'contexts/Api';
import { APIContextInterface } from 'types/api';
import { StyledDownshift, StyledDropdown, StyledController } from './Wrappers';
import { AccountDropdownProps, InputItem } from '../types';

export const AccountDropdown = (props: AccountDropdownProps) => {
  const { items, onChange, placeholder, value, current, height } = props;

  useEffect(() => {
    setInputItems(items);
  }, [items]);

  const itemToString = (item: InputItem) => {
    const name = item?.name ?? '';
    return name;
  };

  // store input items
  const [inputItems, setInputItems] = useState<Array<InputItem>>(items);
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
        <div className="label" {...c.getLabelProps()}>
          Currently Selected:
        </div>
        <div>
          <div className="current">
            <div className="input-wrap selected">
              {current !== null && (
                <Identicon
                  value={current?.address ?? ''}
                  size={convertRemToPixels('2rem')}
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
                  size={convertRemToPixels('2rem')}
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
                  aria-label="clear selection"
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
  const { network } = useApi();
  const { mode } = useTheme();

  let color;
  let border;

  if (c.selectedItem === item) {
    color = networkColors[`${network.name}-${mode}`];
    border = `2px solid ${networkColors[`${network.name}-${mode}`]}`;
  } else {
    color = defaultThemes.text.primary[mode];
    border = `2px solid ${defaultThemes.transparent[mode]}`;
  }

  // disable item in list if account doesn't satisfy controller budget.
  const itemProps = item.active
    ? c.getItemProps({ key: item.name, index, item })
    : {};
  const opacity = item.active ? 1 : 0.5;
  const cursor = item.active ? 'pointer' : 'default';

  return (
    <div
      className="item"
      {...itemProps}
      style={{ color, border, opacity, cursor }}
    >
      <div className="icon">
        <Identicon value={item.address} size={26} />
      </div>
      {!item.active && <span>Not Enough {network.unit}</span>}
      <p>{item.name}</p>
    </div>
  );
};

export default AccountDropdown;
