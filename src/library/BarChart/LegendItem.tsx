// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ButtonHelp } from '@rossbulat/polkadot-dashboard-ui';
import { useHelp } from 'contexts/Help';
import type { LegendItemProps } from './types';

export const LegendItem = ({ dataClass, label, helpKey }: LegendItemProps) => {
  const { openHelp } = useHelp();

  return (
    <h4>
      {dataClass ? <span className={dataClass} /> : null} {label}
      {helpKey ? (
        <ButtonHelp marginLeft onClick={() => openHelp(helpKey)} />
      ) : null}
    </h4>
  );
};
