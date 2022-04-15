// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import Downshift from 'downshift';
import { StyledDownshift, StyledDropdown, StyledController } from './Wrappers';
import Identicon from '../../Identicon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

export const AccountDropdown = (props: any) => {

  const { items, onChange, label, placeholder, value, height }: any = props;

  const DropdownItem = (c: any, item: any, index: number) => {

    return (
      <div
        className="item"
        {...c.getItemProps({ key: item.name, index, item })}
        style={{
          color: c.selectedItem === item ? 'rgb(211, 48, 121)' : 'black',
        }}>
        <div className='icon'>
          <Identicon
            value={item.address}
            size={26}
          />
        </div>
        {item.name}
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
              <input {...c.getInputProps({ placeholder: placeholder })} className='input' />

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

export default AccountDropdown;