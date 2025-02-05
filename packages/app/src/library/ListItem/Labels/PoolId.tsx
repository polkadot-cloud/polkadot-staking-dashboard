// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faHashtag } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTooltip } from 'contexts/Tooltip'
import { useTranslation } from 'react-i18next'
import { TooltipArea } from 'ui-core/base'
import { Label } from 'ui-core/list'

export const PoolId = ({ id }: { id: number }) => {
  const { t } = useTranslation('library')
  const { setTooltipTextAndOpen } = useTooltip()

  const tooltipText = t('poolId')

  return (
    <Label>
      <TooltipArea
        text={tooltipText}
        onMouseMove={() => setTooltipTextAndOpen(tooltipText)}
      />
      <FontAwesomeIcon icon={faHashtag} />
      &nbsp;{id}
    </Label>
  )
}
