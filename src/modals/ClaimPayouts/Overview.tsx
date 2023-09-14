// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ModalNotes } from '@polkadot-cloud/react';
import { forwardRef } from 'react';
import { usePayouts } from 'contexts/Payouts';
import { useTranslation } from 'react-i18next';
import { Item } from './Item';
import { ContentWrapper } from './Wrappers';
import type { OverviewProps } from './types';

export const Overview = forwardRef(
  ({ setSection, setPayouts }: OverviewProps, ref: any) => {
    const { t } = useTranslation('modals');
    const { unclaimedPayouts } = usePayouts();

    return (
      <ContentWrapper>
        <div className="padding" ref={ref}>
          {Object.entries(unclaimedPayouts || {}).map(
            ([era, unclaimedPayout]: any, i: number) => (
              <Item
                key={`unclaimed_payout_${i}`}
                era={era}
                unclaimedPayout={unclaimedPayout}
                setPayouts={setPayouts}
                setSection={setSection}
              />
            )
          )}
          <ModalNotes withPadding>
            <p>{t('claimsOnBehalf')}</p>
            <p>{t('notToClaim')}</p>
          </ModalNotes>
        </div>
      </ContentWrapper>
    );
  }
);
