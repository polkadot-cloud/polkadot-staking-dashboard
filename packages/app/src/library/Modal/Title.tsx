// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useHelp } from 'contexts/Help'
import type { FunctionComponent, SVGProps } from 'react'
import type { CSSProperties } from 'styled-components'
import type { AnyJson } from 'types'
import { ButtonHelp } from 'ui-buttons'
import { Title as Wrapper } from 'ui-core/modal'
import { Close } from 'ui-overlay'
import { TitleWrapper } from './Wrappers'

interface TitleProps {
  title?: string
  icon?: IconProp
  Svg?: FunctionComponent<SVGProps<AnyJson>>
  fixed?: boolean
  helpKey?: string
  style?: CSSProperties
}

export const Title = ({
  helpKey,
  title,
  icon,
  fixed,
  Svg,
  style,
}: TitleProps) => {
  const { openHelp } = useHelp()

  const graphic = Svg ? (
    <Svg style={{ width: '1.5rem', height: '1.5rem' }} />
  ) : icon ? (
    <FontAwesomeIcon transform="grow-3" icon={icon} />
  ) : null

  return (
    <>
      <Close />
      <TitleWrapper $fixed={fixed || false} style={{ ...style }}>
        <div>
          {graphic}
          {title && (
            <Wrapper>
              {title}
              {helpKey ? (
                <ButtonHelp marginLeft onClick={() => openHelp(helpKey)} />
              ) : null}
            </Wrapper>
          )}
        </div>
      </TitleWrapper>
    </>
  )
}
