// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useHelp } from 'contexts/Help'
import { ButtonHelp } from 'ui-buttons'
import { Stat } from 'ui-core/base'
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
    <Stat.Button>
      <button type="button" onClick={() => onClick()}>
        <Stat.Graphic>{Icon}</Stat.Graphic>
        <Stat.Content>
          <Stat.Title semibold>{title}</Stat.Title>
          <Stat.Subtitle primary>
            {label}{' '}
            {helpKey !== undefined ? (
              <ButtonHelp marginLeft onClick={() => openHelp(helpKey)} />
            ) : null}
          </Stat.Subtitle>
        </Stat.Content>
      </button>
    </Stat.Button>
  )
}
