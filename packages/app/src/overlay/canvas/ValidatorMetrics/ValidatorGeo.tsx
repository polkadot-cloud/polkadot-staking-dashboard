// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { PolkawatchApi, type ValidatorDetail } from '@polkawatch/ddp-client'
import { useSize } from '@w3ux/hooks'
import { useHelp } from 'contexts/Help'
import { useNetwork } from 'contexts/Network'
import { usePlugins } from 'contexts/Plugins'
import { useUi } from 'contexts/UI'
import { PolkaWatch } from 'controllers/PolkaWatch'
import { CardWrapper } from 'library/Card/Wrappers'
import { GeoDonut } from 'library/Graphs/GeoDonut'
import { formatSize } from 'library/Graphs/Utils'
import { ValidatorGeoWrapper } from 'library/Graphs/Wrapper'
import { StatusLabel } from 'library/StatusLabel'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ButtonHelp } from 'ui-buttons'
import { CardHeader } from 'ui-core/base'

export const ValidatorGeo = ({ address }: { address: string }) => {
  const { t } = useTranslation('modals')
  const { openHelp } = useHelp()
  const { network } = useNetwork()
  const { containerRefs } = useUi()

  const ref = useRef<HTMLDivElement>(null)
  const size = useSize(ref, {
    outerElement: containerRefs?.mainInterface,
  })
  const { height, minHeight } = formatSize(size, 300)

  const [pwData, setPwData] = useState<ValidatorDetail>({} as ValidatorDetail)
  const [analyticsAvailable, setAnalyticsAvailable] = useState<boolean>(true)
  const { pluginEnabled } = usePlugins()
  const enabled = pluginEnabled('polkawatch')

  const networkSupported = PolkaWatch.SUPPORTED_NETWORKS.includes(network)

  useEffect(() => {
    if (networkSupported && enabled) {
      const polkaWatchApi = new PolkawatchApi(PolkaWatch.apiConfig(network))
      polkaWatchApi
        .ddpIpfsValidatorDetail({
          lastDays: 60,
          validator: address,
          validationType: 'public',
        })
        .then((response) => {
          setAnalyticsAvailable(true)
          setPwData(response.data)
        })
        .catch(() => setAnalyticsAvailable(false))
    } else {
      setAnalyticsAvailable(false)
    }
  }, [address, network])

  return (
    <div>
      <CardWrapper
        className="transparent"
        style={{
          marginLeft: '0.25rem',
        }}
      >
        <CardHeader margin>
          <h4>
            {t('rewardsByCountryAndNetwork')}{' '}
            <ButtonHelp
              marginLeft
              onClick={() => openHelp('Rewards By Country And Network')}
              outline
            />
          </h4>
        </CardHeader>
        <div
          ref={ref}
          style={{
            minHeight,
            display: 'flex',
            justifyContent: 'space-evenly',
          }}
        >
          {!enabled || analyticsAvailable ? (
            <StatusLabel
              status="active_service"
              statusFor="polkawatch"
              title={t('polkawatchDisabled')}
            />
          ) : (
            <StatusLabel
              status="no_analytic_data"
              title={
                networkSupported
                  ? t('decentralizationAnalyticsNotAvailable')
                  : t('decentralizationAnalyticsNotSupported')
              }
            />
          )}
          <div style={{ display: 'flex', flexFlow: 'row wrap', width: '100%' }}>
            <ValidatorGeoWrapper
              style={{
                width: '50%',
                maxHeight: `${height}px`,
              }}
            >
              <GeoDonut
                title={t('rewards')}
                series={pwData.topCountryDistributionChart}
                maxLabelLen={10}
              />
            </ValidatorGeoWrapper>
            <ValidatorGeoWrapper
              style={{
                width: '50%',
                maxHeight: `${height}px`,
              }}
            >
              <GeoDonut
                title={t('rewards')}
                series={pwData.topNetworkDistributionChart}
                maxLabelLen={10}
              />
            </ValidatorGeoWrapper>
          </div>
        </div>
      </CardWrapper>
    </div>
  )
}
