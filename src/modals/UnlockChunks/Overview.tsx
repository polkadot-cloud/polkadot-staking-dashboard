// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { forwardRef } from 'react';
import { useApi } from 'contexts/Api';
import { planckBnToUnit } from 'Utils';
import Button from 'library/Button';
import { useNetworkMetrics } from 'contexts/Network';
import { APIContextInterface } from 'types/api';
import { ContentWrapper, ChunkWrapper } from './Wrappers';
import { Separator, NotesWrapper } from '../Wrappers';

export const Overview = forwardRef(
  ({ unlocking, target, setSection, setUnlock, setTask }: any, ref: any) => {
    const { network, consts } = useApi() as APIContextInterface;
    const { metrics } = useNetworkMetrics();
    const { bondDuration } = consts;
    const { units } = network;
    const { activeEra } = metrics;

    const isStaking = target === 'stake';

    // calculate total withdraw available
    let withdrawAvailable = new BN(0);
    for (const _chunk of unlocking) {
      const { era, value } = _chunk;
      const left = era - activeEra.index;

      if (left <= 0) {
        withdrawAvailable = withdrawAvailable.add(value);
      }
    }

    return (
      <ContentWrapper ref={ref}>
        {withdrawAvailable.toNumber() > 0 && (
          <>
            <ChunkWrapper noFill>
              <h4>Available to Withdraw</h4>
              <div>
                <section>
                  <h2>
                    {planckBnToUnit(withdrawAvailable, units)} {network.unit}
                  </h2>
                </section>
                <section>
                  <div>
                    <Button
                      small
                      inline
                      primary
                      title="Withdraw"
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
                </section>
              </div>
            </ChunkWrapper>
          </>
        )}
        {unlocking.length === 0 && <h2>No Unlocks</h2>}
        {unlocking.map((chunk: any, index: number) => {
          const { era, value } = chunk;
          const left = era - activeEra.index;

          return (
            <ChunkWrapper key={`unlock_chunk_${index}`}>
              <h4>{left <= 0 ? 'Unlocked' : `Unlocks after era ${era}`}</h4>
              <div>
                <section>
                  <h2>
                    {planckBnToUnit(value, units)} {network.unit}
                  </h2>
                  {left > 0 ? (
                    <h3>
                      {left} era{left !== 1 && 's'} remaining before withdraw.
                    </h3>
                  ) : (
                    <h3>Available to withdraw</h3>
                  )}
                </section>
                {isStaking && (
                  <section>
                    <div>
                      <Button
                        small
                        inline
                        primary
                        title="Rebond"
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
              <Separator />
            </ChunkWrapper>
          );
        })}
        <NotesWrapper>
          <p>
            Unlocks take {bondDuration} eras before they can be withdrawn. You
            can rebond unlocks at any time in this period, or withdraw them to
            your free balance thereafter.
          </p>
        </NotesWrapper>
      </ContentWrapper>
    );
  }
);
