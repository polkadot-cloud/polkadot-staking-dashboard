// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BarSegmentShowLabelThreshold } from './defaults';
import { BarSegmentProps } from './types';

export const BarSegment = ({
  dataClass,
  widthPercent,
  flexGrow,
  label,
  forceShowLabel,
}: BarSegmentProps) => {
  return (
    <div
      className={dataClass}
      style={{
        width: `${flexGrow ? 100 : widthPercent}%`,
        flexGrow,
      }}
    >
      {widthPercent >= BarSegmentShowLabelThreshold ||
      (widthPercent < BarSegmentShowLabelThreshold && forceShowLabel) ? (
        <span>{label}</span>
      ) : null}
    </div>
  );
};
