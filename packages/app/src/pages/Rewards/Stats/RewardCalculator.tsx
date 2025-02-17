// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCalculator } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from 'library/StatCards/Button'
import { useTranslation } from 'react-i18next'

export const RewardCalculator = ({ onClick }: { onClick: () => void }) => {
  const { t } = useTranslation('pages')

  const params = {
    Icon: (
      <FontAwesomeIcon
        icon={faCalculator}
        color="var(--accent-color-primary"
        style={{ marginLeft: '0.35rem', height: '2.75rem' }}
      />
    ),
    label: t('rewards.useCustomAmount'),
    title: t('rewards.rewardsCalculator'),
    onClick,
  }

  return <Button {...params} />
}
