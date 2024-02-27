// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Ref } from 'react';
import { Fragment, forwardRef } from 'react';
import { usePayouts } from 'contexts/Payouts';
import { useTranslation } from 'react-i18next';
import { Item } from './Item';
import { ContentWrapper } from './Wrappers';
import type { OverviewProps } from './types';
import { getTotalPayout } from './Utils';
import { ModalPadding } from 'kits/Overlay/structure/ModalPadding';
import { ModalNotes } from 'kits/Overlay/structure/ModalNotes';

export const Overview = forwardRef(
  ({ setSection, setPayouts }: OverviewProps, ref: Ref<HTMLDivElement>) => {
    const { t } = useTranslation('modals');
    const { unclaimedPayouts } = usePayouts();

    return (
      <ContentWrapper>
        <ModalPadding horizontalOnly ref={ref}>
          {Object.entries(unclaimedPayouts || {}).map(
            ([era, unclaimedPayout], i) =>
              getTotalPayout(unclaimedPayout).isZero() ? (
                <Fragment key={`unclaimed_payout_${i}`} />
              ) : (
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
        </ModalPadding>
      </ContentWrapper>
    );
  }
);

Overview.displayName = 'Overview';
