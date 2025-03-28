// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

/**
 * Generates a pool invite URL
 * @param poolId - The ID of the pool to invite to
 * @returns The full invite URL
 */
export const generatePoolInviteUrl = (poolId: string): string => {
  const baseUrl = window.location.origin + window.location.pathname
  return `${baseUrl}#/invite/pool/${poolId}`
}

/**
 * Generates a validator invite URL
 * @param validators - Array of validator addresses to invite to
 * @returns The full invite URL
 */
export const generateValidatorInviteUrl = (validators: string[]): string => {
  const baseUrl = window.location.origin + window.location.pathname

  if (!validators.length) {
    return baseUrl
  }

  // Join validators with a delimiter
  const validatorList = validators.join('|')
  return `${baseUrl}#/invite/validator/${validatorList}`
}

/**
 * Extracts pool ID from a pool invite URL
 * @param url - The pool invite URL
 * @returns The pool ID or null if not found
 */
export const extractPoolIdFromUrl = (url: string): string | null => {
  const match = url.match(/#\/invite\/pool\/([^/]+)/)
  return match ? match[1] : null
}

/**
 * Extracts validator addresses from a validator invite URL
 * @param url - The validator invite URL
 * @returns Array of validator addresses
 */
export const extractValidatorsFromUrl = (url: string): string[] => {
  console.log('Extracting validators from URL:', url)

  const match = url.match(/#\/invite\/validator\/([^/]+)/)
  if (!match) {
    console.warn('No validator match found in URL')
    return []
  }

  try {
    // Split by delimiter and filter out empty values
    const validators = match[1].split('|').filter(Boolean)
    console.log('Extracted validators:', validators)
    return validators
  } catch (error) {
    console.error('Error extracting validators:', error)
    return []
  }
}

export interface InviteData {
  type: 'pool' | 'validator'
  address: string
}

/**
 * Extracts invite data from a URL parameter
 * @param param - The URL parameter to extract from
 * @returns The invite data or null if invalid
 */
export const extractInviteData = (param: string): InviteData => {
  const parts = param.split('/')
  if (parts.length < 2) {
    return { type: 'validator', address: '' }
  }

  const type = parts[0] as 'pool' | 'validator'
  const address = parts[1]

  return { type, address }
}

/**
 * Copies text to clipboard
 * @param text - The text to copy
 * @returns Promise that resolves to true if successful
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Error copying to clipboard:', error)
    return false
  }
}
