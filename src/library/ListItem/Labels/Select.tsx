// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTheme } from 'contexts/Themes';
import { SelectWrapper } from 'library/ListItem/Wrappers';
import { defaultThemes } from 'theme/default';
import { useList } from '../../List/context';
import { SelectProps } from '../types';

export const Select = ({ item }: SelectProps) => {
  const { mode } = useTheme();
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
          icon={faCheck}
          transform="shrink-2"
          color={defaultThemes.text.primary[mode]}
        />
      )}
    </SelectWrapper>
  );
};
