// Prop comparison utilities for React.memo custom comparison functions

// Deep equality check for objects/arrays
export const deepEqual = (a: unknown, b: unknown): boolean => {
  if (a === b) {
    return true
  }
  if (typeof a !== typeof b) {
    return false
  }
  if (typeof a !== 'object' || a === null || b === null) {
    return false
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
  // Both are non-null objects (not arrays)
  const objA = a as Record<string, unknown>
  const objB = b as Record<string, unknown>
  const keysA = Object.keys(objA)
  const keysB = Object.keys(objB)
  if (keysA.length !== keysB.length) {
    return false
  }
  for (const key of keysA) {
    if (!deepEqual(objA[key], objB[key])) {
      return false
    }
  }
  return true
}

// Boolean equality
export const boolEqual = (a: boolean, b: boolean): boolean => a === b

// String equality (handles null/undefined)
export const stringEqual = (
  a: string | null | undefined,
  b: string | null | undefined
): boolean => a === b

// Compose multiple checks, returns true if all are true
export const arePropsEqual = (...checks: boolean[]): boolean =>
  checks.every(Boolean)
