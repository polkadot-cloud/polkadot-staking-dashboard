// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SelectWrapper } from 'library/ListItem/Wrappers';
import { useList } from '../../List/context';
import type { SelectProps } from '../types';

export const Select = ({ item }: SelectProps) => {
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
      {isSelected && <FontAwesomeIcon icon={faCheck} transform="shrink-2" />}
    </SelectWrapper>
  );
};
