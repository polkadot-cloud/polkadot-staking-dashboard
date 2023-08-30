// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ButtonSubmit } from '@polkadot-cloud/react';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import BigNumber from 'bignumber.js';
import { planckToUnit } from '@polkadot-cloud/utils';
import { ItemWrapper } from './Wrappers';
import type { ItemProps } from './types';

export const Item = ({ era, payouts, setSection }: ItemProps) => {
  const { t } = useTranslation('modals');
  const { network } = useApi();

  const totalPayout = Object.values(payouts).reduce(
    (acc: BigNumber, cur: string) => acc.plus(cur),
    new BigNumber(0)
  );

  const numPayouts = Object.values(payouts).length;

  return (
    <ItemWrapper>
      <div>
        <section>
          <h4>
            <span>
              Era {era}: {numPayouts} Pending Payout
              {numPayouts === 1 ? '' : 's'}
            </span>
          </h4>
          <h2>
            {planckToUnit(totalPayout, network.units).toString()} {network.unit}
          </h2>
        </section>

        <section>
          <div>
            <ButtonSubmit text={t('claim')} onClick={() => setSection(1)} />
          </div>
        </section>
      </div>
    </ItemWrapper>
  );
};
