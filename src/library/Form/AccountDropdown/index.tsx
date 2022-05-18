// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useCombobox } from 'downshift';
import { StyledDownshift, StyledDropdown, StyledController } from './Wrappers';
import Identicon from '../../Identicon';
import { useTheme } from '../../../contexts/Themes';
import { defaultThemes } from '../../../theme/default';
import { convertRemToPixels } from '../../../Utils';

export const AccountDropdown = (props: any) => {
  const { items, onChange, label, placeholder, value }: any = props;

  const itemToString = (item: any) => (item ? item.meta.name : '');

  const [inputItems, setInputItems] = useState(items);

  const c: any = useCombobox({
    items: inputItems,
    itemToString,
    onSelectedItemChange: onChange,
    initialSelectedItem: value,
    onInputValueChange: ({ inputValue }: any) => {
      setInputItems(
        items.filter((item: any) =>
          item.meta.name.toLowerCase().startsWith(inputValue.toLowerCase())
        )
      );
    },
  });

  return (
    <StyledDownshift>
      <div>
        {label && (
          <div className="label" {...c.getLabelProps()}>
            {label}
          </div>
        )}
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
          <StyledDropdown {...c.getMenuProps()}>
            {inputItems.map((item: any, index: number) => (
              <DropdownItem
                key={`controller_acc_${index}`}
                c={c}
                item={item}
                index={index}
              />
            ))}
          </StyledDropdown>
        </div>
      </div>
    </StyledDownshift>
  );
};

const DropdownItem = ({ c, item, index }: any) => {
  const { mode } = useTheme();
  const color =
    c.selectedItem === item
      ? defaultThemes.primary[mode]
      : defaultThemes.text.primary[mode];
  const border =
    c.selectedItem === item
      ? `2px solid ${defaultThemes.primary[mode]}`
      : `2px solid ${defaultThemes.transparent[mode]}`;

  return (
    <div
      className="item"
      {...c.getItemProps({ key: item.meta.name, index, item })}
      style={{
        color,
        border,
      }}
    >
      <div className="icon">
        <Identicon value={item.address} size={26} />
      </div>
      <p>{item.meta.name}</p>
    </div>
  );
};

export default AccountDropdown;
