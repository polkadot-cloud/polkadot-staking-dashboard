// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNetwork } from 'contexts/Network'
import { useJoinPools } from 'contexts/Pools/JoinPools'
import { usePoolPerformance } from 'contexts/Pools/PoolPerformance'
import { useStaking } from 'contexts/Staking'
import { CallToActionWrapper } from 'library/CallToAction'
import { CallToActionLoader } from 'library/Loader/CallToAction'
import { PoolSync } from 'library/PoolSync'
import { StyledLoader } from 'library/PoolSync/Loader'
import { useTranslation } from 'react-i18next'
import { useOverlay } from 'ui-overlay'
import { registerSaEvent } from 'utils'
import { usePoolsTabs } from '../context'
import type { NewMemberProps } from './types'
import { useStatusButtons } from './useStatusButtons'

export const NewMember = ({ syncing }: NewMemberProps) => {
  const { t } = useTranslation()
  const { network } = useNetwork()
  const { inSetup } = useStaking()
  const { poolsForJoin } = useJoinPools()
  const { setActiveTab } = usePoolsTabs()
  const { openCanvas } = useOverlay().canvas
  const { startJoinPoolFetch } = useJoinPools()
  const { getPoolPerformanceTask } = usePoolPerformance()
  const { getJoinDisabled, getCreateDisabled } = useStatusButtons()

  // Get the pool performance task to determine if performance data is ready.
  const poolJoinPerformanceTask = getPoolPerformanceTask('pool_join')

  // Alias for create button disabled state
  const createDisabled = getCreateDisabled() || !inSetup()

  // Disable opening the canvas if data is not ready.
  const joinButtonDisabled =
    getJoinDisabled() || !poolsForJoin.length || !inSetup()

  return (
    <CallToActionWrapper>
      <div className="inner">
        {syncing ? (
          <CallToActionLoader />
        ) : (
          <>
            <section className="fixedWidth">
              <div className="buttons">
                <div
                  className={`button primary standalone${joinButtonDisabled ? ` disabled` : ``}${poolJoinPerformanceTask.status === 'synced' ? ` pulse` : ``}`}
                >
                  <button
                    onClick={() => {
                      // Start sync process, otherwise, open canvas.
                      if (poolJoinPerformanceTask.status === 'unsynced') {
                        startJoinPoolFetch()
                      }
                      registerSaEvent(
                        `${network.toLowerCase()}_pool_join_button_pressed`
                      )

                      openCanvas({
                        key: 'JoinPool',
                        options: {},
                        size: 'xl',
                      })
                    }}
                    disabled={joinButtonDisabled}
                  >
                    {poolJoinPerformanceTask.status === 'unsynced' && (
                      <>
                        {t('pools.joinPool', { ns: 'pages' })}
                        <FontAwesomeIcon icon={faUserPlus} />
                      </>
                    )}

                    {poolJoinPerformanceTask.status === 'syncing' && (
                      <>
                        {t('syncingPoolData', { ns: 'library' })}{' '}
                        <StyledLoader />
                      </>
                    )}

                    {poolJoinPerformanceTask.status === 'synced' && (
                      <>
                        {t('readyToJoinPool', { ns: 'library' })}
                        <FontAwesomeIcon icon={faUserPlus} />
                      </>
                    )}
                    <PoolSync performanceKey="pool_join" />
                  </button>
                </div>
              </div>
            </section>
            <section>
              <div className="buttons">
                <div
                  className={`button standalone secondary ${createDisabled ? ` disabled` : ``}`}
                >
                  <button
                    onClick={() => {
                      registerSaEvent(
                        `${network.toLowerCase()}_pool_create_button_pressed`
                      )

                      openCanvas({
                        key: 'CreatePool',
                        options: {},
                        size: 'xl',
                      })
                    }}
                    disabled={createDisabled}
                  >
                    {t('pools.createPool', { ns: 'pages' })}
                  </button>
                </div>
                <div className={`button standalone secondary`}>
                  <button onClick={() => setActiveTab(1)}>
                    {t('pools.browsePools', { ns: 'pages' })}
                  </button>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </CallToActionWrapper>
  )
}
