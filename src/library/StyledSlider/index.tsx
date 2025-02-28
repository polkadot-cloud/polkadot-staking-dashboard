// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import Slider from 'rc-slider';
import type { StyledSliderProps } from './types';
import { Wrapper } from './Wrapper';

export const StyledSlider = ({
  value,
  step,
  onChange,
  min,
  max,
  classNaame,
}: StyledSliderProps) => (
  <Wrapper className={classNaame}>
    <Slider
      min={min}
      max={max}
      value={value}
      step={step}
      onChange={(val) => onChange(val)}
      activeDotStyle={{
        backgroundColor: 'var(--background-primary)',
      }}
      styles={{
        track: {
          backgroundColor: 'var(--accent-color-primary)',
        },
        rail: {
          backgroundColor: 'var(--button-secondary-background)',
        },
        handle: {
          backgroundColor: 'var(--background-primary)',
          borderColor: 'var(--accent-color-primary)',
          opacity: 1,
        },
      }}
    />
  </Wrapper>
);
