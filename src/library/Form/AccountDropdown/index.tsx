// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faAnglesRight } from '@fortawesome/free-solid-svg-icons';
import { useCombobox } from 'downshift';
import { useTheme } from 'contexts/Themes';
import { defaultThemes } from 'theme/default';
import { convertRemToPixels } from 'Utils';
import Identicon from 'library/Identicon';
import { StyledDownshift, StyledDropdown, StyledController } from './Wrappers';

export const AccountDropdown = (props: any) => {
  const { items, onChange, placeholder, value, current, height }: any = props;

  const itemToString = (item: any) => (item ? item.name : '');

  // store input items
  const [inputItems, setInputItems] = useState(items);

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
                  onClick={() => c.selectItem(null)}
                  aria-label="clear selection"
                >
                  <FontAwesomeIcon transform="grow-2" icon={faTimes} />
                </StyledController>
              )}

              {inputItems.map((item: any, index: number) => (
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
  const { mode } = useTheme();

  let color;
  let border;

  if (c.selectedItem === item) {
    color = defaultThemes.primary[mode];
    border = `2px solid ${defaultThemes.primary[mode]}`;
  } else {
    color = defaultThemes.text.primary[mode];
    border = `2px solid ${defaultThemes.transparent[mode]}`;
  }

  return (
    <div
      className="item"
      {...c.getItemProps({ key: item.name, index, item })}
      style={{ color, border }}
    >
      <div className="icon">
        <Identicon value={item.address} size={26} />
      </div>
      <p>{item.name}</p>
    </div>
  );
};

export default AccountDropdown;
