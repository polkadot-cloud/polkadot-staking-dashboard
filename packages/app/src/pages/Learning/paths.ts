// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export interface LearningGuide {
  id: string
  // These properties are set as translation keys.
  difficulty: string // e.g., 'learning.categories.difficulty.beginner'
  topic: string // e.g., 'learning.categories.topic.technical'
  time: string // e.g., 'learning.categories.time.quick-read'
}

export interface LearningPath {
  id: string
  guides: LearningGuide[]
}

export const paths: LearningPath[] = [
  {
    id: 'essential',
    guides: [
      {
        id: 'what-is-staking',
        difficulty: 'learning.categories.difficulty.beginner',
        topic: 'learning.categories.topic.technical',
        time: 'learning.categories.time.quick-read',
      },
      {
        id: 'first-stake',
        difficulty: 'learning.categories.difficulty.beginner',
        topic: 'learning.categories.topic.security',
        time: 'learning.categories.time.deep-dive',
      },
      {
        id: 'rewards',
        difficulty: 'learning.categories.difficulty.beginner',
        topic: 'learning.categories.topic.rewards',
        time: 'learning.categories.time.quick-read',
      },
    ],
  },
  {
    id: 'intermediate',
    guides: [
      {
        id: 'nomination-pools',
        difficulty: 'learning.categories.difficulty.intermediate',
        topic: 'learning.categories.topic.technical',
        time: 'learning.categories.time.deep-dive',
      },
      {
        id: 'validator-selection',
        difficulty: 'learning.categories.difficulty.intermediate',
        topic: 'learning.categories.topic.technical',
        time: 'learning.categories.time.quick-read',
      },
    ],
  },
  {
    id: 'advanced',
    guides: [
      {
        id: 'controller-accounts',
        difficulty: 'learning.categories.difficulty.advanced',
        topic: 'learning.categories.topic.security',
        time: 'learning.categories.time.deep-dive',
      },
      {
        id: 'slashing',
        difficulty: 'learning.categories.difficulty.advanced',
        topic: 'learning.categories.topic.economic',
        time: 'learning.categories.time.quick-read',
      },
    ],
  },
]
