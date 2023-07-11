// Copyright 2017-2023 @polkadot/react-qr authors & contributors
// SPDX-License-Identifier: Apache-2.0

export const ADDRESS_PREFIX = 'substrate';
export const SEED_PREFIX = 'secret';
export const FRAME_SIZE = 1024;
export const SUBSTRATE_ID = new Uint8Array([0x53]);
export const CRYPTO_SR25519 = new Uint8Array([0x01]);
export const CMD_SIGN_TX = new Uint8Array([0]);
export const CMD_SIGN_TX_HASH = new Uint8Array([1]);
export const CMD_SIGN_IMMORTAL_TX = new Uint8Array([2]);
export const CMD_SIGN_MSG = new Uint8Array([3]);
