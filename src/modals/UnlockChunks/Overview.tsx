// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCheckCircle, faClock } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonSubmit, ModalNotes, ModalPadding } from '@polkadot-cloud/react';
import { planckToUnit } from '@polkadot-cloud/utils';
import BigNumber from 'bignumber.js';
import { getUnixTime } from 'date-fns';
import type { Dispatch, ForwardedRef, SetStateAction } from 'react';
import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { useErasToTimeLeft } from 'library/Hooks/useErasToTimeLeft';
import { timeleftAsString } from 'library/Hooks/useTimeLeft/utils';
import { useUnstaking } from 'library/Hooks/useUnstaking';
import { StatWrapper, StatsWrapper } from 'library/Modal/Wrappers';
import { StaticNote } from 'modals/Utils/StaticNote';
import type { AnyJson, BondFor } from 'types';
import { useNetwork } from 'contexts/Network';
import { Chunk } from './Chunk';
import { ContentWrapper } from './Wrappers';
import type { UnlockChunk } from 'contexts/Balances/types';

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

    const onRebondHandler = (chunk: AnyJson) => {
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
                  {planckToUnit(withdrawAvailable, units)
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
                  {planckToUnit(totalUnbonding.minus(withdrawAvailable), units)
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
                  {planckToUnit(totalUnbonding, units)
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
