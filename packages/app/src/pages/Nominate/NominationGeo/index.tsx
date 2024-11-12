// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useTranslation } from 'react-i18next';
import { StatBoxList } from 'library/StatBoxList';
import { useNetwork } from 'contexts/Network';
import { useEffect, useState } from 'react';

import { usePlugins } from 'contexts/Plugins';
import { useActiveAccounts } from 'contexts/ActiveAccounts';

import type { NominatorDetail, ChainMetadata } from './types';
import { PolkawatchApi } from '@polkawatch/ddp-client';
import { PolkaWatchController } from 'controllers/PolkaWatch';

import { AnalyzedPayouts } from './Stats/AnalyzedPayouts';
import { AnalyzedDays } from './Stats/AnalyzedDays';
import { AnalyzedEras } from './Stats/AnalyzedEras';

import { PageRow } from 'ui-structure';
import { CardHeaderWrapper, CardWrapper } from 'library/Card/Wrappers';
import { PluginLabel } from 'library/PluginLabel';
import { GraphWrapper } from 'library/Graphs/Wrapper';
import { GeoDonut } from 'library/Graphs/GeoDonut';
import { ButtonHelp } from 'ui-buttons';
import { useHelp } from 'contexts/Help';
import { NominationGeoList } from './NominationGeoList';
import { StatusLabel } from 'library/StatusLabel';
import { GraphsWrapper } from './Wrappers';
import { useStaking } from 'contexts/Staking';

export const NominationGeo = () => {
  const { t } = useTranslation();
  const { openHelp } = useHelp();
  const { network } = useNetwork();
  const { isNominating } = useStaking();
  const { pluginEnabled } = usePlugins();
  const { activeAccount } = useActiveAccounts();

  const enabled = pluginEnabled('polkawatch');

  // Polkawatch Analytics chain metadata, contains information about how the decentralization is 1
  // computed for this particular blockchain
  const [networkMeta, setNetworkMeta] = useState<ChainMetadata>(
    {} as ChainMetadata
  );

  const [nominationDetail, setNominationDetail] = useState<NominatorDetail>(
    {} as NominatorDetail
  );

  const [analyticsAvailable, setAnalyticsAvailable] = useState<boolean>(true);

  const networkSupported =
    PolkaWatchController.SUPPORTED_NETWORKS.includes(network);

  // Min height of the graph container.
  const graphContainerMinHeight = analyticsAvailable ? 320 : 25;

  // Donut size and legend height.
  const donutSize = '300px';
  const legendHeight = 50;
  const maxLabelLen = 10;

  // Status label config.
  const showDisabledLabel = !enabled;
  const showNotNominatingLabel = enabled && !isNominating();
  const showNotAvailableLabel =
    enabled && !analyticsAvailable && isNominating();

  // Whether to interact with Polkawatch API.
  const callPolkawatchApi = networkSupported && enabled && isNominating();

  useEffect(() => {
    if (callPolkawatchApi) {
      const polkaWatchApi = new PolkawatchApi(
        PolkaWatchController.apiConfig(network)
      );
      polkaWatchApi
        .ddpIpfsAboutChain()
        .then((response) => {
          setAnalyticsAvailable(true);
          setNetworkMeta(response.data);
        })
        .catch(() => {
          setNetworkMeta({} as ChainMetadata);
          setAnalyticsAvailable(false);
        });
    } else {
      setNetworkMeta({} as ChainMetadata);
      setAnalyticsAvailable(false);
    }
  }, [activeAccount, network, enabled, isNominating()]);

  // NOTE: The list of dependencies assume that changing network
  // triggers a change of account also (i.e. different network prefix).
  useEffect(() => {
    if (callPolkawatchApi) {
      const polkaWatchApi = new PolkawatchApi(
        PolkaWatchController.apiConfig(network)
      );
      polkaWatchApi
        .ddpIpfsNominatorDetail({
          lastDays: 30,
          nominator: activeAccount,
        })
        .then((response) => {
          setAnalyticsAvailable(true);
          setNominationDetail(response.data);
        })
        .catch(() => {
          setNominationDetail({} as NominatorDetail);
          setAnalyticsAvailable(false);
        });
    } else {
      setNominationDetail({} as NominatorDetail);
      setAnalyticsAvailable(false);
    }
  }, [activeAccount, network, enabled, isNominating()]);

  return (
    <>
      <StatBoxList>
        <AnalyzedDays />
        <AnalyzedEras meta={networkMeta} />
        <AnalyzedPayouts data={nominationDetail} />
      </StatBoxList>
      <PageRow>
        <CardWrapper>
          <PluginLabel plugin="polkawatch" />
          <CardHeaderWrapper>
            <h4>
              {t('decentralization.payoutDistribution', { ns: 'pages' })}
              <ButtonHelp
                marginLeft
                onClick={() => openHelp('Nomination Payout Distribution')}
              />
            </h4>
            <h2>
              {t('decentralization.byRegionCountryNetwork', { ns: 'pages' })}
            </h2>
          </CardHeaderWrapper>

          <GraphsWrapper style={{ minHeight: graphContainerMinHeight }}>
            {showDisabledLabel && (
              <StatusLabel
                status="active_service"
                statusFor="polkawatch"
                title={t('decentralization.polkawatchDisabled', {
                  ns: 'pages',
                })}
              />
            )}
            {showNotNominatingLabel && (
              <StatusLabel
                status="no_data"
                title={t('notNominating', {
                  ns: 'library',
                })}
              />
            )}
            {showNotAvailableLabel && (
              <StatusLabel
                status="no_analytic_data"
                title={
                  networkSupported
                    ? t('decentralization.analyticsNotAvailable', {
                        ns: 'pages',
                      })
                    : t('decentralization.analyticsNotSupported', {
                        ns: 'pages',
                      })
                }
              />
            )}
            {enabled && analyticsAvailable && (
              <>
                <GraphWrapper>
                  <GeoDonut
                    title={t('rewards')}
                    series={nominationDetail.topRegionalDistributionChart}
                    height={donutSize}
                    width={donutSize}
                    legendHeight={legendHeight}
                    maxLabelLen={0}
                  />
                </GraphWrapper>
                <GraphWrapper>
                  <GeoDonut
                    title={t('rewards')}
                    series={nominationDetail.topCountryDistributionChart}
                    height={donutSize}
                    width={donutSize}
                    legendHeight={legendHeight}
                    maxLabelLen={maxLabelLen}
                  />
                </GraphWrapper>
                <GraphWrapper>
                  <GeoDonut
                    title={t('rewards')}
                    series={nominationDetail.topNetworkDistributionChart}
                    height={donutSize}
                    width={donutSize}
                    legendHeight={legendHeight}
                    maxLabelLen={maxLabelLen}
                  />
                </GraphWrapper>
              </>
            )}
          </GraphsWrapper>
        </CardWrapper>
      </PageRow>
      {nominationDetail?.nodeDistributionDetail && (
        <PageRow>
          <CardWrapper>
            <NominationGeoList
              title={t('decentralization.decentralizationPerNomination', {
                ns: 'pages',
              })}
              data={nominationDetail}
            />
          </CardWrapper>
        </PageRow>
      )}
    </>
  );
};
