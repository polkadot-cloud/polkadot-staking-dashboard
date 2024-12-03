// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { AnyJson } from '@w3ux/types'
import { useHelp } from 'contexts/Help'
import CrossSVG from 'img/cross.svg?react'
import { useOverlay } from 'kits/Overlay/Provider'
import type { FunctionComponent, SVGProps } from 'react'
import type { CSSProperties } from 'styled-components'
import { ButtonHelp } from 'ui-buttons'
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
  const { setModalStatus } = useOverlay().modal
  const { openHelp } = useHelp()

  const graphic = Svg ? (
    <Svg style={{ width: '1.5rem', height: '1.5rem' }} />
  ) : icon ? (
    <FontAwesomeIcon transform="grow-3" icon={icon} />
  ) : null

  return (
    <TitleWrapper $fixed={fixed || false} style={{ ...style }}>
      <div>
        {graphic}
        {title && (
          <h2>
            {title}
            {helpKey ? (
              <ButtonHelp marginLeft onClick={() => openHelp(helpKey)} />
            ) : null}
          </h2>
        )}
      </div>
      <div>
        <button type="button" onClick={() => setModalStatus('closing')}>
          <CrossSVG style={{ width: '1.25rem', height: '1.25rem' }} />
        </button>
      </div>
    </TitleWrapper>
  )
}
