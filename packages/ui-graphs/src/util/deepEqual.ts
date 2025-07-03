// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

/**
 * Deep comparison utility for React.memo arePropsEqual functions
 * More efficient than JSON.stringify for object comparison
 */

export const deepEqual = (a: unknown, b: unknown): boolean => {
  if (a === b) {
    return true
  }

  if (a == null || b == null) {
    return a === b
  }

  if (typeof a !== typeof b) {
    return false
  }

  if (typeof a !== 'object') {
    return a === b
  }

  if (Array.isArray(a) !== Array.isArray(b)) {
    return false
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false
    }
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) {
        return false
      }
    }
    return true
  }

  const keysA = Object.keys(a as Record<string, unknown>)
  const keysB = Object.keys(b as Record<string, unknown>)

  if (keysA.length !== keysB.length) {
    return false
  }

  for (const key of keysA) {
    if (!keysB.includes(key)) {
      return false
    }
    if (
      !deepEqual(
        (a as Record<string, unknown>)[key],
        (b as Record<string, unknown>)[key]
      )
    ) {
      return false
    }
  }

  return true
}

/**
 * Shallow comparison for primitive arrays
 * More efficient than deepEqual for simple data structures
 */
export const shallowArrayEqual = (a: unknown[], b: unknown[]): boolean => {
  if (a.length !== b.length) {
    return false
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false
    }
  }
  return true
}

/**
 * Object comparison optimized for chart props
 * Handles common chart data structures efficiently
 */
export const chartPropsEqual = (
  a: Record<string, unknown>,
  b: Record<string, unknown>
): boolean => {
  const keysA = Object.keys(a)
  const keysB = Object.keys(b)

  if (keysA.length !== keysB.length) {
    return false
  }

  for (const key of keysA) {
    if (!keysB.includes(key)) {
      return false
    }

    const valA = a[key]
    const valB = b[key]

    if (valA === valB) {
      continue
    }

    if (typeof valA === 'object' && typeof valB === 'object') {
      if (!deepEqual(valA, valB)) {
        return false
      }
    } else if (valA !== valB) {
      return false
    }
  }

  return true
}
