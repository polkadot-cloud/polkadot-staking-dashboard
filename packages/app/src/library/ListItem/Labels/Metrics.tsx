// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useTranslation } from 'react-i18next'
import { useOverlay } from 'ui-overlay'
import type { MetricsProps } from '../types'

export const Metrics = ({ display, address }: MetricsProps) => {
  const { t } = useTranslation()
  const { openCanvas } = useOverlay().canvas

  return (
    <div className="label button-with-text">
      <button
        type="button"
        onClick={() =>
          openCanvas({
            key: 'ValidatorMetrics',
            options: {
              validator: address,
              identity: display,
            },
            size: 'xl',
          })
        }
      >
        {t('metrics', { ns: 'library' })}
      </button>
    </div>
  )
}
