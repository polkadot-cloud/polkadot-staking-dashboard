// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useEffect } from 'react';
import { useModal } from 'contexts/Modal';
import { useSubscan } from 'contexts/Subscan';
import { EraPoints as EraPointsGraph } from 'library/Graphs/EraPoints';
import { SubscanButton } from 'library/SubscanButton';
import { GraphWrapper } from 'library/Graphs/Wrappers';
import { useSize, formatSize } from 'library/Graphs/Utils';
import Identicon from 'library/Identicon';
import { clipAddress, humanNumber, planckBnToUnit, rmCommas } from 'Utils';
import { useNetworkMetrics } from 'contexts/Network';
import { StatusLabel } from 'library/StatusLabel';
import { Title } from 'library/Modal/Title';
import { useStaking } from 'contexts/Staking';
import { BN } from 'bn.js';
import { PaddingWrapper } from 'modals/Wrappers';
import { useApi } from 'contexts/Api';
import { StatsWrapper, StatWrapper } from 'library/Modal/Wrappers';
import { OpenHelpIcon } from 'library/OpenHelpIcon';
import { useTranslation } from 'react-i18next';

export const ValidatorMetrics = () => {
  const {
    network: { units, unit },
  } = useApi();
  const { config } = useModal();
  const { address, identity } = config;
  const { fetchEraPoints }: any = useSubscan();
  const { metrics } = useNetworkMetrics();
  const { eraStakers } = useStaking();
  const { stakers } = eraStakers;
  const { t } = useTranslation('common');

  // is the validator in the active era
  const validatorInEra =
    stakers.find((s: any) => s.address === address) || null;

  let ownStake = new BN(0);
  let otherStake = new BN(0);
  if (validatorInEra) {
    const { others, own } = validatorInEra;

    others.forEach((o: any) => {
      otherStake = otherStake.add(new BN(rmCommas(o.value)));
    });
    if (own) {
      ownStake = new BN(rmCommas(own));
    }
  }
  const [list, setList] = useState([]);

  const ref: any = React.useRef();
  const size = useSize(ref.current);
  const { width, height, minHeight } = formatSize(size, 300);

  const handleEraPoints = async () => {
    const _list = await fetchEraPoints(address, metrics.activeEra.index);
    setList(_list);
  };

  useEffect(() => {
    handleEraPoints();
  }, []);

  const stats = [
    {
      label: 'Self Stake',
      value: `${humanNumber(planckBnToUnit(ownStake, units))} ${unit}`,
      help: 'Self Stake',
    },
    {
      label: 'Nominator Stake',
      value: `${humanNumber(planckBnToUnit(otherStake, units))} ${unit}`,
      help: 'Nominator Stake',
    },
  ];
  return (
    <>
      <Title title={t('modals.validator_metrics')} />
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
                  <h3>{s.value}</h3>
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
        >
          <h4>
            {t('modals.recent_era_points')}{' '}
            <OpenHelpIcon helpKey="Era Points" />
          </h4>
          <div className="inner" ref={ref} style={{ minHeight }}>
            <StatusLabel
              status="active_service"
              statusFor="subscan"
              title={t('modals.subscan_disabled')}
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

export default ValidatorMetrics;
