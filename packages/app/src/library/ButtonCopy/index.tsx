// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useTheme } from 'contexts/Themes'
import { ButtonCopy as Wrapper } from 'ui-buttons'
import type { ButtonCopyProps } from 'ui-buttons/src/types'

export const ButtonCopy = (props: ButtonCopyProps) => {
  const { themeElementRef } = useTheme()

  return (
    <Wrapper
      tooltipPortalContainer={themeElementRef.current || undefined}
      {...props}
    />
  )
}
