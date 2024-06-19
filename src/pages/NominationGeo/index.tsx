// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useTranslation } from 'react-i18next';
import type { PageProps } from 'types';
import { PageTitle } from 'kits/Structure/PageTitle';
import { StatBoxList } from 'library/StatBoxList';
import { useNetwork } from 'contexts/Network';
import { useEffect, useState } from 'react';

import { usePlugins } from 'contexts/Plugins';
import { useActiveAccounts } from 'contexts/ActiveAccounts';

import type { NominatorDetail, ChainMetadata } from './types';
import { PolkawatchApi } from '@polkawatch/ddp-client';
import { PolkaWatchController } from 'controllers/PolkaWatchController';

import { AnalyzedPayouts } from './Stats/AnalyzedPayouts';
import { AnalyzedDays } from './Stats/AnalyzedDays';
import { AnalyzedEras } from './Stats/AnalyzedEras';


import { PageRow } from 'kits/Structure/PageRow';
import { PageHeadingWrapper } from 'kits/Structure/PageHeading/Wrapper';
import { CardHeaderWrapper, CardWrapper } from 'library/Card/Wrappers';
import { PluginLabel } from 'library/PluginLabel';
//import { RowSection } from 'kits/Structure/RowSection';
import { GraphWrapper } from 'library/Graphs/Wrapper';
import { GeoDonut } from 'library/Graphs/GeoDonut';
import { ButtonHelp } from 'kits/Buttons/ButtonHelp';
import { useHelp } from 'contexts/Help';
import { Separator } from 'kits/Structure/Separator';
import { NominationGeoList } from './NominationGeoList';

export const NominationGeo = ({ page: { key } }: PageProps) => {
  const { activeAccount } = useActiveAccounts();
  const { t } = useTranslation();
  const { openHelp } = useHelp();
  const { network } = useNetwork();
  const { pluginEnabled } = usePlugins();
  const enabled = pluginEnabled('polkawatch');

  // Polkawatch Analytics chain metadata, contains information about how the decentralization is 1
  // computed for this particular blockchain

  const [networkMeta, setNetworkMeta] = useState<ChainMetadata>(
    {} as ChainMetadata
  );

  useEffect(() => {
    if (networkSupported && enabled) {
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
  }, [network]);

  const [nominationDetail, setNominationDetail] = useState<NominatorDetail>(
    {} as NominatorDetail
  );

  const [, setAnalyticsAvailable] = useState<boolean>(true);

  const networkSupported =
    PolkaWatchController.SUPPORTED_NETWORKS.includes(network);

  // Please note that the list of dependencies assume that changing network
  // triggers a change of account also (i.e. different network prefix).
  useEffect(() => {
    if (networkSupported && enabled) {
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
  }, [activeAccount]);

  return (
    <>
      <PageTitle title={t(key, { ns: 'base' })} />
      <PageRow>
        <PageHeadingWrapper>
          <h3>
            {t('decentralization.howDecentralizedIsYourNomination', {
              ns: 'pages',
            })}
          </h3>
        </PageHeadingWrapper>
      </PageRow>
      <StatBoxList>
        <AnalyzedPayouts data={nominationDetail} />
        <AnalyzedEras meta={networkMeta} />
        <AnalyzedDays />
      </StatBoxList>
      <PageRow>
        <CardWrapper>
          <PluginLabel plugin="polkawatch" />
          <CardHeaderWrapper>
            <h4>
              {t('decentralization.PayoutDistribution', { ns: 'pages' })}
              <ButtonHelp
                marginLeft
                onClick={() => openHelp('Payout Distribution')}
              />
            </h4>
            <h2>
              {t('decentralization.byRegionCountryNetwork', { ns: 'pages' })}
            </h2>
          </CardHeaderWrapper>
          <Separator />
          <div
            style={{
              minHeight: `${350}px`,
              display: 'flex',
              justifyContent: 'space-evenly',
              flexWrap: 'wrap',
            }}
          >
            <GraphWrapper>
              <GeoDonut
                title={t('rewards')}
                series={nominationDetail.topRegionalDistributionChart}
                height={`${300}px`}
                width={300}
                legendHeight={50}
              />
            </GraphWrapper>
            <GraphWrapper>
              <GeoDonut
                title={t('rewards')}
                series={nominationDetail.topCountryDistributionChart}
                height={`${300}px`}
                width={300}
                legendHeight={50}
              />
            </GraphWrapper>
            <GraphWrapper>
              <GeoDonut
                title={t('rewards')}
                series={nominationDetail.topNetworkDistributionChart}
                height={`${300}px`}
                width={300}
                legendHeight={50}
              />
            </GraphWrapper>
          </div>
        </CardWrapper>
      </PageRow>
      <PageRow>
        <CardWrapper>
          <NominationGeoList
            allowMoreCols={true}
            title={'Geolocation of each nomination'}
            data={nominationDetail}
          />
        </CardWrapper>
      </PageRow>
    </>
  );
};
