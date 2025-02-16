// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useTheme } from 'contexts/Themes'
import { useTranslation } from 'react-i18next'
import { ButtonCopy as Wrapper } from 'ui-buttons'
import type { ButtonCopyProps } from 'ui-buttons/src/types'

export const ButtonCopy = (
  props: Omit<ButtonCopyProps, 'tooltipText' | 'tooltipPortalContainer'>
) => {
  const { t } = useTranslation('library')
  const { themeElementRef } = useTheme()

  return (
    <Wrapper
      {...props}
      tooltipPortalContainer={themeElementRef.current || undefined}
      tooltipText={{
        copy: t('copyAddress'),
        copied: t('copied'),
      }}
    />
  )
}
