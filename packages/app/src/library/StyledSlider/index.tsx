// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import classNames from 'classnames'
import Slider from 'rc-slider'
import classes from './index.module.scss'
import type { StyledSliderProps } from './types'

export const StyledSlider = ({
  value,
  step,
  onChange,
  min,
  max,
  classNaame,
}: StyledSliderProps) => {
  const allClasses = classNames(classes.wrapper, {
    [classes.noPadding]: classNaame === 'no-padding',
  })

  return (
    <div className={allClasses}>
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
    </div>
  )
}
