// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { AccountId } from 'polkadot-api';
import { mergeUint8 } from 'polkadot-api/utils';
import type { ReactElement } from 'react';
import { memo, useMemo } from 'react';
import { QrDisplay } from './Display.js';
import type { DisplayPayloadProps } from './types.js';

const createSignPayload = (
  address: string,
  cmd: number,
  payload: Uint8Array,
  genesisHash: Uint8Array
): Uint8Array =>
  mergeUint8(
    new Uint8Array([0x53]), // SUBSTRATE_ID
    new Uint8Array([0x01]), // CRYPTO_SR25519
    new Uint8Array([cmd]),
    AccountId().enc(address),
    payload,
    genesisHash
  );

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
