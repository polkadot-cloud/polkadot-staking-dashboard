// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ButtonSubmit } from '@polkadot-cloud/react';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { ItemWrapper } from './Wrappers';

// eslint-disable-next-line
export const Item = ({ era, payouts, setSection }: any) => {
  const { t } = useTranslation('modals');
  const { network } = useApi();

  return (
    <ItemWrapper>
      <div>
        <section>
          <h2>
            Era {era} Payouts ${network.unit}
          </h2>
          <h4>
            {t('unlocksInEra')} [era] /&nbsp;
            <span>Countdown was here.</span>
          </h4>
        </section>

        <section>
          <div>
            <ButtonSubmit text={t('rebond')} onClick={() => setSection(1)} />
          </div>
        </section>
      </div>
    </ItemWrapper>
  );
};
