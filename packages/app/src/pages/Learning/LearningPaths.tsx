// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useLearningState } from 'contexts/Learning'
import { AnimatePresence, motion } from 'framer-motion'
import { CardWrapper } from 'library/Card/Wrappers'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PathWrapper } from './Wrappers'
import { paths } from './paths'

export const LearningPaths = () => {
  const { t } = useTranslation('pages')
  const { setActivePath, activeGuide, setActiveGuide } = useLearningState()
  const [expandedPath, setExpandedPath] = useState<string | null>(null)

  const handlePathClick = (pathId: string) => {
    if (expandedPath === pathId) {
      setExpandedPath(null)
    } else {
      setExpandedPath(pathId)
    }
  }

  return (
    <PathWrapper>
      {paths.map((path) => (
        <CardWrapper
          key={path.id}
          className={`path-card ${expandedPath === path.id ? 'active' : ''}`}
          style={{ cursor: 'pointer' }}
          onClick={() => handlePathClick(path.id)}
        >
          <div className="path-header">
            <h3>{t(`learning.paths.${path.id}.title`)}</h3>
            <p>{t(`learning.paths.${path.id}.description`)}</p>
          </div>

          <AnimatePresence>
            {expandedPath === path.id && (
              <motion.div
                className="guide-list"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {path.guides.map((guide) => (
                  <motion.button
                    key={guide.id}
                    type="button"
                    className={`guide-button ${
                      activeGuide?.id === guide.id ? 'active' : ''
                    }`}
                    onClick={(e) => {
                      e.stopPropagation()
                      setActivePath(path.id)
                      setActiveGuide(guide)
                    }}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {t(`learning.paths.${path.id}.guides.${guide.id}.title`)}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </CardWrapper>
      ))}
    </PathWrapper>
  )
}
