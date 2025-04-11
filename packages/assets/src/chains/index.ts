// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ChainIcons, NetworkId } from 'types'
import PolkadotTokenSVG from '../token/dot.svg?react'
import KusamaTokenSVG from '../token/ksm.svg?react'
import WestendTokenSVG from '../token/wnd.svg?react'
import KusamaIconSVG from './kusamaIcon.svg?react'
import KusamaInlineSVG from './kusamaInline.svg?react'
import PolkadotIconSVG from './polkadotIcon.svg?react'
import PolkadotInlineSVG from './polkadotInline.svg?react'
import WestendIconSVG from './westendIcon.svg?react'
import WestendInlineSVG from './westendInline.svg?react'

export const chainIcons: Record<NetworkId, ChainIcons> = {
  polkadot: {
    icon: PolkadotIconSVG,
    token: PolkadotTokenSVG,
    inline: {
      svg: PolkadotInlineSVG,
      size: '1.05em',
    },
  },
  kusama: {
    icon: KusamaIconSVG,
    token: KusamaTokenSVG,
    inline: {
      svg: KusamaInlineSVG,
      size: '1.3em',
    },
  },
  westend: {
    icon: WestendIconSVG,
    token: WestendTokenSVG,
    inline: {
      svg: WestendInlineSVG,
      size: '0.96em',
    },
  },
}
