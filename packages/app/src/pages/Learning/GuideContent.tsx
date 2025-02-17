// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useLearningState } from 'contexts/Learning'
import { motion } from 'framer-motion'
import { CardWrapper } from 'library/Card/Wrappers'
import { useTranslation } from 'react-i18next'
import { ContentWrapper } from './Wrappers'

export const GuideContent = () => {
  const { t } = useTranslation('pages')
  const { activePath, activeGuide } = useLearningState()

  if (!activeGuide || !activePath) {
    return null
  }

  const formatContent = (content: string) => {
    const parts = content.split('\n\n')
    return parts.map((part, index) => {
      if (part.includes('•')) {
        const items = part.split('•').filter((item) => item.trim())
        return (
          <motion.ul
            key={`list-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="guide-list"
          >
            {items.map((item, i) => (
              <motion.li
                key={`item-${i}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                {item.trim()}
              </motion.li>
            ))}
          </motion.ul>
        )
      }
      return (
        <motion.p
          key={`p-${index}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + index * 0.1 }}
          className="guide-paragraph"
        >
          {part.trim()}
        </motion.p>
      )
    })
  }

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
          <motion.div
            className="guide-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {formatContent(content)}
          </motion.div>
        </motion.div>
      </CardWrapper>
    </ContentWrapper>
  )
}
