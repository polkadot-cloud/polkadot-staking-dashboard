// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { OpenAssistantIcon } from 'library/OpenAssistantIcon';
import { StatBox } from './Item';
import { TextProps } from './types';

export const Text = (props: TextProps) => {
  const { label, value, assistant } = props;

  const assist = assistant !== undefined;
  const page = assistant?.page ?? '';
  const key = assistant?.key ?? '';
  return (
    <StatBox>
      <div className="content chart">
        <div className="labels">
          <h3 className="text">{value}</h3>
          <h4>
            {label}
            {assist && <OpenAssistantIcon page={page} title={key} />}
          </h4>
        </div>
      </div>
    </StatBox>
  );
};
