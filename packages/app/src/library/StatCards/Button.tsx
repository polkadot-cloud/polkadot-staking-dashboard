// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useHelp } from 'contexts/Help'
import { ButtonHelp } from 'ui-buttons'
import {
  StatButton,
  StatContent,
  StatGraphic,
  StatSubtitle,
  StatTitle,
} from 'ui-core/base'
import type { ButtonProps } from './types'

export const Button = ({
  Icon,
  label,
  title,
  helpKey,
  onClick,
}: ButtonProps) => {
  const { openHelp } = useHelp()

  return (
    <StatButton>
      <button type="button" onClick={() => onClick()}>
        <StatGraphic>{Icon}</StatGraphic>
        <StatContent>
          <StatTitle semibold>{title}</StatTitle>
          <StatSubtitle primary>
            {label}{' '}
            {helpKey !== undefined ? (
              <ButtonHelp marginLeft onClick={() => openHelp(helpKey)} />
            ) : null}
          </StatSubtitle>
        </StatContent>
      </button>
    </StatButton>
  )
}
