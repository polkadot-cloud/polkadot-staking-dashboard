// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faChartPie } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTooltip } from 'contexts/Tooltip'
import { useTranslation } from 'react-i18next'
import { TooltipArea } from 'ui-core/base'
import { Label } from 'ui-core/list'

export const RewardShare = ({ share }: { share: number }) => {
  const { t } = useTranslation('pages')
  const { setTooltipTextAndOpen } = useTooltip()

  const tooltipText = t('decentralization.nominationShareInRewards')

  return (
    <Label>
      <TooltipArea
        text={tooltipText}
        onMouseMove={() => setTooltipTextAndOpen(tooltipText)}
      />
      <FontAwesomeIcon icon={faChartPie} style={{ marginRight: '0.25rem' }} />
      {share}%{' '}
    </Label>
  )
}
