// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useHelp } from 'contexts/Help';
import type { LegendItemProps } from './types';
import { ButtonHelp } from 'ui-buttons';

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
