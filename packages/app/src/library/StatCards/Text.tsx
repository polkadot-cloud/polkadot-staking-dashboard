// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useHelp } from 'contexts/Help'
import { ButtonHelp } from 'ui-buttons'
import { Stat } from 'ui-core/base'
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
    <Stat.Card>
      <div>
        <Stat.Content>
          <Stat.Title primary={primary}>
            {value}
            {secondaryValue ? <span>{secondaryValue}</span> : null}
          </Stat.Title>
          <Stat.Subtitle>
            {label}
            {helpKey !== undefined ? (
              <ButtonHelp marginLeft onClick={() => openHelp(helpKey)} />
            ) : null}
          </Stat.Subtitle>
        </Stat.Content>
      </div>
    </Stat.Card>
  )
}
