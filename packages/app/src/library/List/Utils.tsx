// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js'
import type { AnyJson } from 'types'
import type { IdentityDisplay } from './types'

export const getIdentityDisplay = (
  _identity: AnyJson,
  _superIdentity: AnyJson
): IdentityDisplay => {
  let displayFinal = ''
  let foundSuper = false
  // Check super identity exists, get display.Raw if it does
  const superIdentity = _superIdentity?.identity ?? null
  const superDisplay = superIdentity?.info?.display?.value?.asText() ?? null

  // Determine final display value if super was found
  if (!['', null].includes(superDisplay)) {
    displayFinal = superDisplay
    foundSuper = true
  }

  // Determine final display value if super was not found
  if (!foundSuper) {
    // Check sub-identity exists, get display.Raw if it does
    const identity = _identity?.info?.display?.value?.asText() ?? null

    // Add sub-identity to final display value if it exists
    if (!['', null].includes(identity)) {
      displayFinal = identity
    }
  }
  if (displayFinal === '') {
    return { node: null, data: null }
  }

  const data = {
    display: displayFinal,
    super: !['', displayFinal].includes(superDisplay) ? superDisplay : null,
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
