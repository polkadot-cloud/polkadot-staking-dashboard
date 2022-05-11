// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import Downshift from 'downshift';
import { StyledDownshift, StyledDropdown, StyledController } from '../AccountDropdown/Wrappers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../../../contexts/Themes'
import { defaultThemes } from '../../../theme/default';

export const Dropdown = (props: any) => {

  const { mode } = useTheme();
  const { items, onChange, label, placeholder, value }: any = props;

  const DropdownItem = (c: any, item: any, index: number) => {

    const color = c.selectedItem?.key === item.key ? defaultThemes.primary[mode] : defaultThemes.text.primary[mode];
    const border = c.selectedItem?.key === item.key ? `2px solid ${defaultThemes.primary[mode]}` : `2px solid ${defaultThemes.transparent[mode]}`;

    return (
      <div
        key={index}
        className="item"
        {...c.getItemProps({ key: item.name, index, item })}
        style={{
          color: color,
          border: border,
        }}>
        <p>{item.name}</p>
      </div>
    )
  }

  return (
    <StyledDownshift>
      <Downshift onChange={onChange} itemToString={items => (items ? items.name : '')} initialSelectedItem={value}>
        {(c: any) => (
          <div>
            {label && <label className='label' {...c.getLabelProps()}>
              {label}
            </label>
            }
            <div style={{ position: 'relative' }}>
              <div className='input-wrap'>
                <input {...c.getInputProps({ placeholder: placeholder })} className='input' />
              </div>

              {c.selectedItem && (
                <StyledController
                  onClick={c.clearSelection}
                  aria-label="clear selection"
                >
                  <FontAwesomeIcon transform='grow-2' icon={faTimes} />
                </StyledController>
              )}
              <StyledDropdown>
                {
                  c?.inputValue === value?.name
                    ?
                    items
                      .map((item: any, index: number) => {
                        return (DropdownItem(c, item, index));
                      })
                    :
                    items
                      .filter((item: any) => !c.inputValue || item.name
                        .toLowerCase()
                        .includes(c.inputValue.toLowerCase()))
                      .map((item: any, index: number) => {
                        return (DropdownItem(c, item, index));
                      })
                }
              </StyledDropdown>
            </div>
          </div>
        )}
      </Downshift>
    </StyledDownshift>
  )
}

export default Dropdown;