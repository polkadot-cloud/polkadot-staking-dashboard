// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

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
import { formatTimeleft, planckToUnitBn } from 'library/Utils';

export const Chunk = ({ chunk, bondFor, onRebond }: ChunkProps) => {
  const { t, i18n } = useTranslation('modals');

  const { activeEra } = useApi();
  const {
    networkData: { units, unit },
    network,
  } = useNetwork();
  const { isFastUnstaking } = useUnstaking();
  const { activeAccount } = useActiveAccounts();
  const { erasToSeconds } = useErasToTimeLeft();

  const { timeleft, setFromNow } = useTimeLeft({
    depsTimeleft: [network],
    depsFormat: [i18n.resolvedLanguage],
  });

  const isStaking = bondFor === 'nominator';
  const { era, value } = chunk;
  const left = new BigNumber(era).minus(activeEra.index);
  const start = activeEra.start.multipliedBy(0.001);
  const erasDuration = erasToSeconds(left);

  const dateFrom = fromUnixTime(start.toNumber());
  const dateTo = fromUnixTime(start.plus(erasDuration).toNumber());
  const formatted = formatTimeleft(t, timeleft.raw);

  // reset timer on account or network change.
  useEffect(() => {
    setFromNow(dateFrom, dateTo);
  }, [activeAccount, network]);

  return (
    <ChunkWrapper>
      <div>
        <section>
          <h2>{`${planckToUnitBn(new BigNumber(value), units)} ${unit}`}</h2>
          <h4>
            {left.isLessThanOrEqualTo(0) ? (
              t('unlocked')
            ) : (
              <>
                {t('unlocksInEra')} {era} /&nbsp;
                <Countdown timeleft={formatted} markup={false} />
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
