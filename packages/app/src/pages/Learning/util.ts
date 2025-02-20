// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { GuideSection } from './paths'

export const parseGuideContent = (content: string): GuideSection[] => {
  // If there are no ## headers, just return the whole content as one section
  if (!content.match(/##\s/)) {
    return [{ content }]
  }

  // Split content by main headers (##)
  const sections = content.split(/(?=##\s)/).filter(Boolean)
  const result: GuideSection[] = []

  let currentMainSection: GuideSection | null = null

  sections.forEach((section) => {
    const lines = section.split('\n')
    const titleLine = lines[0]
    const contentLines = lines.slice(1).join('\n').trim()

    // Check if this is a main section (## Title) or a subsection (### Title)
    const isMainSection = titleLine.startsWith('## ')
    const isSubSection = titleLine.startsWith('### ')

    if (isMainSection) {
      // Start a new main section
      const title = titleLine
      currentMainSection = {
        title,
        content: contentLines,
        subsections: [],
      }
      result.push(currentMainSection)
    } else if (isSubSection && currentMainSection) {
      // Add as subsection to current main section
      const title = titleLine.replace(/^###\s+/, '')
      currentMainSection.subsections = currentMainSection.subsections || []
      currentMainSection.subsections.push({
        title,
        content: contentLines,
      })
    } else {
      // Regular content section
      result.push({
        content: section.trim(),
      })
    }
  })

  return result
}
