// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BigNumber from 'bignumber.js';
import { useEffect, useState } from 'react';
import type { MinDelayProps } from './types';

export const MinDelayInput = ({
  initial,
  field,
  label,
  handleChange,
}: MinDelayProps) => {
  const [current, setCurrent] = useState<number>(initial);

  useEffect(() => {
    setCurrent(initial);
  }, [initial]);

  const onChange = (value: string) => {
    if (!new BigNumber(value).isNaN() || value === '') {
      const newValue = new BigNumber(value || 0).toNumber();
      setCurrent(newValue);
      handleChange(field, newValue);
    }
  };

  return (
    <section>
      <input
        type="text"
        placeholder="0"
        value={current}
        onChange={({ target: { value } }) => onChange(value)}
      />
      {label}
    </section>
  );
};
