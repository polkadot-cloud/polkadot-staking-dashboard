// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { planckToUnit } from '@w3ux/utils';
import BigNumber from 'bignumber.js';
import { fromUnixTime } from 'date-fns';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Countdown } from 'library/Countdown';
import { useErasToTimeLeft } from 'hooks/useErasToTimeLeft';
import { useTimeLeft } from 'hooks/useTimeLeft';
import { useUnstaking } from 'hooks/useUnstaking';
import { useNetwork } from 'contexts/Network';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { ChunkWrapper } from './Wrappers';
import type { ChunkProps } from './types';
import { useApi } from 'contexts/Api';
import { ButtonSubmit } from 'kits/Buttons/ButtonSubmit';

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
