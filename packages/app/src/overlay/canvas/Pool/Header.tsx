// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons'
import { Polkicon } from '@w3ux/react-polkicon'
import { PerbillMultiplier } from 'consts'
import { PageTabs } from 'library/PageTabs'
import { useTranslation } from 'react-i18next'
import type { PoolState } from 'types'
import { ButtonPrimaryInvert } from 'ui-buttons'
import { AccountTitle, Head, HeadTags } from 'ui-core/canvas'
import type { HeaderProps } from './types'
export const Header = ({
  activeTab,
  bondedPool,
  poolCandidates,
  metadata,
  autoSelected,
  setActiveTab,
  setSelectedPoolId,
  providedPoolId,
}: HeaderProps) => {
  const { t } = useTranslation()
  const poolCommission = bondedPool?.commission?.current?.[0]

  // Randomly select a new pool to display
  const handleChooseNewPool = () => {
    // Remove current pool from filtered so it is not selected again
    const filteredPools = poolCandidates.filter(
      (pool) => Number(pool.id) !== Number(bondedPool.id)
    )
    const newCandidate =
      filteredPools[(filteredPools.length * Math.random()) << 0]?.id
    setSelectedPoolId(newCandidate)
  }

  // Pool state to tag class
  const getTagClass = (state: PoolState) => {
    switch (state) {
      case 'Blocked':
        return 'warning'
      case 'Destroying':
        return 'danger'
      default:
        return ''
    }
  }

  return (
    <>
      <Head>
        {providedPoolId === null && (
          <ButtonPrimaryInvert
            text={t('chooseAnotherPool', { ns: 'app' })}
            iconLeft={faArrowsRotate}
            onClick={() => handleChooseNewPool()}
            lg
          />
        )}
      </Head>
      <AccountTitle>
        <div>
          <div>
            <Polkicon
              address={bondedPool?.addresses.stash || ''}
              background="transparent"
              fontSize="4rem"
            />
          </div>
          <div>
            <div className="title">
              <h1>{metadata}</h1>
            </div>
            <HeadTags>
              <h3>
                {t('pool', { ns: 'app' })} {bondedPool.id}
                {['Blocked', 'Destroying'].includes(bondedPool.state) && (
                  <span className={getTagClass(bondedPool.state)}>
                    {t(bondedPool.state.toLowerCase(), { ns: 'app' })}
                  </span>
                )}
              </h3>
              {poolCommission && (
                <h3>
                  <span>
                    {poolCommission / PerbillMultiplier}%{' '}
                    {t('commission', { ns: 'modals' })}
                  </span>
                </h3>
              )}
              {autoSelected && (
                <h3>
                  <span>{t('autoSelected', { ns: 'app' })}</span>
                </h3>
              )}
            </HeadTags>
          </div>
        </div>
        <PageTabs
          sticky={false}
          tabs={[
            {
              title: t('overview', { ns: 'pages' }),
              active: activeTab === 0,
              onClick: () => setActiveTab(0),
            },
            {
              title: t('nominations', { ns: 'pages' }),
              active: activeTab === 1,
              onClick: () => setActiveTab(1),
            },
          ]}
          tabClassName="canvas"
          inline={true}
          colorSecondary={true}
        />
      </AccountTitle>
    </>
  )
}
