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
import { StatusLabel } from '../../StatusLabel';

export const AccountSelect = (props: any) => {

  const { items, onChange, placeholder, value }: any = props;

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
                  items
                    .map((item: any, index: number) =>
                      <DropdownItem key={`controller_acc_${index}`} c={c} item={item} index={index} />
                    )
                }
              </StyledSelect>
            </div>
          </div>
        )}
      </Downshift>
    </StyledDownshift>
  )
}

const DropdownItem = ({ c, item, index }: any) => {

  const { mode } = useTheme();

  // disable item in list if account doesn't satisfy controller budget.
  let itemProps = item.active
    ? c.getItemProps({ index, item })
    : {};

  const color = c.selectedItem?.address === item?.address
    ? defaultThemes.primary[mode]
    : defaultThemes.text.primary[mode];

  const border = c.selectedItem?.address === item?.address
    ? `2px solid ${defaultThemes.primary[mode]}`
    : `2px solid ${defaultThemes.transparent[mode]}`;

  const opacity = item.active ? 1 : 0.1;

  return (
    <div
      className='wrapper'
      key={item.name}
      {...itemProps}
    >
      {!item.active && <StatusLabel title={item.alert} topOffset='40%' />}
      <div
        className="item"
        style={{
          color,
          border,
          opacity,
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
    </div>
  )
}

export default AccountSelect;