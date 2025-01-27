// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useTooltip } from 'contexts/Tooltip'
import { useValidators } from 'contexts/Validators/ValidatorEntries'
import { useTranslation } from 'react-i18next'
import { TooltipArea } from 'ui-core/base'
import { Label } from 'ui-core/list'

export const Quartile = ({ address }: { address: string }) => {
  const { t } = useTranslation()
  const { setTooltipTextAndOpen } = useTooltip()
  const { validatorEraPointsHistory } = useValidators()

  const quartile = validatorEraPointsHistory[address]?.quartile
  const tooltipText = `${t('dayPerformanceStanding', {
    count: 30,
    ns: 'library',
  })}`

  return (
    <Label>
      <TooltipArea
        text={tooltipText}
        onMouseMove={() => setTooltipTextAndOpen(tooltipText)}
        style={{ cursor: 'default' }}
      />
      {![100, undefined].includes(quartile)
        ? `${t('top', { ns: 'library' })} ${quartile}%`
        : ``}
    </Label>
  )
}
