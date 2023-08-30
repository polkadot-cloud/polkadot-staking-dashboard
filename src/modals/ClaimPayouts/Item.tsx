// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ButtonSubmit } from '@polkadot-cloud/react';
import { planckToUnit } from '@polkadot-cloud/utils';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { Countdown } from 'library/Countdown';
import { useTimeLeft } from 'library/Hooks/useTimeLeft';
import { useUnstaking } from 'library/Hooks/useUnstaking';
import { ItemWrapper } from './Wrappers';

export const Item = ({ payout, setSection }: any) => {
  const { t } = useTranslation('modals');

  const { network } = useApi();
  const { units } = network;
  const { isFastUnstaking } = useUnstaking();
  const { timeleft } = useTimeLeft();

  return (
    <ItemWrapper>
      <div>
        <section>
          <h2>{`${planckToUnit(payout, units)} ${network.unit}`}</h2>
          <h4>
            {t('unlocksInEra')} [era] /&nbsp;
            <Countdown timeleft={timeleft.formatted} markup={false} />
          </h4>
        </section>

        <section>
          <div>
            <ButtonSubmit
              text={t('rebond')}
              disabled={isFastUnstaking}
              onClick={() => setSection(1)}
            />
          </div>
        </section>
      </div>
    </ItemWrapper>
  );
};
