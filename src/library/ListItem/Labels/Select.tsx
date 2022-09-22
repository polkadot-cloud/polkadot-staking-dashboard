// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { defaultThemes } from 'theme/default';
import { useTheme } from 'styled-components';
import { SelectWrapper } from 'library/ListItem/Wrappers';
import { useList } from '../../List/context';
import { SelectProps } from '../types';

export const Select = (props: SelectProps) => {
  const { item } = props;

  const { mode }: any = useTheme();
  const { addToSelected, removeFromSelected, selected } = useList();

  const isSelected = selected.includes(item);

  return (
    <SelectWrapper
      onClick={() => {
        if (isSelected) {
          removeFromSelected([item]);
        } else {
          addToSelected(item);
        }
      }}
    >
      {isSelected && (
        <FontAwesomeIcon
          icon={faCheck as IconProp}
          transform="shrink-2"
          color={defaultThemes.text.primary[mode]}
        />
      )}
    </SelectWrapper>
  );
};

export default Select;
