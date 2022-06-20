// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import Button from 'library/Button';
import { Wrapper } from './Wrapper';

export const ReadOnlyInput = (props: any) => {
  const [value, setValue] = useState('');

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const newValue = e.currentTarget.value;
    setValue(newValue);
  };

  // TODO: validate address and update disabled

  return (
    <Wrapper>
      <h5>Input Address</h5>
      <div className="input">
        <section>
          <input
            placeholder="Address"
            type="text"
            onChange={(e: React.FormEvent<HTMLInputElement>) => handleChange(e)}
            value={value}
          />
        </section>
        <section>
          <Button inline onClick={() => {}} title="Import" disabled />
        </section>
      </div>
    </Wrapper>
  );
};

export default ReadOnlyInput;
