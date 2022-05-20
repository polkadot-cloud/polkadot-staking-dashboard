// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import React from 'react';
import { HeadingWrapper, FooterWrapper, Separator } from '../Wrappers';
import { Wrapper, ChunkWrapper } from './Wrapper';
import { useBalances } from '../../contexts/Balances';
import { useApi } from '../../contexts/Api';
import { useConnect } from '../../contexts/Connect';
import { planckBnToUnit } from '../../Utils';

export const UnlockChunks = () => {
  const { network }: any = useApi();
  const { activeAccount } = useConnect();
  const { getBondedAccount, getAccountLedger }: any = useBalances();
  const { units } = network;
  const controller = getBondedAccount(activeAccount);
  const ledger = getAccountLedger(controller);
  const { unlocking } = ledger;

  return (
    <Wrapper>
      <HeadingWrapper>
        <FontAwesomeIcon transform="grow-2" icon={faClock} />
        {unlocking.length} Active Unlock Chunk
        {unlocking.length === 1 ? '' : 's'}
      </HeadingWrapper>
      <div
        style={{
          padding: '0 1rem',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {unlocking.map((chunk: any, index: number) => {
          const { era, value } = chunk;

          return (
            <ChunkWrapper key={`unlock_chunk_${index}`}>
              <h3>Submitted in Era {era}</h3>
              <h2>
                {planckBnToUnit(value, units)} {network.unit}
              </h2>

              <Separator />
            </ChunkWrapper>
          );
        })}

        <div className="notes">
          <p>
            Unlock chunks take 28 days to unlock. You can rebond chunks at any
            time in this period, or withdraw them to your free balance
            thereafter.
          </p>
          {/* <p>
            Estimated Tx Fee:
            {estimatedFee === null ? '...' : `${estimatedFee}`}
          </p> */}
        </div>
        {/* <FooterWrapper>
          <div>
            <button
              type="button"
              className="submit"
              onClick={() => submitTx()}
              disabled={
                !valid || submitting || getControllerNotImported(controller)
              }
            >
              <FontAwesomeIcon
                transform="grow-2"
                icon={faArrowAltCircleUp as IconProp}
              />
              Submit
            </button>
          </div>
        </FooterWrapper> */}
      </div>
    </Wrapper>
  );
};
