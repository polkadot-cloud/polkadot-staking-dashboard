// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faUsers } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTooltip } from 'contexts/Tooltip'
import { useTranslation } from 'react-i18next'
import { TooltipArea } from 'ui-core/base'
import { Label } from 'ui-core/list'

export const Members = ({ members }: { members: string }) => {
  const { t } = useTranslation('app')
  const { setTooltipTextAndOpen } = useTooltip()

  const tooltipText = t('poolMembers')

  return (
    <Label>
      <TooltipArea
        text={tooltipText}
        onMouseMove={() => setTooltipTextAndOpen(tooltipText)}
      />
      <FontAwesomeIcon icon={faUsers} />
      &nbsp;{members}
    </Label>
  )
}
