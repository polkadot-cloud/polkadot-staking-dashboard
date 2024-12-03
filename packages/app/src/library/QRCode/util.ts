// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { u8aConcat } from '@polkadot/util'

const MULTIPART = new Uint8Array([0])

export const encodeNumber = (value: number): Uint8Array =>
  new Uint8Array([value >> 8, value & 0xff])

export const encodeString = (value: string): Uint8Array => {
  const count = value.length
  const u8a = new Uint8Array(count)

  for (let i = 0; i < count; i++) {
    u8a[i] = value.charCodeAt(i)
  }

  return u8a
}

export const createFrames = (input: Uint8Array): Uint8Array[] => {
  const frames = []
  const frameSize = 1024

  let idx = 0
  while (idx < input.length) {
    frames.push(input.subarray(idx, idx + frameSize))
    idx += frameSize
  }

  return frames.map(
    (frame, index: number): Uint8Array =>
      u8aConcat(
        MULTIPART,
        encodeNumber(frames.length),
        encodeNumber(index),
        frame
      )
  )
}

export const createImgSize = (
  size?: string | number
): Record<string, string> => ({
  width: size ? `${size}px` : 'auto',
  height: 'auto',
})
