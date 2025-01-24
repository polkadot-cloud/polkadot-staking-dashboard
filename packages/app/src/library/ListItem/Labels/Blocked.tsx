// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faUserSlash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTooltip } from 'contexts/Tooltip'
import { TooltipTrigger } from 'library/ListItem/Wrappers'
import { useTranslation } from 'react-i18next'
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
        <TooltipTrigger
          className="tooltip-trigger-element"
          data-tooltip-text={tooltipText}
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
