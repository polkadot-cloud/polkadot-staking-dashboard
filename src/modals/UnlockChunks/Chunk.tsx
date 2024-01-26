// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ButtonSubmit } from '@polkadot-cloud/react';
import { planckToUnit } from '@polkadot-cloud/utils';
import BigNumber from 'bignumber.js';
import { fromUnixTime } from 'date-fns';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Countdown } from 'library/Countdown';
import { useErasToTimeLeft } from 'library/Hooks/useErasToTimeLeft';
import { useTimeLeft } from 'library/Hooks/useTimeLeft';
import { useUnstaking } from 'library/Hooks/useUnstaking';
import { useNetwork } from 'contexts/Network';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { ChunkWrapper } from './Wrappers';
import type { ChunkProps } from './types';
import { useApi } from 'contexts/Api';

export const Chunk = ({ chunk, bondFor, onRebond }: ChunkProps) => {
  const { t } = useTranslation('modals');

  const { activeEra } = useApi();
  const {
    networkData: { units, unit },
    network,
  } = useNetwork();
  const { activeAccount } = useActiveAccounts();
  const { isFastUnstaking } = useUnstaking();
  const { erasToSeconds } = useErasToTimeLeft();
  const { timeleft, setFromNow } = useTimeLeft();
  const isStaking = bondFor === 'nominator';

  const { era, value } = chunk;
  const left = new BigNumber(era).minus(activeEra.index);
  const start = activeEra.start.multipliedBy(0.001);
  const erasDuration = erasToSeconds(left);

  const dateFrom = fromUnixTime(start.toNumber());
  const dateTo = fromUnixTime(start.plus(erasDuration).toNumber());

  // reset timer on account or network change.
  useEffect(() => {
    setFromNow(dateFrom, dateTo);
  }, [activeAccount, network]);

  return (
    <ChunkWrapper>
      <div>
        <section>
          <h2>{`${planckToUnit(new BigNumber(value), units)} ${unit}`}</h2>
          <h4>
            {left.isLessThanOrEqualTo(0) ? (
              t('unlocked')
            ) : (
              <>
                {t('unlocksInEra')} {era} /&nbsp;
                <Countdown timeleft={timeleft.formatted} markup={false} />
              </>
            )}
          </h4>
        </section>
        {isStaking ? (
          <section>
            <div>
              <ButtonSubmit
                text={t('rebond')}
                disabled={isFastUnstaking}
                onClick={() => onRebond(chunk)}
              />
            </div>
          </section>
        ) : null}
      </div>
    </ChunkWrapper>
  );
};
