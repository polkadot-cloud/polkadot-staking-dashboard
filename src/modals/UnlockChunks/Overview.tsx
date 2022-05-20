// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Separator } from '../Wrappers';
import { ContentWrapper, ChunkWrapper } from './Wrappers';
import { useBalances } from '../../contexts/Balances';
import { useApi } from '../../contexts/Api';
import { useConnect } from '../../contexts/Connect';
import { planckBnToUnit } from '../../Utils';
import Button from '../../library/Button';
import { useNetworkMetrics } from '../../contexts/Network';

export const Overview = ({ setSection, setUnlock }: any) => {
  const { network, consts }: any = useApi();
  const { activeAccount } = useConnect();
  const { metrics } = useNetworkMetrics();
  const { getBondedAccount, getAccountLedger }: any = useBalances();
  const { bondDuration } = consts;
  const { units } = network;
  const { activeEra } = metrics;
  const controller = getBondedAccount(activeAccount);
  const ledger = getAccountLedger(controller);
  const { unlocking } = ledger;

  return (
    <ContentWrapper>
      {unlocking.map((chunk: any, index: number) => {
        const { era, value } = chunk;
        const end = era + bondDuration + 1;
        const left = end - activeEra.index;

        return (
          <ChunkWrapper key={`unlock_chunk_${index}`}>
            <h4>
              Submitted in era <b>{era}</b>
            </h4>
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
              <section>
                <div>
                  <Button
                    small
                    inline
                    primary
                    title="Rebond"
                    onClick={() => {
                      setUnlock(chunk);
                      setSection(1);
                    }}
                  />
                </div>
              </section>
            </div>
            <Separator />
          </ChunkWrapper>
        );
      })}

      <div className="notes">
        <p>
          Unlock chunks take {bondDuration} eras to unlock. You can rebond
          chunks at any time in this period, or withdraw them to your free
          balance thereafter.
        </p>
      </div>
    </ContentWrapper>
  );
};
