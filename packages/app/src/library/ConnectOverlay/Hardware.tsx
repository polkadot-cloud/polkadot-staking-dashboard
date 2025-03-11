// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { faCheck, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import type {
  Dispatch,
  FunctionComponent,
  SetStateAction,
  SVGProps,
} from 'react'
import { ConnectItem } from 'ui-core/popover'

export const Hardware = ({
  active,
  setSelectedConnectItem,
  Svg,
  title,
  websiteUrl,
  websiteText,
}: {
  active: boolean
  setSelectedConnectItem: Dispatch<SetStateAction<string | undefined>>
  Svg: FunctionComponent<SVGProps<SVGSVGElement>>
  title: string
  websiteUrl: string
  websiteText: string
}) => (
  <ConnectItem.Item
    asButton
    last={active}
    onClick={() => {
      setSelectedConnectItem(active ? undefined : 'polkadot_vault')
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
