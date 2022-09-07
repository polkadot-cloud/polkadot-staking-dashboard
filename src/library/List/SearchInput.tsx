// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

export const SearchInput = (props: any) => {
  const { handleChange, placeholder } = props;

  return (
    <div className="search">
      <input
        type="text"
        className="search"
        placeholder={placeholder}
        onChange={(e: React.FormEvent<HTMLInputElement>) => handleChange(e)}
      />
    </div>
  );
};
