// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useCombobox } from 'downshift';
import { StyledDownshift, StyledDropdown, StyledController } from '../AccountDropdown/Wrappers';
import { useTheme } from '../../../contexts/Themes';
import { defaultThemes } from '../../../theme/default';

export const Dropdown = (props: any) => {
  const {
    items, onChange, label, placeholder, value,
  }: any = props;

  const [inputItems, setInputItems] = useState(items);

  const itemToString = (item: any) => item?.name ?? '';

  const c: any = useCombobox({
    items: inputItems,
    itemToString,
    onSelectedItemChange: onChange,
    initialSelectedItem: value,
    onInputValueChange: ({ inputValue }: any) => {
      setInputItems(items);
    },
  });

  return (
    <StyledDownshift>
      <div>
        {label && (
        <label className="label" {...c.getLabelProps()}>
          {label}
        </label>
        )}
        <div style={{ position: 'relative' }}>
          <div className="input-wrap" {...c.getComboboxProps()}>
            <input {...c.getInputProps({ placeholder })} className="input" disabled />
          </div>
          <StyledDropdown {...c.getMenuProps()}>
            {
              inputItems
                .map((item: any, index: number) => <DropdownItem key={`controller_acc_${index}`} c={c} item={item} index={index} />)
            }
          </StyledDropdown>
        </div>
      </div>
    </StyledDownshift>
  );
};

const DropdownItem = ({ c, item, index }: any) => {
  const { mode } = useTheme();
  const color = c.selectedItem?.key === item.key ? defaultThemes.primary[mode] : defaultThemes.text.primary[mode];
  const border = c.selectedItem?.key === item.key ? `2px solid ${defaultThemes.primary[mode]}` : `2px solid ${defaultThemes.transparent[mode]}`;

  return (
    <div
      className="item"
      {...c.getItemProps({ key: item.name, index, item })}
      style={{
        color,
        border,
      }}
    >
      <p>{item.name}</p>
    </div>
  );
};

export default Dropdown;
