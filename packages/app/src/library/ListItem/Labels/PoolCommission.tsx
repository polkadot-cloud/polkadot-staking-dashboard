// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useTooltip } from 'contexts/Tooltip'
import { TooltipTrigger } from 'library/ListItem/Wrappers'
import { useTranslation } from 'react-i18next'
import { Label } from 'ui-core/list'

export const PoolCommission = ({ commission }: { commission: string }) => {
  const { t } = useTranslation('library')
  const { setTooltipTextAndOpen } = useTooltip()

  const tooltipText = t('poolCommission')

  if (!commission) {
    return null
  }

  return (
    <Label>
      <TooltipTrigger
        className="tooltip-trigger-element"
        data-tooltip-text={tooltipText}
        onMouseMove={() => setTooltipTextAndOpen(tooltipText)}
      />
      {commission}
    </Label>
  )
}
