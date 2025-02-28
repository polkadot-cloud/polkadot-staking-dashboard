// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { FormEvent } from 'react';
import { SearchInputWrapper } from '.';
import type { SearchInputProps } from './types';

export const SearchInput = ({
  handleChange,
  placeholder,
}: SearchInputProps) => (
  <SearchInputWrapper>
    <input
      type="text"
      className="search"
      placeholder={placeholder}
      onChange={(e: FormEvent<HTMLInputElement>) => handleChange(e)}
    />
  </SearchInputWrapper>
);
