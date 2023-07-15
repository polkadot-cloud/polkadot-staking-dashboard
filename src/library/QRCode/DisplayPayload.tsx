// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';
import { QrDisplay } from './Display.js';
import { createSignPayload } from './util.js';

interface Props {
  address: string;
  className?: string;
  cmd: number;
  genesisHash: Uint8Array | string;
  payload: Uint8Array;
  size?: string | number;
  style?: React.CSSProperties;
  timerDelay?: number;
}

const DisplayPayload = ({
  address,
  className,
  cmd,
  genesisHash,
  payload,
  size,
  style,
  timerDelay,
}: Props): React.ReactElement<Props> | null => {
  const data = useMemo(
    () => createSignPayload(address, cmd, payload, genesisHash),
    [address, cmd, payload, genesisHash]
  );

  if (!data) {
    return null;
  }

  return (
    <QrDisplay
      className={className}
      size={size}
      style={style}
      timerDelay={timerDelay}
      value={data}
    />
  );
};

export const QrDisplayPayload = React.memo(DisplayPayload);
