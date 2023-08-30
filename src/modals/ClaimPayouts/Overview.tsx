// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ButtonSubmit, ModalNotes } from '@polkadot-cloud/react';
import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { usePayouts } from 'contexts/Payouts';
import { Item } from './Item';
import { ContentWrapper } from './Wrappers';

export const Overview = forwardRef(
  ({ setSection, setUnlock }: any, ref: any) => {
    const { t } = useTranslation('modals');
    const { unclaimedPayouts } = usePayouts();

    return (
      <ContentWrapper>
        <div className="padding" ref={ref}>
          <div style={{ margin: '1rem 0 0.5rem 0' }}>
            <ButtonSubmit
              disabled={Object.values(unclaimedPayouts || {}).length === 0}
              text={t('withdrawUnlocked')}
              onClick={() => {
                setUnlock({
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
                setSection={setSection}
              />
            )
          )}
          <ModalNotes withPadding>
            <p>${t('rebondUnlock')}`</p>
            <p>{t('unlockChunk')}</p>
          </ModalNotes>
        </div>
      </ContentWrapper>
    );
  }
);
