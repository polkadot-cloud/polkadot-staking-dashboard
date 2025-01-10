// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faChartLine } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useOverlay } from 'ui-overlay'
import type { MetricsProps } from '../types'

export const Metrics = ({ display, address }: MetricsProps) => {
  const { openCanvas } = useOverlay().canvas

  return (
    <div className="label">
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
        <FontAwesomeIcon icon={faChartLine} transform="shrink-2" />
      </button>
    </div>
  )
}
