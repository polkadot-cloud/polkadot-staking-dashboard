// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faAnglesRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useApi } from 'contexts/Api';
import { useTheme } from 'contexts/Themes';
import { useCombobox } from 'downshift';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { defaultThemes, networkColors } from 'theme/default';
import { StyledDownshift, StyledDropdown } from '../AccountDropdown/Wrappers';
import { DropdownInput, DropdownProps } from '../types';

export const Dropdown = ({
  items,
  onChange,
  label,
  placeholder,
  value,
  current,
}: DropdownProps) => {
  const [inputItems, setInputItems] = useState<Array<DropdownInput>>(items);

  const itemToString = (item: DropdownInput | null) => item?.name ?? '';

  const c = useCombobox({
    items: inputItems,
    itemToString,
    onSelectedItemChange: onChange,
    initialSelectedItem: value,
    onInputValueChange: () => {
      setInputItems(items);
    },
  });

  const { t } = useTranslation('common');
  const cname = current?.name;
  const vname = value?.name;

  return (
    <StyledDownshift>
      <div>
        {label ? (
          <div className="label" {...c.getLabelProps()}>
            {label}
          </div>
        ) : null}
        <div style={{ position: 'relative' }}>
          <div className="current">
            <div className="input-wrap selected">
              <input className="input" disabled value={t(`${cname}`) ?? ''} />
            </div>
            <span>
              <FontAwesomeIcon icon={faAnglesRight} />
            </span>
            <div className="input-wrap selected" {...c.getComboboxProps()}>
              <input
                className="input"
                disabled
                {...c.getInputProps({ placeholder })}
                value={t(`${vname}`) ?? '...'}
              />
            </div>
          </div>

          <StyledDropdown {...c.getMenuProps()}>
            <div className="items">
              {inputItems.map((item: DropdownInput, index: number) => (
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
  const { name } = useApi().network;
  const { mode } = useTheme();
  const color =
    c.selectedItem?.key === item.key
      ? networkColors[`${name}-${mode}`]
      : defaultThemes.text.primary[mode];
  const border =
    c.selectedItem?.key === item.key
      ? `2px solid ${networkColors[`${name}-${mode}`]}`
      : `2px solid ${defaultThemes.transparent[mode]}`;

  const { t } = useTranslation('common');
  const iname = item.name;
  return (
    <div
      className="item"
      {...c.getItemProps({ key: t(`${iname}`), index, item })}
      style={{
        color,
        border,
      }}
    >
      <p>{t(`${iname}`)}</p>
    </div>
  );
};

export default Dropdown;
