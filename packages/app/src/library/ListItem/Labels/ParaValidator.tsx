// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCubes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTooltip } from 'contexts/Tooltip'
import { useValidators } from 'contexts/Validators/ValidatorEntries'
import { useTranslation } from 'react-i18next'
import { TooltipArea } from 'ui-core/base'
import { Label } from 'ui-core/list'
import type { ParaValidatorProps } from '../types'

export const ParaValidator = ({ address }: ParaValidatorProps) => {
  const { t } = useTranslation('app')
  const { sessionParaValidators } = useValidators()
  const { setTooltipTextAndOpen } = useTooltip()

  const tooltipText = t('validatingParachainBlocks')

  if (!sessionParaValidators?.includes(address || '')) {
    return null
  }

  return (
    <Label>
      <TooltipArea
        text={tooltipText}
        onMouseMove={() => setTooltipTextAndOpen(tooltipText)}
      />
      <FontAwesomeIcon icon={faCubes} transform="shrink-1" />
    </Label>
  )
}
