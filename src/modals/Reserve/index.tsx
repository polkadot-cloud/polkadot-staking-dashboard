// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Title } from 'library/Modal/Title';
import type { ChangeEvent } from 'react';
import { useState } from 'react';
import { SliderWrapper } from './Wrapper';

export const UpdateReserve = () => {
  // TODO: set to current reserve value
  const [reserve, setReserve] = useState(0);

  const updateReserve = (e: ChangeEvent<HTMLInputElement>) => {
    setReserve(Number(e.currentTarget.value));
  };
  return (
    <>
      <Title title="Update Reserve" />
      <SliderWrapper>
        <input
          className="slider"
          type="range"
          min="1"
          max="100"
          onChange={updateReserve}
        />
        <p>Reserve: {reserve}</p>
      </SliderWrapper>
    </>
  );
};
