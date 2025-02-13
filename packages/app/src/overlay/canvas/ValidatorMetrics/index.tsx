// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useSize } from '@w3ux/hooks'
import { Polkicon } from '@w3ux/react-polkicon'
import BigNumber from 'bignumber.js'
import { useApi } from 'contexts/Api'
import { useHelp } from 'contexts/Help'
import { useNetwork } from 'contexts/Network'
import { usePlugins } from 'contexts/Plugins'
import { useStaking } from 'contexts/Staking'
import { useUi } from 'contexts/UI'
import { useValidators } from 'contexts/Validators/ValidatorEntries'
import { formatSize } from 'library/Graphs/Utils'
import { StatusLabel } from 'library/StatusLabel'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { ButtonHelp, ButtonPrimary } from 'ui-buttons'
import {
  AccountTitle,
  GraphContainer,
  GraphInner,
  Head,
  HeadTags,
  Main,
  Stat,
  Subheading,
} from 'ui-core/canvas'
import { useOverlay } from 'ui-overlay'
import { planckToUnitBn } from 'utils'
import { ActiveGraph as ActiveGraphEraPoints } from './EraPoints/ActiveGraph'
import { InactiveGraph as InactiveGraphEraPoints } from './EraPoints/InactiveGraph'
import { ActiveGraph as ActiveGraphRewards } from './Rewards/ActiveGraph'
import { InactiveGraph as InactiveGraphRewards } from './Rewards/InactiveGraph'

export const ValidatorMetrics = () => {
  const { t } = useTranslation()
  const {
    eraStakers: { stakers },
  } = useStaking()
  const {
    closeCanvas,
    config: { options },
  } = useOverlay().canvas
  const {
    network,
    networkData: {
      units,
      unit,
      brand: { token: Token },
    },
  } = useNetwork()
  const { activeEra } = useApi()
  const { openHelp } = useHelp()
  const { containerRefs } = useUi()
  const { pluginEnabled } = usePlugins()
  const { getValidators } = useValidators()

  const validator = options!.validator
  const identity = options!.identity

  // is the validator in the active era
  const validatorInEra = stakers.find((s) => s.address === validator) || null

  let validatorOwnStake = new BigNumber(0)
  let otherStake = new BigNumber(0)
  if (validatorInEra) {
    const { others, own } = validatorInEra
    others.forEach(({ value }) => {
      otherStake = otherStake.plus(value)
    })
    if (own) {
      validatorOwnStake = new BigNumber(own)
    }
  }

  const GRAPH_HEIGHT = 250

  const prefs = getValidators().find(
    (entry) => entry.address === validator
  )?.prefs
  const commission = prefs?.commission ?? 0

  // Era points graph ref & sizing
  const graphEraPointsRef = useRef<HTMLDivElement | null>(null)
  const sizeEraPoints = useSize(graphEraPointsRef, {
    outerElement: containerRefs?.mainInterface,
  })
  const graphSizeEraPoints = formatSize(sizeEraPoints, GRAPH_HEIGHT)

  // token earned graph ref & sizing
  const graphRewardsRef = useRef<HTMLDivElement | null>(null)
  const sizeRewards = useSize(graphRewardsRef, {
    outerElement: containerRefs?.mainInterface,
  })
  const graphSizeRewards = formatSize(sizeRewards, GRAPH_HEIGHT)

  return (
    <Main>
      <Head>
        <ButtonPrimary
          text={t('close', { ns: 'modals' })}
          size="lg"
          onClick={() => closeCanvas()}
          style={{ marginLeft: '1.1rem' }}
        />
      </Head>
      <AccountTitle>
        <div>
          <div>
            <Polkicon
              address={validator}
              background="transparent"
              fontSize="4rem"
            />
          </div>
          <div>
            <div className="title">
              <h1>{identity}</h1>
            </div>
            <HeadTags>
              <h3>
                <span>
                  {commission}% {t('commission', { ns: 'modals' })}
                </span>
              </h3>
            </HeadTags>
          </div>
        </div>
      </AccountTitle>
      <GraphContainer>
        <Subheading>
          <h4>
            <Stat withIcon>
              <Token />
              {t('selfStake', { ns: 'modals' })}:{' '}
              {planckToUnitBn(validatorOwnStake, units).toFormat()} {unit}
            </Stat>
            <Stat withIcon>
              <Token />
              {t('nominatorStake', { ns: 'modals' })}:{' '}
              {planckToUnitBn(otherStake, units).decimalPlaces(0).toFormat()}{' '}
              {unit}
            </Stat>
          </h4>
        </Subheading>
        <div>
          <Subheading>
            <h3>
              {t('recentPerformance', { ns: 'library' })}
              <ButtonHelp
                outline
                marginLeft
                onClick={() => openHelp('Era Points')}
              />
            </h3>
          </Subheading>
          <GraphInner
            ref={graphEraPointsRef}
            width={graphSizeEraPoints.width}
            height={graphSizeEraPoints.height}
          >
            {pluginEnabled('staking_api') ? (
              <ActiveGraphEraPoints
                network={network}
                validator={validator}
                fromEra={BigNumber.max(activeEra.index.minus(1), 0).toNumber()}
                width={graphSizeEraPoints.width}
                height={graphSizeEraPoints.height}
              />
            ) : (
              <>
                <StatusLabel
                  status="active_service"
                  statusFor="staking_api"
                  title={t('common.stakingApiDisabled', { ns: 'pages' })}
                  topOffset="37%"
                />
                <InactiveGraphEraPoints
                  width={graphSizeEraPoints.width}
                  height={graphSizeEraPoints.height}
                />
              </>
            )}
          </GraphInner>
          <Subheading style={{ marginTop: '2rem' }}>
            <h3>
              {t('rewardHistory', { ns: 'library' })}
              <ButtonHelp
                outline
                marginLeft
                onClick={() => openHelp('Validator Reward History')}
              />
            </h3>
          </Subheading>
          <GraphInner
            ref={graphRewardsRef}
            width={graphSizeRewards.width}
            height={graphSizeRewards.height}
          >
            {pluginEnabled('staking_api') ? (
              <ActiveGraphRewards
                network={network}
                validator={validator}
                fromEra={BigNumber.max(activeEra.index.minus(1), 0).toNumber()}
                width={graphSizeRewards.width}
                height={graphSizeRewards.height}
              />
            ) : (
              <>
                <StatusLabel
                  status="active_service"
                  statusFor="staking_api"
                  title={t('common.stakingApiDisabled', { ns: 'pages' })}
                  topOffset="37%"
                />
                <InactiveGraphRewards
                  width={graphSizeRewards.width}
                  height={graphSizeRewards.height}
                />
              </>
            )}
          </GraphInner>
        </div>
      </GraphContainer>
    </Main>
  )
}
