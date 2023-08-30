// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ButtonSubmit, ModalNotes } from '@polkadot-cloud/react';
import { forwardRef } from 'react';
import { usePayouts } from 'contexts/Payouts';
import { Item } from './Item';
import { ContentWrapper } from './Wrappers';

export const Overview = forwardRef(
  ({ setSection, setPayout }: any, ref: any) => {
    const { unclaimedPayouts } = usePayouts();

    return (
      <ContentWrapper>
        <div className="padding" ref={ref}>
          <div style={{ margin: '1rem 0 0.5rem 0' }}>
            <ButtonSubmit
              disabled={Object.values(unclaimedPayouts || {}).length === 0}
              text="Claim All"
              onClick={() => {
                setPayout({
                  era: 0,
                  value: 5000000000,
                });
                setSection(1);
              }}
            />
          </div>

          {Object.entries(unclaimedPayouts || {}).map(
            ([era, payouts]: any, i: number) => (
              <Item
                key={`unclaimed_payout_${i}`}
                era={era}
                payouts={payouts}
                setPayout={setPayout}
                setSection={setSection}
              />
            )
          )}
          <ModalNotes withPadding>
            <p>
              Claiming a payout claims on behalf of every nominator backing the
              validator for the era you are claiming for. For this reason,
              transaction fees are usually higher, and most nominators rely on
              the validator to claim on their behalf.
            </p>
            <p>
              Validators usually claim payouts on behalf of their nominators. If
              you decide not to claim here, it is likely you will receive your
              payouts within 1-2 days of them becoming available.
            </p>
          </ModalNotes>
        </div>
      </ContentWrapper>
    );
  }
);
