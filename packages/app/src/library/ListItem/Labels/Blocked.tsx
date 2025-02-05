// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faUserSlash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTooltip } from 'contexts/Tooltip'
import { useTranslation } from 'react-i18next'
import { TooltipArea } from 'ui-core/base'
import { Label } from 'ui-core/list'
import type { BlockedProps } from '../types'

export const Blocked = ({ prefs }: BlockedProps) => {
  const { t } = useTranslation('library')
  const blocked = prefs?.blocked ?? null
  const { setTooltipTextAndOpen } = useTooltip()

  const tooltipText = t('blockingNominations')

  return (
    blocked && (
      <Label>
        <TooltipArea
          text={tooltipText}
          onMouseMove={() => setTooltipTextAndOpen(tooltipText)}
        />
        <FontAwesomeIcon
          icon={faUserSlash}
          color="#d2545d"
          transform="shrink-1"
        />
      </Label>
    )
  )
}
