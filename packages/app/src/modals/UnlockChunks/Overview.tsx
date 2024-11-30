// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCheckCircle, faClock } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BigNumber from 'bignumber.js';
import { useApi } from 'contexts/Api';
import type { UnlockChunk } from 'contexts/Balances/types';
import { useNetwork } from 'contexts/Network';
import { getUnixTime } from 'date-fns';
import { useErasToTimeLeft } from 'hooks/useErasToTimeLeft';
import { useUnstaking } from 'hooks/useUnstaking';
import { ModalNotes } from 'kits/Overlay/structure/ModalNotes';
import { ModalPadding } from 'kits/Overlay/structure/ModalPadding';
import { StatWrapper, StatsWrapper } from 'library/Modal/Wrappers';
import { StaticNote } from 'modals/Utils/StaticNote';
import type { Dispatch, ForwardedRef, SetStateAction } from 'react';
import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { BondFor } from 'types';
import { ButtonSubmit } from 'ui-buttons';
import { planckToUnitBn, timeleftAsString } from 'utils';
import { Chunk } from './Chunk';
import { ContentWrapper } from './Wrappers';

interface OverviewProps {
  unlocking: UnlockChunk[];
  bondFor: BondFor;
  setSection: (section: number) => void;
  setUnlock: Dispatch<SetStateAction<UnlockChunk | null>>;
  setTask: (task: string) => void;
}

export const Overview = forwardRef(
  (
    { unlocking, bondFor, setSection, setUnlock, setTask }: OverviewProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const { t } = useTranslation('modals');
    const { consts, activeEra } = useApi();
    const {
      networkData: { units, unit },
    } = useNetwork();
    const { bondDuration } = consts;
    const { isFastUnstaking } = useUnstaking();
    const { erasToSeconds } = useErasToTimeLeft();

    const bondDurationFormatted = timeleftAsString(
      t,
      getUnixTime(new Date()) + 1,
      erasToSeconds(bondDuration),
      true
    );

    const isStaking = bondFor === 'nominator';

    let withdrawAvailable = new BigNumber(0);
    let totalUnbonding = new BigNumber(0);
    for (const c of unlocking) {
      const { era, value } = c;
      const left = new BigNumber(era).minus(activeEra.index);

      totalUnbonding = totalUnbonding.plus(value);
      if (left.isLessThanOrEqualTo(0)) {
        withdrawAvailable = withdrawAvailable.plus(value);
      }
    }

    const onRebondHandler = (chunk: UnlockChunk) => {
      setTask('rebond');
      setUnlock(chunk);
      setSection(1);
    };

    return (
      <ContentWrapper>
        <ModalPadding horizontalOnly ref={ref}>
          <StatsWrapper>
            <StatWrapper>
              <div className="inner">
                <h4>
                  <FontAwesomeIcon icon={faCheckCircle} className="icon" />{' '}
                  {t('unlocked')}
                </h4>
                <h2>
                  {planckToUnitBn(withdrawAvailable, units)
                    .decimalPlaces(3)
                    .toFormat()}{' '}
                  {unit}
                </h2>
              </div>
            </StatWrapper>
            <StatWrapper>
              <div className="inner">
                <h4>
                  <FontAwesomeIcon icon={faClock} className="icon" />{' '}
                  {t('unbonding')}
                </h4>
                <h2>
                  {planckToUnitBn(
                    totalUnbonding.minus(withdrawAvailable),
                    units
                  )
                    .decimalPlaces(3)
                    .toFormat()}{' '}
                  {unit}
                </h2>
              </div>
            </StatWrapper>
            <StatWrapper>
              <div className="inner">
                <h4>{t('total')}</h4>
                <h2>
                  {planckToUnitBn(totalUnbonding, units)
                    .decimalPlaces(3)
                    .toFormat()}{' '}
                  {unit}
                </h2>
              </div>
            </StatWrapper>
          </StatsWrapper>

          {withdrawAvailable.toNumber() > 0 && (
            <div style={{ margin: '1rem 0 0.5rem 0' }}>
              <ButtonSubmit
                disabled={isFastUnstaking}
                text={t('withdrawUnlocked')}
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
          )}

          {unlocking.map((chunk, i: number) => (
            <Chunk
              key={`unlock_chunk_${i}`}
              chunk={chunk}
              bondFor={bondFor}
              onRebond={onRebondHandler}
            />
          ))}
          <ModalNotes withPadding>
            <StaticNote
              value={bondDurationFormatted}
              tKey="unlockTake"
              valueKey="bondDurationFormatted"
              deps={[bondDuration]}
            />
            <p> {isStaking ? ` ${t('rebondUnlock')}` : null}</p>
            {!isStaking ? <p>{t('unlockChunk')}</p> : null}
          </ModalNotes>
        </ModalPadding>
      </ContentWrapper>
    );
  }
);

Overview.displayName = 'Overview';
