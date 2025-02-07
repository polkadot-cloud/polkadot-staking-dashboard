// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useHelp } from 'contexts/Help'
import { ButtonHelp } from 'ui-buttons'
import { StatCard, StatSubtitle, StatTitle } from 'ui-core/base'
import { StatContent } from './Wrapper'
import type { TextProps } from './types'

export const Text = ({
  label,
  value,
  secondaryValue,
  helpKey,
  primary,
}: TextProps) => {
  const { openHelp } = useHelp()

  return (
    <StatCard>
      <StatContent>
        <div className="labels">
          <StatTitle primary={primary}>
            {value}
            {secondaryValue ? <span>{secondaryValue}</span> : null}
          </StatTitle>
          <StatSubtitle>
            {label}
            {helpKey !== undefined ? (
              <ButtonHelp marginLeft onClick={() => openHelp(helpKey)} />
            ) : null}
          </StatSubtitle>
        </div>
      </StatContent>
    </StatCard>
  )
}
