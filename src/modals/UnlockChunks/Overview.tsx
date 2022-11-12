// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ButtonPrimary } from '@rossbulat/polkadot-dashboard-ui';
import BN from 'bn.js';
import { useApi } from 'contexts/Api';
import { useNetworkMetrics } from 'contexts/Network';
import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { planckBnToUnit } from 'Utils';
import { NotesWrapper, Separator } from '../Wrappers';
import { ChunkWrapper, ContentWrapper } from './Wrappers';

export const Overview = forwardRef(
  ({ unlocking, bondType, setSection, setUnlock, setTask }: any, ref: any) => {
    const { network, consts } = useApi();
    const { metrics } = useNetworkMetrics();
    const { bondDuration } = consts;
    const { units } = network;
    const { activeEra } = metrics;
    const { t } = useTranslation('common');

    const isStaking = bondType === 'stake';

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
              <h4>{t('modals.available_to_withdraw')}</h4>
              <div>
                <section>
                  <h2>
                    {planckBnToUnit(withdrawAvailable, units)} {network.unit}
                  </h2>
                </section>
                <section>
                  <div>
                    <ButtonPrimary
                      text={t('modals.withdraw')}
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
        {unlocking.length === 0 && <h2>{t('modals.no_unlocks')}</h2>}
        {unlocking.map((chunk: any, index: number) => {
          const { era, value } = chunk;
          const left = era - activeEra.index;

          return (
            <ChunkWrapper key={`unlock_chunk_${index}`}>
              <h4>
                {left <= 0
                  ? t('modals.unlocked')
                  : `${t('modals.unlocks_after_era')} ${era} `}
              </h4>
              <div>
                <section>
                  <h2>
                    {planckBnToUnit(value, units)} {network.unit}
                  </h2>
                  {left > 0 ? (
                    <h3>
                      {left} era{left !== 1 && 's'}{' '}
                      {t('modals.remaining_before_withdraw')}
                    </h3>
                  ) : (
                    <h3>{t('modals.available_to_withdraw')}</h3>
                  )}
                </section>
                {isStaking && (
                  <section>
                    <div>
                      <ButtonPrimary
                        text={t('modals.rebond')}
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
          {t('modals.unlock_chunks1', { bondDuration })}
          <p>{isStaking && `${t('modals.unlock_chunks2')}`}</p>
          {!isStaking && <p>{t('modals.unlock_chunk')}</p>}
        </NotesWrapper>
      </ContentWrapper>
    );
  }
);
