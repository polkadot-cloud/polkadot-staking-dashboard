// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useLearningState } from 'contexts/Learning'
import { AnimatePresence, motion } from 'framer-motion'
import { CardWrapper } from 'library/Card/Wrappers'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ContentWrapper } from './Wrappers'
import type { GuideSection, LearningGuide } from './paths'
import { parseGuideContent } from './util'

export const GuideContent = () => {
  const { t } = useTranslation('pages')
  const { activePath, activeGuide } = useLearningState()
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({})

  if (!activeGuide || !activePath) {
    return null
  }

  // Get full content and metadata for current guide
  const title = t(`learning.paths.${activePath}.guides.${activeGuide.id}.title`)
  const content = t(
    `learning.paths.${activePath}.guides.${activeGuide.id}.content`
  )
  const difficulty = t((activeGuide as LearningGuide).difficulty)
  const topic = t((activeGuide as LearningGuide).topic)
  const time = t((activeGuide as LearningGuide).time)

  // Parse content into sections while preserving markdown
  const sections: GuideSection[] = parseGuideContent(content)

  // Determine if this is a simple guide with only one main section
  const isSimpleGuide = sections.length === 1 && !sections[0].title

  const toggleSection = (sectionTitle: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle],
    }))
  }

  return (
    <ContentWrapper>
      <CardWrapper>
        <motion.div
          className="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Guide Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="guide-header"
          >
            <h2>{title}</h2>
            <div className="guide-tags">
              <span className="tag difficulty">{difficulty}</span>
              <span className="tag topic">{topic}</span>
              <span className="tag time">{time}</span>
            </div>
          </motion.div>

          {/* Simple guide with single content block */}
          {isSimpleGuide && (
            <div className="guide-simple-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  ul: ({ children }) => (
                    <ul className="interactive-list">{children}</ul>
                  ),
                  li: ({ children }) => (
                    <li className="interactive-list-item">
                      <span className="bullet">•</span>
                      {children}
                    </li>
                  ),
                  ol: ({ children }) => (
                    <ul className="interactive-list">{children}</ul>
                  ),
                  table: ({ children }) => (
                    <div className="table-wrapper">
                      <table className="interactive-table">{children}</table>
                    </div>
                  ),
                }}
              >
                {sections[0].content}
              </ReactMarkdown>
            </div>
          )}

          {/* Complex guide with collapsible sections */}
          {!isSimpleGuide && (
            <div className="guide-sections">
              {sections.map((section, index) => {
                // Skip rendering subsections here as they'll be handled within their parent section
                if (section.title && section.title.startsWith('### ')) {
                  return null
                }

                const sectionTitle = section.title || ''

                return (
                  <motion.div
                    key={index}
                    className="guide-section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {section.title && (
                      <div
                        className="section-header"
                        onClick={() => toggleSection(sectionTitle)}
                      >
                        <h3 className="section-title">
                          {sectionTitle.replace(/^##\s+/, '')}
                        </h3>
                        <div
                          className={`section-arrow ${expandedSections[sectionTitle] ? 'expanded' : ''}`}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M6 9L12 15L18 9"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </div>
                    )}

                    <AnimatePresence>
                      {(!sectionTitle || expandedSections[sectionTitle]) && (
                        <motion.div
                          className="section-content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          {section.content && (
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                ul: ({ children }) => (
                                  <ul className="interactive-list">
                                    {children}
                                  </ul>
                                ),
                                li: ({ children }) => (
                                  <li className="interactive-list-item">
                                    <span className="bullet">•</span>
                                    {children}
                                  </li>
                                ),
                                ol: ({ children }) => (
                                  <ul className="interactive-list">
                                    {children}
                                  </ul>
                                ),
                                table: ({ children }) => (
                                  <div className="table-wrapper">
                                    <table className="interactive-table">
                                      {children}
                                    </table>
                                  </div>
                                ),
                              }}
                            >
                              {section.content}
                            </ReactMarkdown>
                          )}

                          {/* Subsections - render only if this is an expanded parent section */}
                          {section.subsections &&
                            section.subsections.length > 0 && (
                              <div className="subsections">
                                {section.subsections.map(
                                  (subsection, subIndex) => (
                                    <div key={subIndex} className="subsection">
                                      <h4 className="subsection-title">
                                        {subsection.title}
                                      </h4>
                                      <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                          ul: ({ children }) => (
                                            <ul className="interactive-list">
                                              {children}
                                            </ul>
                                          ),
                                          li: ({ children }) => (
                                            <li className="interactive-list-item">
                                              <span className="bullet">•</span>
                                              {children}
                                            </li>
                                          ),
                                          ol: ({ children }) => (
                                            <ul className="interactive-list">
                                              {children}
                                            </ul>
                                          ),
                                          table: ({ children }) => (
                                            <div className="table-wrapper">
                                              <table className="interactive-table">
                                                {children}
                                              </table>
                                            </div>
                                          ),
                                        }}
                                      >
                                        {subsection.content}
                                      </ReactMarkdown>
                                    </div>
                                  )
                                )}
                              </div>
                            )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.div>
      </CardWrapper>
    </ContentWrapper>
  )
}
