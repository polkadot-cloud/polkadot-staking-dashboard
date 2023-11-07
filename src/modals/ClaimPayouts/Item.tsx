// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ButtonSubmit } from '@polkadot-cloud/react';
import { useTranslation } from 'react-i18next';
import { planckToUnit } from '@polkadot-cloud/utils';
import { useNetwork } from 'contexts/Network';
import { ItemWrapper } from './Wrappers';
import type { ItemProps } from './types';
import { getTotalPayout } from './Utils';

export const Item = ({
  era,
  unclaimedPayout,
  setPayouts,
  setSection,
}: ItemProps) => {
  const { t } = useTranslation('modals');
  const {
    networkData: { units, unit },
  } = useNetwork();

  const totalPayout = getTotalPayout(unclaimedPayout);
  const numPayouts = Object.values(unclaimedPayout).length;

  return (
    <ItemWrapper>
      <div>
        <section>
          <h4>
            <span>
              Era {era}:{' '}
              {t('pendingPayout', {
                count: numPayouts,
              })}
            </span>
          </h4>
          <h2>
            {planckToUnit(totalPayout, units).toString()} {unit}
          </h2>
        </section>

        <section>
          <div>
            <ButtonSubmit
              text={t('claim')}
              onClick={() => {
                setPayouts([
                  {
                    era,
                    payout: totalPayout.toString(),
                    validators: Object.keys(unclaimedPayout),
                  },
                ]);
                setSection(1);
              }}
            />
          </div>
        </section>
      </div>
    </ItemWrapper>
  );
};
