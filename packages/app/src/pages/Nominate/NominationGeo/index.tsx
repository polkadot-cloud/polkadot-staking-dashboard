// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useNetwork } from 'contexts/Network'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { usePlugins } from 'contexts/Plugins'

import { PolkawatchApi } from '@polkawatch/ddp-client'
import { PolkaWatch } from 'controllers/PolkaWatch'
import type { ChainMetadata, NominatorDetail } from './types'

import { AnalyzedDays } from './Stats/AnalyzedDays'
import { AnalyzedEras } from './Stats/AnalyzedEras'
import { AnalyzedPayouts } from './Stats/AnalyzedPayouts'

import { useHelp } from 'contexts/Help'
import { useStaking } from 'contexts/Staking'
import { CardWrapper } from 'library/Card/Wrappers'
import { GeoDonut } from 'library/Graphs/GeoDonut'
import { NominatorGeoWrapper } from 'library/Graphs/Wrapper'
import { StatusLabel } from 'library/StatusLabel'
import { ButtonHelp } from 'ui-buttons'
import { CardHeader, Page, Stat } from 'ui-core/base'
import { NominationGeoList } from './NominationGeoList'
import { GraphsWrapper } from './Wrappers'

export const NominationGeo = () => {
  const { t } = useTranslation()
  const { openHelp } = useHelp()
  const { network } = useNetwork()
  const { isNominating } = useStaking()
  const { pluginEnabled } = usePlugins()
  const { activeAddress } = useActiveAccounts()

  const enabled = pluginEnabled('polkawatch')

  // Polkawatch Analytics chain metadata, contains information about how the decentralization is 1
  // computed for this particular blockchain
  const [networkMeta, setNetworkMeta] = useState<ChainMetadata>(
    {} as ChainMetadata
  )

  const [nominationDetail, setNominationDetail] = useState<NominatorDetail>(
    {} as NominatorDetail
  )

  const [analyticsAvailable, setAnalyticsAvailable] = useState<boolean>(true)

  const networkSupported = PolkaWatch.SUPPORTED_NETWORKS.includes(network)

  // Min height of the graph container.
  const graphContainerMinHeight = analyticsAvailable ? 320 : 25

  // Donut size and legend height.
  const donutSize = '300px'
  const legendHeight = 50
  const maxLabelLen = 10

  // Status label config.
  const showDisabledLabel = !enabled
  const showNotNominatingLabel = enabled && !isNominating()
  const showNotAvailableLabel = enabled && !analyticsAvailable && isNominating()

  // Whether to interact with Polkawatch API.
  const callPolkawatchApi = networkSupported && enabled && isNominating()

  useEffect(() => {
    if (callPolkawatchApi) {
      const polkaWatchApi = new PolkawatchApi(PolkaWatch.apiConfig(network))
      polkaWatchApi
        .ddpIpfsAboutChain()
        .then((response) => {
          setAnalyticsAvailable(true)
          setNetworkMeta(response.data)
        })
        .catch(() => {
          setNetworkMeta({} as ChainMetadata)
          setAnalyticsAvailable(false)
        })
    } else {
      setNetworkMeta({} as ChainMetadata)
      setAnalyticsAvailable(false)
    }
  }, [activeAddress, network, enabled, isNominating()])

  // NOTE: The list of dependencies assume that changing network
  // triggers a change of account also (i.e. different network prefix).
  useEffect(() => {
    if (callPolkawatchApi) {
      const polkaWatchApi = new PolkawatchApi(PolkaWatch.apiConfig(network))
      polkaWatchApi
        .ddpIpfsNominatorDetail({
          lastDays: 30,
          nominator: activeAddress,
        })
        .then((response) => {
          setAnalyticsAvailable(true)
          setNominationDetail(response.data)
        })
        .catch(() => {
          setNominationDetail({} as NominatorDetail)
          setAnalyticsAvailable(false)
        })
    } else {
      setNominationDetail({} as NominatorDetail)
      setAnalyticsAvailable(false)
    }
  }, [activeAddress, network, enabled, isNominating()])

  return (
    <>
      <Stat.Row>
        <AnalyzedDays />
        <AnalyzedEras meta={networkMeta} />
        <AnalyzedPayouts data={nominationDetail} />
      </Stat.Row>
      <Page.Row>
        <CardWrapper>
          <CardHeader>
            <h4>
              {t('payoutDistribution', { ns: 'pages' })}
              <ButtonHelp
                marginLeft
                onClick={() => openHelp('Nomination Payout Distribution')}
              />
            </h4>
            <h2>{t('byRegionCountryNetwork', { ns: 'pages' })}</h2>
          </CardHeader>
          <GraphsWrapper style={{ minHeight: graphContainerMinHeight }}>
            {showDisabledLabel && (
              <StatusLabel
                status="active_service"
                statusFor="polkawatch"
                title={t('polkawatchDisabled', {
                  ns: 'pages',
                })}
              />
            )}
            {showNotNominatingLabel && (
              <StatusLabel
                status="no_data"
                title={t('notNominating', {
                  ns: 'app',
                })}
              />
            )}
            {showNotAvailableLabel && (
              <StatusLabel
                status="no_analytic_data"
                title={
                  networkSupported
                    ? t('analyticsNotAvailable', {
                        ns: 'pages',
                      })
                    : t('analyticsNotSupported', {
                        ns: 'pages',
                      })
                }
              />
            )}
            {enabled && analyticsAvailable && (
              <>
                <NominatorGeoWrapper>
                  <GeoDonut
                    title={t('rewards')}
                    series={nominationDetail.topRegionalDistributionChart}
                    maxHeight={donutSize}
                    width={donutSize}
                    legendHeight={legendHeight}
                    maxLabelLen={0}
                  />
                </NominatorGeoWrapper>
                <NominatorGeoWrapper>
                  <GeoDonut
                    title={t('rewards')}
                    series={nominationDetail.topCountryDistributionChart}
                    maxHeight={donutSize}
                    width={donutSize}
                    legendHeight={legendHeight}
                    maxLabelLen={maxLabelLen}
                  />
                </NominatorGeoWrapper>
                <NominatorGeoWrapper>
                  <GeoDonut
                    title={t('rewards')}
                    series={nominationDetail.topNetworkDistributionChart}
                    maxHeight={donutSize}
                    width={donutSize}
                    legendHeight={legendHeight}
                    maxLabelLen={maxLabelLen}
                  />
                </NominatorGeoWrapper>
              </>
            )}
          </GraphsWrapper>
        </CardWrapper>
      </Page.Row>
      {nominationDetail?.nodeDistributionDetail && (
        <Page.Row>
          <CardWrapper>
            <NominationGeoList
              title={t('decentralizationPerNomination', {
                ns: 'pages',
              })}
              data={nominationDetail}
            />
          </CardWrapper>
        </Page.Row>
      )}
    </>
  )
}
