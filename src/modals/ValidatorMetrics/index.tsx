// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BigNumber from 'bignumber.js';
import { useApi } from 'contexts/Api';
import { useModal } from 'contexts/Modal';
import { useNetworkMetrics } from 'contexts/Network';
import { useStaking } from 'contexts/Staking';
import { useSubscan } from 'contexts/Subscan';
import { EraPoints as EraPointsGraph } from 'library/Graphs/EraPoints';
import { formatSize } from 'library/Graphs/Utils';
import { GraphWrapper } from 'library/Graphs/Wrappers';
import { useSize } from 'library/Hooks/useSize';
import { Identicon } from 'library/Identicon';
import { Title } from 'library/Modal/Title';
import { StatsWrapper, StatWrapper } from 'library/Modal/Wrappers';
import { OpenHelpIcon } from 'library/OpenHelpIcon';
import { StatusLabel } from 'library/StatusLabel';
import { SubscanButton } from 'library/SubscanButton';
import { PaddingWrapper } from 'modals/Wrappers';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { clipAddress, planckToUnit, rmCommas } from 'Utils';

export const ValidatorMetrics = () => {
  const { t } = useTranslation('modals');
  const {
    network: { units, unit },
  } = useApi();
  const { config } = useModal();
  const { address, identity } = config;
  const { fetchEraPoints }: any = useSubscan();
  const { activeEra } = useNetworkMetrics();
  const { eraStakers } = useStaking();
  const { stakers } = eraStakers;

  // is the validator in the active era
  const validatorInEra =
    stakers.find((s: any) => s.address === address) || null;

  let validatorOwnStake = new BigNumber(0);
  let otherStake = new BigNumber(0);
  if (validatorInEra) {
    const { others, own } = validatorInEra;

    others.forEach((o: any) => {
      otherStake = otherStake.plus(new BigNumber(rmCommas(o.value)));
    });
    if (own) {
      validatorOwnStake = new BigNumber(rmCommas(own));
    }
  }
  const [list, setList] = useState([]);

  const ref: any = React.useRef();
  const size = useSize(ref.current);
  const { width, height, minHeight } = formatSize(size, 300);

  const handleEraPoints = async () => {
    const _list = await fetchEraPoints(address, activeEra.index);
    setList(_list);
  };

  useEffect(() => {
    handleEraPoints();
  }, []);

  const stats = [
    {
      label: t('selfStake'),
      value: `${planckToUnit(validatorOwnStake, units).toFormat()} ${unit}`,
      help: 'Self Stake',
    },
    {
      label: t('nominatorStake'),
      value: `${planckToUnit(otherStake, units).toFormat()} ${unit}`,
      help: 'Nominator Stake',
    },
  ];
  return (
    <>
      <Title title={t('validatorMetrics')} />
      <div className="header">
        <Identicon value={address} size={33} />
        <h2>
          &nbsp;&nbsp;
          {identity === null ? clipAddress(address) : identity}
        </h2>
      </div>

      <PaddingWrapper horizontalOnly>
        <StatsWrapper>
          {stats.map(
            (s: { label: string; value: string; help: string }, i: number) => (
              <StatWrapper key={`metrics_stat_${i}`}>
                <div className="inner">
                  <h4>
                    {s.label} <OpenHelpIcon helpKey={s.help} />
                  </h4>
                  <h2>{s.value}</h2>
                </div>
              </StatWrapper>
            )
          )}
        </StatsWrapper>
      </PaddingWrapper>
      <div
        className="body"
        style={{ position: 'relative', marginTop: '0.5rem' }}
      >
        <SubscanButton />
        <GraphWrapper
          style={{
            margin: '0 1.5rem 0 0.5rem',
            height: 350,
            border: 'none',
            boxShadow: 'none',
          }}
          flex
          transparent
        >
          <h4>
            {t('recentEraPoints')} <OpenHelpIcon helpKey="Era Points" />
          </h4>
          <div className="inner" ref={ref} style={{ minHeight }}>
            <StatusLabel
              status="active_service"
              statusFor="subscan"
              title={t('subscanDisabled')}
            />
            <div
              className="graph"
              style={{
                height: `${height}px`,
                width: `${width}px`,
                position: 'absolute',
                left: '-1rem',
              }}
            >
              <EraPointsGraph items={list} height={250} />
            </div>
          </div>
        </GraphWrapper>
      </div>
    </>
  );
};
