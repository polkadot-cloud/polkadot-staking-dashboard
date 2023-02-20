// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faCheckCircle, faClock } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonSubmit } from '@rossbulat/polkadot-dashboard-ui';
import BigNumber from 'bignumber.js';
import { useApi } from 'contexts/Api';
import { useNetworkMetrics } from 'contexts/Network';
import { getUnixTime } from 'date-fns';
import { Countdown } from 'library/Countdown';
import { useErasToTimeLeft } from 'library/Hooks/useErasToTimeLeft';
import { useTimeLeft } from 'library/Hooks/useTimeLeft';
import { fromNow, timeleftAsString } from 'library/Hooks/useTimeLeft/utils';
import { useUnstaking } from 'library/Hooks/useUnstaking';
import { StatsWrapper, StatWrapper } from 'library/Modal/Wrappers';
import { forwardRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { planckToUnit } from 'Utils';
import { NotesWrapper } from '../Wrappers';
import { ChunkWrapper, ContentWrapper } from './Wrappers';

export const Overview = forwardRef(
  ({ unlocking, bondFor, setSection, setUnlock, setTask }: any, ref: any) => {
    const { t } = useTranslation('modals');
    const { network, consts, apiStatus } = useApi();
    const { activeEra } = useNetworkMetrics();
    const { bondDuration } = consts;
    const { units } = network;
    const { isFastUnstaking } = useUnstaking();
    const { erasToSeconds } = useErasToTimeLeft();

    const { timeleft, setFromNow } = useTimeLeft();

    const bondDurationFormatted = timeleftAsString(
      t,
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

          {unlocking.map((chunk: any, i: number) => {
            const { era, value } = chunk;
            const left = new BigNumber(era).minus(activeEra.index);

            const start = activeEra.start.multipliedBy(0.001);
            const erasDuration = erasToSeconds(left);
            const end = start.plus(erasDuration);
            const timeleftt = BigNumber.max(
              0,
              end.minus(getUnixTime(new Date()))
            );
            // need to be moved to outside of this
            useEffect(() => {
              setFromNow(fromNow(timeleftt.toNumber()));
            }, [apiStatus, activeEra]);

            return (
              <ChunkWrapper key={`unlock_chunk_${i}`}>
                <div>
                  <section>
                    <h2>{`${planckToUnit(value, units)} ${network.unit}`}</h2>
                    <h4>
                      {left.isLessThanOrEqualTo(0) ? (
                        t('unlocked')
                      ) : (
                        <Countdown timeleft={timeleft.formatted} />
                      )}
                    </h4>
                  </section>
                  {isStaking && (
                    <section>
                      <div>
                        <ButtonSubmit
                          text={t('rebond')}
                          disabled={isFastUnstaking}
                          onClick={() => {
                            setTask('rebond');
                            setUnlock(chunk);
                            setSection(1);
                          }}
                        />
                      </div>
                    </section>
                  )}
                </div>
              </ChunkWrapper>
            );
          })}
          <NotesWrapper>
            <p>
              {t('unlockTake', { bondDurationFormatted })}
              {isStaking ? ` ${t('rebondUnlock')}` : null}
            </p>
            {!isStaking ? <p>{t('unlockChunk')}</p> : null}
          </NotesWrapper>
        </div>
      </ContentWrapper>
    );
  }
);
