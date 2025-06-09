// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useHelp } from 'contexts/Help'
import { usePlugins } from 'contexts/Plugins'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { useStaking } from 'contexts/Staking'
import { useSyncing } from 'hooks/useSyncing'
import { ButtonHelp } from 'ui-buttons'
import classes from './index.module.scss'
import type { StatusLabelProps } from './types'

export const StatusLabel = ({
  title,
  helpKey,
  hideIcon,
  statusFor,
  topOffset = '40%',
  status = 'sync_or_setup',
}: StatusLabelProps) => {
  const { openHelp } = useHelp()
  const { syncing } = useSyncing()
  const { plugins } = usePlugins()
  const { inPool } = useActivePool()
  const { isNominator } = useStaking()

  // syncing or not staking
  if (status === 'sync_or_setup') {
    if (syncing || isNominator || inPool) {
      return null
    }
  }

  if (status === 'active_service' && statusFor) {
    if (plugins.includes(statusFor)) {
      return null
    }
  }

  return (
    <div
      className={classes.wrapper}
      style={topOffset !== '50%' ? { top: topOffset } : undefined}
    >
      <div>
        {hideIcon !== true && <FontAwesomeIcon icon={faExclamationTriangle} />}
        <h2>
          &nbsp;&nbsp;
          {title}
          {helpKey ? (
            <span>
              <ButtonHelp
                marginLeft
                onClick={() => openHelp(helpKey)}
                background="secondary"
              />
            </span>
          ) : null}
        </h2>
      </div>
    </div>
  )
}
