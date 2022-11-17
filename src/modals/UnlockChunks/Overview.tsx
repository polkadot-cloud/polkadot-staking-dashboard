// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faCheckCircle, faClock } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonSubmit } from '@rossbulat/polkadot-dashboard-ui';
import BN from 'bn.js';
import { useApi } from 'contexts/Api';
import { useNetworkMetrics } from 'contexts/Network';
import { StatsWrapper, StatWrapper } from 'library/Modal/Wrappers';
import { forwardRef } from 'react';
import { humanNumber, planckBnToUnit, toFixedIfNecessary } from 'Utils';
import { NotesWrapper, Separator } from '../Wrappers';
import { ChunkWrapper, ContentWrapper } from './Wrappers';

export const Overview = forwardRef(
  ({ unlocking, bondType, setSection, setUnlock, setTask }: any, ref: any) => {
    const { network, consts } = useApi();
    const { metrics } = useNetworkMetrics();
    const { bondDuration } = consts;
    const { units } = network;
    const { activeEra } = metrics;

    const isStaking = bondType === 'stake';

    let withdrawAvailable = new BN(0);
    let totalUnbonding = new BN(0);
    for (const _chunk of unlocking) {
      const { era, value } = _chunk;
      const left = era - activeEra.index;

      totalUnbonding = totalUnbonding.add(value);
      if (left <= 0) {
        withdrawAvailable = withdrawAvailable.add(value);
      }
    }

    return (
      <ContentWrapper ref={ref}>
        <StatsWrapper>
          <StatWrapper>
            <div className="inner">
              <h4>
                <FontAwesomeIcon icon={faCheckCircle} className="icon" />{' '}
                Unlocked
              </h4>
              <h2>
                {humanNumber(
                  toFixedIfNecessary(
                    planckBnToUnit(withdrawAvailable, units),
                    3
                  )
                )}{' '}
                {network.unit}
              </h2>
            </div>
          </StatWrapper>
          <StatWrapper>
            <div className="inner">
              <h4>
                <FontAwesomeIcon icon={faClock} className="icon" /> Unbonding
              </h4>
              <h2>
                {humanNumber(
                  toFixedIfNecessary(
                    planckBnToUnit(
                      totalUnbonding.sub(withdrawAvailable),
                      units
                    ),
                    3
                  )
                )}{' '}
                {network.unit}
              </h2>
            </div>
          </StatWrapper>
          <StatWrapper>
            <div className="inner">
              <h4>Total</h4>
              <h2>
                {humanNumber(
                  toFixedIfNecessary(planckBnToUnit(totalUnbonding, units), 3)
                )}{' '}
                {network.unit}
              </h2>
            </div>
          </StatWrapper>
        </StatsWrapper>

        {withdrawAvailable.toNumber() > 0 && (
          <div style={{ margin: '1rem 0 0.5rem 0' }}>
            <ButtonSubmit
              text="Withdraw Unlocked"
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
          const left = era - activeEra.index;

          return (
            <ChunkWrapper key={`unlock_chunk_${i}`}>
              <div>
                <section>
                  <h2>
                    {planckBnToUnit(value, units)} {network.unit}
                  </h2>
                  <h4>{left <= 0 ? 'Unlocked' : `Unlocks after era ${era}`}</h4>
                </section>
                {isStaking && (
                  <section>
                    <div>
                      <ButtonSubmit
                        text="Rebond"
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
              {i === unlocking.length - 1 ? null : <Separator />}
            </ChunkWrapper>
          );
        })}
        <NotesWrapper>
          <p>
            Unlocks take {bondDuration} eras before they can be withdrawn.
            {isStaking &&
              `You can rebond unlocks at any time in this period, or withdraw them to your free balance thereafter.`}
          </p>
          {!isStaking && (
            <p>
              Unlock chunks cannot currently be rebonded in a pool. If you wish
              to rebond, withdraw the unlock chunk first and the add to your
              bond.
            </p>
          )}
        </NotesWrapper>
      </ContentWrapper>
    );
  }
);
