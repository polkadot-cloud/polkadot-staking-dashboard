// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useHelp } from 'contexts/Help'
import { ButtonHelp } from 'ui-buttons'
import { StatCard } from 'ui-core/base'
import { StatBoxContent, TextTitleWrapper } from './Wrapper'
import type { TextProps } from './types'

export const Text = ({
  label,
  value,
  secondaryValue,
  helpKey,
  primary,
}: TextProps) => {
  const help = helpKey !== undefined
  const { openHelp } = useHelp()
  return (
    <StatCard>
      <StatBoxContent>
        <div className="labels">
          <TextTitleWrapper $primary={primary === true}>
            {value}
            {secondaryValue ? <span>{secondaryValue}</span> : null}
          </TextTitleWrapper>
          <h4>
            {label}
            {help ? (
              <ButtonHelp marginLeft onClick={() => openHelp(helpKey)} />
            ) : null}
          </h4>
        </div>
      </StatBoxContent>
    </StatCard>
  )
}
