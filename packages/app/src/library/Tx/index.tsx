// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Wrapper } from './Wrapper';
import { appendOrEmpty } from '@w3ux/utils';
import type { TxProps } from './types';
import { Signer } from './Signer';

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
