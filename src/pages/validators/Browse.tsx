// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import moment from 'moment';
import { useState, useEffect, useRef } from 'react';
import { PageProps } from '../types';
import { StatBoxList } from '../../library/StatBoxList';
import { useApi } from '../../contexts/Api';
import { useStaking } from '../../contexts/Staking';
import { useValidators } from '../../contexts/Validators/Validators';
import { useNetworkMetrics } from '../../contexts/Network';
import { useSessionEra } from '../../contexts/SessionEra';
import { SectionWrapper } from '../../library/Graphs/Wrappers';
import { ValidatorList } from '../../library/ValidatorList';
import { PageTitle } from '../../library/PageTitle';
import { PageRowWrapper } from '../../Wrappers';
import StatBoxListItem from '../../library/StatBoxList/Item';

export const Browse = (props: PageProps) => {
  const { page } = props;
  const { title } = page;

  const { isReady, consts }: any = useApi();
  const { metrics } = useNetworkMetrics();
  const { staking, eraStakers }: any = useStaking();
  const { validators } = useValidators();
  const { sessionEra } = useSessionEra();

  const { expectedBlockTime } = consts;
  const { totalValidators, maxValidatorsCount, validatorCount } = staking;
  const { activeValidators } = eraStakers;

  // total validators as percent
  let totalValidatorsAsPercent = 0;
  if (maxValidatorsCount.gt(new BN(0))) {
    totalValidatorsAsPercent = totalValidators
      .div(maxValidatorsCount.div(new BN(100)))
      .toNumber();
  }

  // active validators as percent
  let activeValidatorsAsPercent = 0;
  if (validatorCount.gt(new BN(0))) {
    activeValidatorsAsPercent =
      activeValidators / (validatorCount.toNumber() * 0.01);
  }

  // era progress time left
  const getEraTimeLeft = () => {
    let eraBlocksLeft = (sessionEra.eraLength - sessionEra.eraProgress);
    let eraTimeLeftSeconds = eraBlocksLeft * (expectedBlockTime * 0.001);
    let eventTime = moment().unix() + eraTimeLeftSeconds;
    let diffTime = eventTime - moment().unix();
    return diffTime;
  }

  const [eraTimeLeft, _setEraTimeLeft]: any = useState(0);
  const eraTimeLeftRef = useRef(eraTimeLeft);
  const setEraTimeLeft = (_timeleft: number) => {
    _setEraTimeLeft(_timeleft);
    eraTimeLeftRef.current = _timeleft;
  }

  let timeleftInterval: any;
  useEffect(() => {
    setEraTimeLeft(getEraTimeLeft());

    timeleftInterval = setInterval(() => {
      setEraTimeLeft(eraTimeLeftRef.current - 1);
    }, 1000);

    return (() => {
      clearInterval(timeleftInterval);
    })
  }, [sessionEra]);

  let _timeleft = moment.duration(eraTimeLeftRef.current * 1000, 'milliseconds');
  let timeleft = _timeleft.hours() + ":" + _timeleft.minutes() + ":" + _timeleft.seconds();

  const items = [
    {
      format: 'chart-pie',
      params: {
        label: 'Total Validators',
        stat: {
          value: totalValidators.toNumber(),
          total: maxValidatorsCount.toNumber(),
          unit: '',
        },
        graph: {
          value1: totalValidators.toNumber(),
          value2: maxValidatorsCount.sub(totalValidators).toNumber(),
        },
        tooltip: `${totalValidatorsAsPercent.toFixed(2)}%`,
        assistant: {
          page: 'validators',
          key: 'Validator',
        },
      },
    },
    {
      format: 'chart-pie',
      params: {
        label: 'Active Validators',
        stat: {
          value: activeValidators,
          total: validatorCount.toNumber(),
          unit: '',
        },
        graph: {
          value1: activeValidators,
          value2: validatorCount.sub(new BN(activeValidators)).toNumber(),
        },
        tooltip: `${activeValidatorsAsPercent.toFixed(2)}%`,
        assistant: {
          page: 'validators',
          key: 'Active Validator',
        },
      },
    },
    {
      format: 'chart-pie',
      params: {
        label: 'Active Era',
        stat: {
          value: metrics.activeEra.index,
          unit: '',
        },
        graph: {
          value1: sessionEra.eraProgress,
          value2: sessionEra.eraLength - sessionEra.eraProgress,
        },
        tooltip: timeleft,
        assistant: {
          page: 'validators',
          key: 'Era',
        },
      },
    },
  ];

  return (
    <>
      <PageTitle title={title} />
      <StatBoxList>
        {items.map((item: any, index: number) => (
          <StatBoxListItem {...item} key={index} />
        ))}
      </StatBoxList>
      <PageRowWrapper noVerticalSpacer>
        <SectionWrapper>
          {isReady && (
            <>
              {validators.length === 0 && (
                <div className="item">
                  <h4>Fetching validators...</h4>
                </div>
              )}

              {validators.length > 0 && (
                <ValidatorList
                  validators={validators}
                  batchKey="validators_browse"
                  title="Validators"
                  allowMoreCols
                  allowFilters
                  pagination
                  toggleFavourites
                />
              )}
            </>
          )}
        </SectionWrapper>
      </PageRowWrapper>
    </>
  );
};

export default Browse;
