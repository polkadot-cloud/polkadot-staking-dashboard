// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactElement } from 'react';
import { memo, useMemo } from 'react';
import { QrDisplay } from './Display.js';
import type { DisplayPayloadProps } from './types.js';
import { createSignPayload } from './util.js';

const DisplayPayload = ({
  address,
  className,
  cmd,
  genesisHash,
  payload,
  size,
  style,
  timerDelay,
}: DisplayPayloadProps): ReactElement<DisplayPayloadProps> | null => {
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

export const QrDisplayPayload = memo(DisplayPayload);
