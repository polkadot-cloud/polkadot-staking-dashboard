// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useSize } from '@w3ux/hooks';
import { Polkicon } from '@w3ux/react-polkicon';
import type { AnyJson } from '@w3ux/types';
import { ellipsisFn } from '@w3ux/utils';
import BigNumber from 'bignumber.js';
import { useApi } from 'contexts/Api';
import { useHelp } from 'contexts/Help';
import { useNetwork } from 'contexts/Network';
import { usePlugins } from 'contexts/Plugins';
import { useStaking } from 'contexts/Staking';
import { useUi } from 'contexts/UI';
import { Subscan } from 'controllers/Subscan';
import { useOverlay } from 'kits/Overlay/Provider';
import { ModalPadding } from 'kits/Overlay/structure/ModalPadding';
import { CardHeaderWrapper, CardWrapper } from 'library/Card/Wrappers';
import { EraPoints as EraPointsGraph } from 'library/Graphs/EraPoints';
import { formatSize } from 'library/Graphs/Utils';
import { GraphWrapper } from 'library/Graphs/Wrapper';
import { Title } from 'library/Modal/Title';
import { StatWrapper, StatsWrapper } from 'library/Modal/Wrappers';
import { PluginLabel } from 'library/PluginLabel';
import { StatusLabel } from 'library/StatusLabel';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonHelp } from 'ui-buttons';
import { planckToUnitBn } from 'utils';

export const ValidatorMetrics = () => {
  const { t } = useTranslation('modals');
  const {
    networkData: { units, unit },
  } = useNetwork();
  const { activeEra } = useApi();
  const { plugins } = usePlugins();
  const { containerRefs } = useUi();
  const { options } = useOverlay().modal.config;
  const { address, identity } = options;
  const {
    eraStakers: { stakers },
  } = useStaking();
  const { openHelp } = useHelp();

  // is the validator in the active era
  const validatorInEra = stakers.find((s) => s.address === address) || null;

  let validatorOwnStake = new BigNumber(0);
  let otherStake = new BigNumber(0);
  if (validatorInEra) {
    const { others, own } = validatorInEra;

    others.forEach(({ value }) => {
      otherStake = otherStake.plus(value);
    });
    if (own) {
      validatorOwnStake = new BigNumber(own);
    }
  }
  const [list, setList] = useState<AnyJson[]>([]);

  const ref = useRef<HTMLDivElement>(null);
  const size = useSize(ref, {
    outerElement: containerRefs?.mainInterface,
  });
  const { width, height, minHeight } = formatSize(size, 300);

  const handleEraPoints = async () => {
    if (!plugins.includes('subscan')) {
      return;
    }
    setList(
      await Subscan.handleFetchEraPoints(address, activeEra.index.toNumber())
    );
  };

  useEffect(() => {
    handleEraPoints();
  }, []);

  const stats = [
    {
      label: t('selfStake'),
      value: `${planckToUnitBn(validatorOwnStake, units).toFormat()} ${unit}`,
      help: 'Self Stake',
    },
    {
      label: t('nominatorStake'),
      value: `${planckToUnitBn(otherStake, units).toFormat()} ${unit}`,
      help: 'Nominator Stake',
    },
  ];
  return (
    <>
      <Title title={t('validatorMetrics')} />
      <div className="header">
        <Polkicon address={address} fontSize="2.75rem" />
        <h2>
          &nbsp;&nbsp;
          {identity === null ? ellipsisFn(address) : identity}
        </h2>
      </div>

      <ModalPadding horizontalOnly>
        <StatsWrapper>
          {stats.map((s, i) => (
            <StatWrapper key={`metrics_stat_${i}`}>
              <div className="inner">
                <h4>
                  {s.label}{' '}
                  <ButtonHelp marginLeft onClick={() => openHelp(s.help)} />
                </h4>
                <h2>{s.value}</h2>
              </div>
            </StatWrapper>
          ))}
        </StatsWrapper>
      </ModalPadding>
      <div
        className="body"
        style={{ position: 'relative', marginTop: '0.5rem' }}
      >
        <PluginLabel plugin="subscan" />
        <CardWrapper
          className="transparent"
          style={{
            margin: '0 0 0 0.5rem',
            height: 350,
          }}
        >
          <CardHeaderWrapper $withMargin>
            <h4>
              {t('recentEraPoints')}{' '}
              <ButtonHelp marginLeft onClick={() => openHelp('Era Points')} />
            </h4>
          </CardHeaderWrapper>
          <div ref={ref} style={{ minHeight }}>
            <StatusLabel
              status="active_service"
              statusFor="subscan"
              title={t('subscanDisabled')}
            />
            <GraphWrapper
              style={{
                height: `${height}px`,
                width: `${width}px`,
              }}
            >
              <EraPointsGraph items={list} height={250} />
            </GraphWrapper>
          </div>
        </CardWrapper>
      </div>
    </>
  );
};
