// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ButtonSubmit, ModalNotes } from '@polkadot-cloud/react';
import { getUnixTime } from 'date-fns';
import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { useErasToTimeLeft } from 'library/Hooks/useErasToTimeLeft';
import { timeleftAsString } from 'library/Hooks/useTimeLeft/utils';
import { useUnstaking } from 'library/Hooks/useUnstaking';
import { StaticNote } from 'modals/Utils/StaticNote';
import type { AnyJson } from 'types';
import { Item } from './Item';
import { ContentWrapper } from './Wrappers';

export const Overview = forwardRef(
  ({ setSection, setUnlock }: any, ref: any) => {
    const { t } = useTranslation('modals');
    const { consts } = useApi();
    const { isFastUnstaking } = useUnstaking();
    const { erasToSeconds } = useErasToTimeLeft();
    const { bondDuration } = consts;

    const bondDurationFormatted = timeleftAsString(
      t,
      getUnixTime(new Date()) + 1,
      erasToSeconds(bondDuration),
      true
    );

    const unclaimedPayouts: AnyJson = [];

    return (
      <ContentWrapper>
        <div className="padding" ref={ref}>
          <div style={{ margin: '1rem 0 0.5rem 0' }}>
            <ButtonSubmit
              disabled={isFastUnstaking}
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

          {unclaimedPayouts.map((payout: any, i: number) => (
            <Item
              key={`unclaimed_payout_${i}`}
              payout={payout}
              setSection={setSection}
            />
          ))}
          <ModalNotes withPadding>
            <StaticNote
              value={bondDurationFormatted}
              tKey="unlockTake"
              valueKey="bondDurationFormatted"
              deps={[bondDuration]}
            />
            <p>${t('rebondUnlock')}`</p>
            <p>{t('unlockChunk')}</p>
          </ModalNotes>
        </div>
      </ContentWrapper>
    );
  }
);
