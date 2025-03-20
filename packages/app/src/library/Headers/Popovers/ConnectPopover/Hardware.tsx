// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCheck, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import type { FunctionComponent, SVGProps } from 'react'
import { ConnectItem } from 'ui-core/popover'

export const Hardware = ({
  active,
  onClick,
  Svg,
  title,
  websiteUrl,
  websiteText,
}: {
  active: boolean
  onClick: () => void
  Svg: FunctionComponent<SVGProps<SVGSVGElement>>
  title: string
  websiteUrl: string
  websiteText: string
}) => (
  <ConnectItem.Item
    asButton
    last={active}
    onClick={() => {
      onClick()
    }}
  >
    <div>
      <ConnectItem.Logo Svg={Svg} />
    </div>
    <div>
      <div>
        <h3>{title}</h3>
        <ConnectItem.WebUrl url={websiteUrl} text={websiteText} />
      </div>
      <ConnectItem.Icon faIcon={active ? faCheck : faChevronRight} />
    </div>
  </ConnectItem.Item>
)
