// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useState } from 'react'
import { useOverlay } from 'ui-overlay'

/**
 * Custom hook to manage invite URL display logic
 * @param url - The full invite URL to display
 * @returns Object containing URL display state and toggle function
 */
export const useInviteUrl = (url: string) => {
  const [showFullUrl, setShowFullUrl] = useState(false)
  const { setModalResize } = useOverlay().modal

  /**
   * Shortens a URL for display purposes
   * @param urlString - The URL to shorten
   * @returns Shortened URL with ellipsis in the middle
   */
  const shortenUrl = (urlString: string) => {
    if (urlString.length <= 60) {
      return urlString
    }
    return `${urlString.substring(0, 30)}...${urlString.substring(urlString.length - 30)}`
  }

  /**
   * Toggles between full and shortened URL display
   */
  const toggleUrlDisplay = () => {
    setShowFullUrl(!showFullUrl)
  }

  // Resize modal when URL display changes
  useEffect(() => {
    if (showFullUrl) {
      // Use requestAnimationFrame to ensure DOM has updated before resizing
      const frameId = requestAnimationFrame(() => {
        setModalResize()
      })

      return () => cancelAnimationFrame(frameId)
    }
  }, [showFullUrl, setModalResize])

  // Compute the display URL based on current state
  const displayUrl = showFullUrl ? url : shortenUrl(url)

  return {
    showFullUrl,
    displayUrl,
    toggleUrlDisplay,
  }
}
