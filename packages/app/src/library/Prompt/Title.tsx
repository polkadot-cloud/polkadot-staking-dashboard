// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useHelp } from 'contexts/Help'
import { usePrompt } from 'contexts/Prompt'
import type { FunctionComponent, SVGProps } from 'react'
import { ButtonHelp } from 'ui-buttons'
import { Close } from 'ui-core/modal'
import { TitleWrapper } from './Wrappers'

interface TitleProps {
  title: string
  icon?: IconProp
  Svg?: FunctionComponent<SVGProps<SVGElement>>
  helpKey?: string
  hideDone?: boolean
}

export const Title = ({ helpKey, title, icon, Svg, hideDone }: TitleProps) => {
  const { closePrompt } = usePrompt()
  const { openHelp } = useHelp()

  const graphic = Svg ? (
    <Svg style={{ width: '1.5rem', height: '1.5rem' }} />
  ) : icon ? (
    <FontAwesomeIcon transform="grow-3" icon={icon} />
  ) : null

  return (
    <TitleWrapper>
      <div>
        {graphic}
        <h2>
          {title}
          {helpKey ? <ButtonHelp onClick={() => openHelp(helpKey)} /> : null}
        </h2>
      </div>
      {hideDone !== true ? (
        <div>
          <Close onClose={closePrompt} />
        </div>
      ) : null}
    </TitleWrapper>
  )
}
