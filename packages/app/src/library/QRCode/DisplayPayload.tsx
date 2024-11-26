// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { u8aConcat } from '@polkadot/util';
import { decodeAddress } from '@polkadot/util-crypto';
import type { ReactElement } from 'react';
import { memo, useMemo } from 'react';
import { QrDisplay } from './Display.js';
import type { DisplayPayloadProps } from './types.js';

const createSignPayload = (
  address: string,
  cmd: number,
  payload: Uint8Array,
  genesisHash: Uint8Array
): Uint8Array => {
  const SUBSTRATE_ID = new Uint8Array([0x53]);
  const CRYPTO_SR25519 = new Uint8Array([0x01]);

  return u8aConcat(
    SUBSTRATE_ID,
    CRYPTO_SR25519,
    new Uint8Array([cmd]),
    decodeAddress(address),
    payload,
    genesisHash
  );
};

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
