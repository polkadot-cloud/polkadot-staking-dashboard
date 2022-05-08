// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import Downshift from 'downshift';
import { StyledDownshift, StyledDropdown, StyledController } from './Wrappers';
import Identicon from '../../Identicon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../../../contexts/Themes'
import { defaultThemes } from '../../../theme/default';
import { convertRemToPixels } from '../../../Utils';

export const AccountDropdown = (props: any) => {

  const { items, onChange, label, placeholder, value }: any = props;

  return (
    <StyledDownshift>
      <Downshift
        onChange={onChange}
        itemToString={items => (items ? items.name : '')}
        selectedItem={value}
        initialSelectedItem={value}
      >
        {(c: any) => (
          <div>
            {label && <label className='label' {...c.getLabelProps()}>
              {label}
            </label>
            }
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
              <StyledDropdown>
                {
                  c?.inputValue === value?.name
                    ?
                    items
                      .map((item: any, index: number) =>
                        <DropdownItem key={`controller_acc_${index}`} c={c} item={item} index={index} />
                      )
                    :
                    items
                      .filter((item: any) => !c.inputValue || item.name
                        .toLowerCase()
                        .includes(c.inputValue.toLowerCase()))
                      .map((item: any, index: number) =>
                        <DropdownItem key={`controller_acc_${index}`} c={c} item={item} index={index} />
                      )
                }
              </StyledDropdown>
            </div>
          </div>
        )}
      </Downshift>
    </StyledDownshift>
  )
}


const DropdownItem = ({ c, item, index }: any) => {

  const { mode } = useTheme();

  const color = c.selectedItem === item ? defaultThemes.primary[mode] : defaultThemes.text.primary[mode];
  const border = c.selectedItem === item ? `2px solid ${defaultThemes.primary[mode]}` : `2px solid ${defaultThemes.transparent[mode]}`;

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
          size={26}
        />
      </div>
      <p>{item.name}</p>
    </div>
  )
}

export default AccountDropdown;