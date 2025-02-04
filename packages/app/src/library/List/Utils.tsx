// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { u8aToString, u8aUnwrapBytes } from '@polkadot/util'
import type { AnyJson } from '@w3ux/types'
import BigNumber from 'bignumber.js'
import type { IdentityDisplay } from './types'

export const getIdentityDisplay = (
  _identity: AnyJson,
  _superIdentity: AnyJson
): IdentityDisplay => {
  let displayFinal = ''
  let foundSuper = false
  // Check super identity exists, get display.Raw if it does
  const superIdentity = _superIdentity?.identity ?? null
  const superRaw = _superIdentity?.superOf?.[1]?.Raw ?? null
  const superDisplay = superIdentity?.info?.display?.value?.asText() ?? null

  // Check if super raw has been encoded
  const superRawAsBytes = u8aToString(u8aUnwrapBytes(superRaw))
  // Check if super identity has been byte encoded
  const superIdentityAsBytes = u8aToString(u8aUnwrapBytes(superDisplay))

  // Determine final display value if super was found
  if (superIdentityAsBytes !== '') {
    displayFinal = superIdentityAsBytes
    foundSuper = true
  } else if (superDisplay !== null) {
    displayFinal = superDisplay
    foundSuper = true
  }

  // Determine final display value if super was not found
  if (!foundSuper) {
    // Check sub-identity exists, get display.Raw if it does
    const identity = _identity?.info?.display?.value?.asText() ?? null
    // Check if identity has been byte encoded
    const subIdentityAsBytes = u8aToString(u8aUnwrapBytes(identity))
    // Add sub-identity to final display value if it exists
    if (subIdentityAsBytes !== '') {
      displayFinal = subIdentityAsBytes
    } else if (identity !== null) {
      displayFinal = identity
    }
  }
  if (displayFinal === '') {
    return { node: null, data: null }
  }

  const data = {
    display: displayFinal,
    super:
      superIdentityAsBytes !== ''
        ? superRawAsBytes
        : superRaw !== null
          ? superRaw
          : null,
  }
  return {
    node: (
      <>
        {data.display}
        {data.super ? <span>/ {data.super}</span> : null}
      </>
    ),
    data,
  }
}

// Normalise era points between 0 and 1 relative to the highest recorded value.
export const normaliseEraPoints = (
  eraPoints: Record<string, BigNumber>,
  high: BigNumber
): Record<string, number> => {
  const percentile = high.isZero() ? new BigNumber(0) : high.dividedBy(100)

  return Object.fromEntries(
    Object.entries(eraPoints).map(([era, points]) => [
      era,
      Math.min(
        percentile.isZero()
          ? 0
          : points.dividedBy(percentile).multipliedBy(0.01).toNumber(),
        1
      ),
    ])
  )
}

// Prefill low values where no points are recorded.
export const prefillEraPoints = (eraPoints: number[]): number[] => {
  const missing = Math.max(30 - eraPoints.length, 0)

  if (!missing) {
    return eraPoints
  }

  return Array(missing).fill(0).concat(eraPoints)
}
