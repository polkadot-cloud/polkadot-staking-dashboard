// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { OpenHelpIcon } from 'library/OpenHelpIcon';
import { StatBox } from './Item';
import { TextProps } from './types';

export const Text = (props: TextProps) => {
  const { label, value, assistant } = props;

  const assist = assistant !== undefined;

  return (
    <StatBox>
      <div className="content chart">
        <div className="labels">
          <h3 className="text">{value}</h3>
          <h4>
            {label}
            {assist && <OpenHelpIcon key={assistant} />}
          </h4>
        </div>
      </div>
    </StatBox>
  );
};
