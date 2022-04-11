// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import Downshift from 'downshift';
import { StyledDownshift, StyledDropdown, StyledController } from './Wrappers';
import Identicon from '@polkadot/react-identicon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { useConnect } from '../../contexts/Connect';

export const Dropdown = (props: any) => {

  // TODO: replace with accounts from items
  const { activeAccount } = useConnect();

  const { items, onChange, label, placeholder }: any = props;

  return (
    <StyledDownshift>
      <Downshift onChange={onChange} itemToString={items => (items ? items.name : '')}>
        {({ getInputProps, getItemProps, isOpen, inputValue, highlightedIndex, selectedItem, getLabelProps, getToggleButtonProps, clearSelection }) => (
          <div style={{ position: 'relative' }}>

            {/* add a label tag and pass our label text to the getLabelProps function */}
            <label className='label' {...getLabelProps()}>
              {label}
            </label>
            {
              /* add our input element and pass our placeholder to the getInputProps function */}
            <input {...getInputProps({ placeholder: placeholder })} className='input' />

            {selectedItem ? (
              <StyledController
                onClick={clearSelection}
                aria-label="clear selection"
              >
                <FontAwesomeIcon transform='grow-2' icon={faTimes} />
              </StyledController>
            ) : (
              <StyledController {...getToggleButtonProps()}>
                {isOpen
                  ? (<FontAwesomeIcon transform='grow-4' icon={faAngleUp} />)
                  : (<FontAwesomeIcon transform='grow-4' icon={faAngleDown} />)
                }
              </StyledController>
            )}

            {/* if the input element is open, render the div else render nothing */}
            {isOpen ? (
              <StyledDropdown>
                {
                  items
                    .filter((item: any) => !inputValue || item.name
                      .toLowerCase()
                      .includes(inputValue.toLowerCase()))
                    .map((item: any, index: number) => {

                      return (
                        <div
                          className="item"
                          {...getItemProps({ key: item.name, index, item })}
                          style={{
                            backgroundColor: highlightedIndex === index ? '#fafafa' : 'white',
                            color: selectedItem === item ? 'rgb(211, 48, 121)' : 'black',
                          }}>
                          <div className='icon'>
                            <Identicon
                              value={activeAccount}
                              size={26}
                              theme="polkadot"
                              style={{ cursor: 'default' }}
                            />
                          </div>
                          {item.name}
                        </div>
                      );
                    })
                }
              </StyledDropdown>
            ) : null}
          </div>
        )}
      </Downshift>
    </StyledDownshift>
  )
}

export default Dropdown;