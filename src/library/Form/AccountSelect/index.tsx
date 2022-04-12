// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import Downshift from 'downshift';
import { StyledDownshift, StyledSelect, StyledController } from './Wrappers';
import Identicon from '@polkadot/react-identicon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { clipAddress, convertRemToPixels } from '../../../Utils';

export const AccountSelect = (props: any) => {

  const { items, onChange, placeholder, value }: any = props;

  const DropdownItem = (c: any, item: any, index: number) => {

    const color = c.selectedItem === item ? 'rgb(211, 48, 121)' : 'black';
    const border = c.selectedItem === item ? '1px solid rgb(211, 48, 121)' : '1px solid rgba(0,0,0,0)';

    return (
      <div
        className="item"
        {...c.getItemProps({ key: item.name, index, item })}
        style={{
          color: color,
          border: border,
        }}>
        <div className='icon'>
          <Identicon
            value={item.address}
            size={40}
            theme="polkadot"
            style={{ cursor: 'default' }}
          />
        </div>
        <h3 style={{ color: color }}>{item.name}</h3>
        <p>{clipAddress(item.address)}</p>
      </div>
    )
  }

  return (
    <StyledDownshift>
      <Downshift onChange={onChange} itemToString={items => (items ? items.name : '')} initialSelectedItem={value}>
        {(c: any) => (
          <div>
            <div style={{ position: 'relative' }}>
              <div className='input-wrap'>
                {value !== null &&
                  <Identicon
                    value={value?.address ?? ''}
                    size={convertRemToPixels('2rem')}
                    theme="polkadot"
                    style={{ cursor: 'default' }}
                  />
                }
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
              <StyledSelect>
                <div className='items'>
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
                </div>
              </StyledSelect>
            </div>
          </div>
        )}
      </Downshift>
    </StyledDownshift >
  )
}

export default AccountSelect;