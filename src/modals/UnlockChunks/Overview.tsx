// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faCheckCircle, faClock } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonSubmit } from '@polkadotcloud/dashboard-ui';
import { planckToUnit } from 'Utils';
import BigNumber from 'bignumber.js';
import { useApi } from 'contexts/Api';
import { useNetworkMetrics } from 'contexts/Network';
import { getUnixTime } from 'date-fns';
import { useErasToTimeLeft } from 'library/Hooks/useErasToTimeLeft';
import { timeleftAsString } from 'library/Hooks/useTimeLeft/utils';
import { useUnstaking } from 'library/Hooks/useUnstaking';
import { StatWrapper, StatsWrapper } from 'library/Modal/Wrappers';
import { StaticNote } from 'modals/Utils/StaticNote';
import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { AnyJson } from 'types';
import { NotesWrapper } from '../Wrappers';
import { Chunk } from './Chunk';
import { ContentWrapper } from './Wrappers';

export const Overview = forwardRef(
  ({ unlocking, bondFor, setSection, setUnlock, setTask }: any, ref: any) => {
    const { t } = useTranslation('modals');
    const { network, consts } = useApi();
    const { activeEra } = useNetworkMetrics();
    const { bondDuration } = consts;
    const { units } = network;
    const { isFastUnstaking } = useUnstaking();
    const { erasToSeconds } = useErasToTimeLeft();

    const bondDurationFormatted = timeleftAsString(
      t,
      getUnixTime(new Date()) + 1,
      erasToSeconds(bondDuration),
      true
    );

    const isStaking = bondFor === 'nominator';

    let withdrawAvailable = new BigNumber(0);
    let totalUnbonding = new BigNumber(0);
    for (const _chunk of unlocking) {
      const { era, value } = _chunk;
      const left = new BigNumber(era).minus(activeEra.index);

      totalUnbonding = totalUnbonding.plus(value);
      if (left.isLessThanOrEqualTo(0)) {
        withdrawAvailable = withdrawAvailable.plus(value);
      }
    }

    const onRebondHandler = (chunk: AnyJson) => {
      setTask('rebond');
      setUnlock(chunk);
      setSection(1);
    };

    return (
      <ContentWrapper ref={ref}>
        <div className="padding">
          <StatsWrapper>
            <StatWrapper>
              <div className="inner">
                <h4>
                  <FontAwesomeIcon icon={faCheckCircle} className="icon" />{' '}
                  {t('unlocked')}
                </h4>
                <h2>
                  {planckToUnit(withdrawAvailable, units)
                    .decimalPlaces(3)
                    .toFormat()}{' '}
                  {network.unit}
                </h2>
              </div>
            </StatWrapper>
            <StatWrapper>
              <div className="inner">
                <h4>
                  <FontAwesomeIcon icon={faClock} className="icon" />{' '}
                  {t('unbonding')}
                </h4>
                <h2>
                  {planckToUnit(totalUnbonding.minus(withdrawAvailable), units)
                    .decimalPlaces(3)
                    .toFormat()}{' '}
                  {network.unit}
                </h2>
              </div>
            </StatWrapper>
            <StatWrapper>
              <div className="inner">
                <h4>{t('total')}</h4>
                <h2>
                  {planckToUnit(totalUnbonding, units)
                    .decimalPlaces(3)
                    .toFormat()}{' '}
                  {network.unit}
                </h2>
              </div>
            </StatWrapper>
          </StatsWrapper>

          {withdrawAvailable.toNumber() > 0 && (
            <div style={{ margin: '1rem 0 0.5rem 0' }}>
              <ButtonSubmit
                disabled={isFastUnstaking}
                text={t('withdrawUnlocked')}
                onClick={() => {
                  setTask('withdraw');
                  setUnlock({
                    era: 0,
                    value: withdrawAvailable,
                  });
                  setSection(1);
                }}
              />
            </div>
          )}

          {unlocking.map((chunk: any, i: number) => (
            <Chunk
              key={`unlock_chunk_${i}`}
              chunk={chunk}
              bondFor={bondFor}
              onRebond={onRebondHandler}
            />
          ))}
          <NotesWrapper>
            <StaticNote
              value={bondDurationFormatted}
              tKey="unlockTake"
              valueKey="bondDurationFormatted"
              deps={[bondDuration]}
            />
            <p> {isStaking ? ` ${t('rebondUnlock')}` : null}</p>
            {!isStaking ? <p>{t('unlockChunk')}</p> : null}
          </NotesWrapper>
        </div>
      </ContentWrapper>
    );
  }
);
