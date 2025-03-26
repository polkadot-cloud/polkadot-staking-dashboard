// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

// Base58 character set for encoding/decoding
const BASE58_CHARS =
  '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'

/**
 * Encodes a string to base58
 * @param input - The string to encode
 * @returns The base58 encoded string
 */
export const encodeBase58 = (input: string): string => {
  // Simple implementation of base58 encoding
  // In a production environment, you might want to use a library like bs58
  let result = ''
  let num = BigInt('0x' + Buffer.from(input).toString('hex'))

  while (num > 0) {
    const remainder = Number(num % BigInt(58))
    result = BASE58_CHARS[remainder] + result
    num = num / BigInt(58)
  }

  // Add leading '1's for each leading 0 byte
  for (let i = 0; i < input.length && input[i] === '\0'; i++) {
    result = '1' + result
  }

  return result
}

/**
 * Decodes a base58 string
 * @param input - The base58 string to decode
 * @returns The decoded string
 */
export const decodeBase58 = (input: string): string => {
  // Simple implementation of base58 decoding
  let num = BigInt(0)

  for (let i = 0; i < input.length; i++) {
    const char = input[i]
    const charIndex = BASE58_CHARS.indexOf(char)
    if (charIndex === -1) {
      throw new Error(`Invalid base58 character: ${char}`)
    }
    num = num * BigInt(58) + BigInt(charIndex)
  }

  // Convert the number back to a string
  const hex = num.toString(16)
  // Ensure even length
  const paddedHex = hex.length % 2 ? '0' + hex : hex

  // Convert hex to string
  let result = ''
  for (let i = 0; i < paddedHex.length; i += 2) {
    const byte = parseInt(paddedHex.substring(i, i + 2), 16)
    result += String.fromCharCode(byte)
  }

  // Add leading null bytes
  for (let i = 0; i < input.length && input[i] === '1'; i++) {
    result = '\0' + result
  }

  return result
}

/**
 * Compresses a list of validator addresses into a shorter format
 * @param validators - Array of validator addresses
 * @returns A compressed string representation
 */
export const compressValidators = (validators: string[]): string => {
  if (!validators.length) {
    return ''
  }

  // Join the validators with a delimiter and encode
  const joined = validators.join('|')
  // Use a hash function or encoding to create a shorter representation
  // For simplicity, we'll use base58 encoding
  return encodeBase58(joined)
}

/**
 * Decompresses a compressed validator string back into an array of addresses
 * @param compressed - The compressed validator string
 * @returns Array of validator addresses
 */
export const decompressValidators = (compressed: string): string[] => {
  if (!compressed) {
    return []
  }

  try {
    // Decode the compressed string
    const decoded = decodeBase58(compressed)
    // Split by delimiter
    return decoded.split('|')
  } catch (error) {
    console.error('Error decompressing validators:', error)
    return []
  }
}

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
 * Generates a validator invite URL with compressed format
 * @param validators - Array of validator addresses to invite to
 * @returns The full invite URL
 */
export const generateValidatorInviteUrl = (validators: string[]): string => {
  const baseUrl = window.location.origin + window.location.pathname

  if (!validators.length) {
    return baseUrl
  }

  // Use the first validator as the primary one for the URL path
  const primaryValidator = validators[0]

  // If there's only one validator, use a simple URL
  if (validators.length === 1) {
    return `${baseUrl}#/invite/validator/${primaryValidator}`
  }

  // For multiple validators, compress the list
  const compressed = compressValidators(validators)
  return `${baseUrl}#/invite/validator/${primaryValidator}/list/${compressed}`
}

/**
 * Extracts pool ID from a pool invite URL
 * @param url - The URL to parse
 * @returns The pool ID or null if not found
 */
export const extractPoolIdFromUrl = (url: string): string | null => {
  const regex = /\/invite\/pool\/([^/]+)/
  const match = url.match(regex)
  return match ? match[1] : null
}

/**
 * Extracts validator addresses from a validator invite URL
 * @param url - The URL to parse
 * @returns Array of validator addresses or empty array if not found
 */
export const extractValidatorsFromUrl = (url: string): string[] => {
  console.log('Extracting validators from URL:', url)

  // Extract the primary validator from the path
  const pathRegex = /\/invite\/validator\/([^/?#]+)/
  const pathMatch = url.match(pathRegex)
  const primaryValidator = pathMatch ? pathMatch[1] : null
  console.log('Primary validator:', primaryValidator)

  // Check for compressed list format
  const compressedRegex = /\/invite\/validator\/[^/]+\/list\/([^/?#]+)/
  const compressedMatch = url.match(compressedRegex)
  console.log(
    'Compressed match:',
    compressedMatch ? compressedMatch[1] : 'none'
  )

  if (compressedMatch) {
    // Decompress the validator list
    const validators = decompressValidators(compressedMatch[1])
    console.log('Decompressed validators:', validators)
    return validators
  }

  // Legacy format: Extract validators from query parameter
  const queryRegex = /[?&]validators=([^&]+)/
  const queryMatch = url.match(queryRegex)
  const validatorsParam = queryMatch ? queryMatch[1] : ''
  console.log('Query validators:', validatorsParam)

  if (validatorsParam) {
    return validatorsParam.split(',')
  } else if (primaryValidator) {
    console.log('Using primary validator only:', primaryValidator)
    return [primaryValidator]
  }

  console.log('No validators found in URL')
  return []
}

/**
 * Extracts invite data from a URL parameter
 * @param param - The URL parameter to parse
 * @returns Object containing the type of invite and relevant data
 */
export interface InviteData {
  type: 'pool' | 'validator'
  address: string
}

export const extractInviteData = (param: string): InviteData => {
  // Check if it's a pool ID (numeric)
  if (/^\d+$/.test(param)) {
    return {
      type: 'pool',
      address: param,
    }
  }

  // Otherwise assume it's a validator address
  return {
    type: 'validator',
    address: param,
  }
}

/**
 * Copies text to clipboard
 * @param text - The text to copy
 * @returns Promise that resolves when copying is complete
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error('Failed to copy text: ', err)
    return false
  }
}
