// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ButtonHelp } from '@polkadot-cloud/react';
import { useHelp } from 'contexts/Help';
import type { LegendItemProps } from './types';

export const LegendItem = ({
  dataClass,
  label,
  helpKey,
  button,
}: LegendItemProps) => {
  const { openHelp } = useHelp();

  return (
    <h4>
      {dataClass ? <span className={dataClass} /> : null} {label}
      {helpKey ? (
        <ButtonHelp marginLeft onClick={() => openHelp(helpKey)} />
      ) : null}
      {button && button}
    </h4>
  );
};
