// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js'
import { usePayouts } from 'contexts/Payouts'
import { ModalNotes } from 'kits/Overlay/structure/ModalNotes'
import { ModalPadding } from 'kits/Overlay/structure/ModalPadding'
import type { Ref } from 'react'
import { Fragment, forwardRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Item } from './Item'
import type { OverviewProps } from './types'
import { ContentWrapper } from './Wrappers'

export const Overview = forwardRef(
  ({ setSection, setPayouts }: OverviewProps, ref: Ref<HTMLDivElement>) => {
    const { t } = useTranslation('modals')
    const { unclaimedRewards } = usePayouts()

    return (
      <ContentWrapper>
        <ModalPadding horizontalOnly ref={ref}>
          {unclaimedRewards.entries.map(({ era, reward, validators }, i) =>
            new BigNumber(reward).isZero() ? (
              <Fragment key={`unclaimed_payout_${i}`} />
            ) : (
              <Item
                key={`unclaimed_payout_${i}`}
                era={String(era)}
                validators={validators}
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
    )
  }
)

Overview.displayName = 'Overview'
