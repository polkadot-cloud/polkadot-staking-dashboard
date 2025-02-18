// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useLearningState } from 'contexts/Learning'
import { motion } from 'framer-motion'
import { CardWrapper } from 'library/Card/Wrappers'
import { useTranslation } from 'react-i18next'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ContentWrapper } from './Wrappers'
import { paths } from './paths'

export const GuideContent = () => {
  const { t } = useTranslation('pages')
  const { activePath, activeGuide } = useLearningState()

  if (!activeGuide || !activePath) {
    return null
  }

  // Find current guide metadata from paths.ts
  const currentGuideMeta = paths
    .find((path) => path.id === activePath)
    ?.guides.find((guide) => guide.id === activeGuide.id)

  // Retrieve content using i18n translation
  const content = t(
    `learning.paths.${activePath}.guides.${activeGuide.id}.content`
  )

  return (
    <ContentWrapper>
      <CardWrapper>
        <motion.div
          className="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="guide-title"
          >
            {t(`learning.paths.${activePath}.guides.${activeGuide.id}.title`)}
          </motion.h2>

          {currentGuideMeta && (
            <div className="guide-tags" style={{ marginBottom: '0.75rem' }}>
              <span
                className="guide-tag"
                style={{
                  backgroundColor: '#eee',
                  padding: '.25rem .5rem',
                  borderRadius: '.25rem',
                  marginRight: '.5rem',
                  fontSize: '0.85rem',
                }}
              >
                {t(currentGuideMeta.topic)}
              </span>
              <span
                className="guide-tag"
                style={{
                  backgroundColor: '#eee',
                  padding: '.25rem .5rem',
                  borderRadius: '.25rem',
                  fontSize: '0.85rem',
                }}
              >
                {t(currentGuideMeta.time)}
              </span>
            </div>
          )}

          <motion.div
            className="guide-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {/* Replace manual parsing with Markdown rendering */}
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </motion.div>
        </motion.div>
      </CardWrapper>
    </ContentWrapper>
  )
}
