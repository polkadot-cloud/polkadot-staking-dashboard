// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { OpenHelpIcon } from 'library/OpenHelpIcon';
import { LegendItemProps } from './types';

export const LegendItem = ({ dataClass, label, helpKey }: LegendItemProps) => {
  return (
    <h4>
      {dataClass ? <span className={dataClass} /> : null} {label}
      {helpKey ? <OpenHelpIcon helpKey={helpKey} /> : null}
    </h4>
  );
};
