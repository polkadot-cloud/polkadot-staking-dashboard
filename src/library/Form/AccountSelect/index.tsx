// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import Downshift from 'downshift';
import { StyledDownshift, StyledSelect, StyledController } from './Wrappers';
import Identicon from '../../Identicon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { clipAddress, convertRemToPixels } from '../../../Utils';
import { useTheme } from '../../../contexts/Themes';
import { defaultThemes } from '../../../theme/default';

export const AccountSelect = (props: any) => {
  const { mode } = useTheme();

  const { items, onChange, placeholder, value }: any = props;

  const DropdownItem = (c: any, item: any, index: number) => {

    // disable item in list if account doesn't satisfy controller budget.
    let itemProps = item.active
      ? c.getItemProps({ index, item })
      : {};

    const color = c.selectedItem.address === item.address
      ? defaultThemes.primary[mode]
      : defaultThemes.text.primary[mode];

    const border = c.selectedItem.address === item.address
      ? `2px solid ${defaultThemes.primary[mode]}`
      : `2px solid ${defaultThemes.transparent[mode]}`;

    const opacity = item.active ? 1 : 0.25;

    return (
      <div
        className="item"
        key={item.name}
        {...itemProps}
        style={{
          color,
          border,
          opacity
        }}>
        <div className='icon'>
          <Identicon
            value={item.address}
            size={40}
          />
        </div>
        <h3 style={{ color: color }}>{item.name}</h3>
        <p>{clipAddress(item.address)}</p>
      </div>
    )
  }

  return (
    <StyledDownshift>
      <Downshift
        onChange={onChange}
        itemToString={items => (items ? items.name : '')}
        initialSelectedItem={value}
      >
        {(c: any) => (
          <div>
            <div style={{ position: 'relative' }}>
              <div className='input-wrap'>
                {value !== null &&
                  <Identicon
                    value={value?.address ?? ''}
                    size={convertRemToPixels('2rem')}
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
              </StyledSelect>
            </div>
          </div>
        )}
      </Downshift>
    </StyledDownshift>
  )
}

export default AccountSelect;