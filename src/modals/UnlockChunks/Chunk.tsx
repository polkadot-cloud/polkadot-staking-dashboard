// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ButtonSubmit } from '@polkadotcloud/core-ui';
import { planckToUnit } from '@polkadotcloud/utils';
import BigNumber from 'bignumber.js';
import { fromUnixTime } from 'date-fns';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useNetworkMetrics } from 'contexts/Network';
import { Countdown } from 'library/Countdown';
import { useErasToTimeLeft } from 'library/Hooks/useErasToTimeLeft';
import { useTimeLeft } from 'library/Hooks/useTimeLeft';
import { useUnstaking } from 'library/Hooks/useUnstaking';
import { ChunkWrapper } from './Wrappers';

export const Chunk = ({ chunk, bondFor, onRebond }: any) => {
  const { t } = useTranslation('modals');

  const { network } = useApi();
  const { activeAccount } = useConnect();
  const { activeEra } = useNetworkMetrics();
  const { units } = network;
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
          <h2>{`${planckToUnit(value, units)} ${network.unit}`}</h2>
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
