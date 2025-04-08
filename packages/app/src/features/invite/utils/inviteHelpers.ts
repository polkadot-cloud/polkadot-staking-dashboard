// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

/**
 * Generates a pool invite URL
 * @param poolId - The ID of the pool to invite to
 * @param network - The network name (polkadot/kusama/westend)
 * @param language - Optional language code (en/es/zh)
 * @returns The full invite URL
 */
export const generatePoolInviteUrl = (
  poolId: string,
  network: string,
  language?: string
): string => {
  const baseUrl = window.location.origin + window.location.pathname
  const url = `${baseUrl}#/invite/pool/${network}/${poolId}`

  // Add URL variables if provided
  const params = new URLSearchParams()
  if (language) {
    params.append('l', language)
  }

  return params.toString() ? `${url}?${params.toString()}` : url
}

/**
 * Generates a validator invite URL
 * @param validators - Array of validator addresses to invite to
 * @param network - The network name (polkadot/kusama/westend)
 * @param language - Optional language code (en/es/zh)
 * @returns The full invite URL
 */
export const generateValidatorInviteUrl = (
  validators: string[],
  network: string,
  language?: string
): string => {
  const baseUrl = window.location.origin + window.location.pathname

  if (!validators.length) {
    return baseUrl
  }

  // Join validators with a delimiter
  const validatorList = validators.join('|')
  const url = `${baseUrl}#/invite/validator/${network}/${validatorList}`

  // Add URL variables if provided
  const params = new URLSearchParams()
  if (language) {
    params.append('l', language)
  }

  return params.toString() ? `${url}?${params.toString()}` : url
}

/**
 * Extracts pool ID from a pool invite URL
 * @param url - The pool invite URL
 * @returns Object containing network, pool ID, and optional language or null if not found
 */
export const extractPoolIdFromUrl = (
  url: string
): { network: string; poolId: string; language?: string } | null => {
  // Extract the hash part and query parameters
  const [hashPart] = url.split('?')

  const match = hashPart.match(/#\/invite\/pool\/([^/]+)\/([^/]+)/)
  if (!match) {
    return null
  }

  // Extract parameters using the helper
  const queryParams = extractUrlParams(url)

  return {
    network: match[1],
    poolId: match[2],
    language: queryParams.l,
  }
}

/**
 * Extracts validator addresses from a validator invite URL
 * @param url - The validator invite URL
 * @returns Object containing network, array of validator addresses and optional language
 */
export const extractValidatorsFromUrl = (
  url: string
): { network: string; validators: string[]; language?: string } => {
  console.log('Extracting validators from URL:', url)

  // Extract the hash part and query parameters
  const [hashPart] = url.split('?')

  const match = hashPart.match(/#\/invite\/validator\/([^/]+)\/([^/]+)/)
  if (!match) {
    console.warn('No validator match found in URL')
    return { network: '', validators: [] }
  }

  try {
    const network = match[1]
    // Split by delimiter and filter out empty values
    const validators = match[2].split('|').filter(Boolean)
    console.log('Extracted validators:', validators)

    // Extract parameters using the helper
    const queryParams = extractUrlParams(url)

    return {
      network,
      validators,
      language: queryParams.l,
    }
  } catch (error) {
    console.error('Error extracting validators:', error)
    return { network: '', validators: [] }
  }
}

export interface InviteData {
  type: 'pool' | 'validator'
  network: string
  address: string
}

/**
 * Extracts invite data from a URL parameter
 * @param param - The URL parameter to extract from
 * @returns The invite data or null if invalid
 */
export const extractInviteData = (param: string): InviteData => {
  const parts = param.split('/')
  if (parts.length < 3) {
    return { type: 'validator', network: '', address: '' }
  }

  const type = parts[0] as 'pool' | 'validator'
  const network = parts[1]
  const address = parts[2]

  return { type, network, address }
}

/**
 * Extracts query parameters from a URL
 * @param url - The URL to extract parameters from
 * @returns An object containing the extracted parameters
 */
export const extractUrlParams = (url: string): { [key: string]: string } => {
  const queryParams: { [key: string]: string } = {}

  // Extract query part after ?
  const queryPart = url.split('?')[1]
  if (!queryPart) {
    return queryParams
  }

  // Parse query parameters
  const params = new URLSearchParams(queryPart)

  // Convert to object
  for (const [key, value] of params.entries()) {
    queryParams[key] = value
  }

  return queryParams
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
