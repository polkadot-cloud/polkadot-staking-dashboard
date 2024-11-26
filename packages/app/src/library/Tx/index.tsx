// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { appendOrEmpty } from '@w3ux/utils';
import { Signer } from './Signer';
import type { TxProps } from './types';
import { Wrapper } from './Wrapper';

/**
 * @name Tx
 * @summary A wrapper to handle transaction submission.
 */
export const Tx = ({
  margin,
  label,
  name,
  notEnoughFunds,
  dangerMessage,
  SignerComponent,
  displayFor = 'default',
}: TxProps) => (
  <Wrapper className={margin ? 'margin' : undefined}>
    <div
      className={`inner${appendOrEmpty(['canvas', 'card'].includes(displayFor), displayFor)}`}
    >
      <Signer
        dangerMessage={dangerMessage}
        notEnoughFunds={notEnoughFunds}
        name={name}
        label={label}
      />
      <section>{SignerComponent}</section>
    </div>
  </Wrapper>
);
