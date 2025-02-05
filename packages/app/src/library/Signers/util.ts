// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { V15 } from '@polkadot-api/substrate-bindings'
import { mergeUint8 } from 'polkadot-api/utils'

const CheckMetadataHash = 'CheckMetadataHash'

export const getExtraSignedExtensions = (
  v15: V15,
  digest: Uint8Array,
  signedExtensions: Record<
    string,
    {
      identifier: string
      value: Uint8Array
      additionalSigned: Uint8Array
    }
  >,
  checkMetadataHash = false
): {
  extra: Uint8Array[]
  additionalSigned: Uint8Array[]
} => {
  // NOTE: Assuming `CheckMetadataHash` signed extension exists in metadata. Could introduce
  // error here for `useSubmitExtrinsic` to handle.
  const extra: Uint8Array[] = []
  const additionalSigned: Uint8Array[] = []
  v15.extrinsic.signedExtensions.map(({ identifier }) => {
    if (checkMetadataHash && identifier === CheckMetadataHash) {
      extra.push(Uint8Array.from([1]))
      additionalSigned.push(mergeUint8(Uint8Array.from([1]), digest))
      return
    }
    const signedExtension = signedExtensions[identifier]
    if (signedExtension) {
      extra.push(signedExtension.value)
      additionalSigned.push(signedExtension.additionalSigned)
    }
  })

  return { extra, additionalSigned }
}
