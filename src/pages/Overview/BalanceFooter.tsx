// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faCoins } from '@fortawesome/free-solid-svg-icons';
import { ButtonPrimaryInvert, Separator } from '@polkadotcloud/core-ui';
import { useTranslation } from 'react-i18next';
import { MoreWrapper } from './Wrappers';

export const BalanceFooter = () => {
  const { t } = useTranslation('pages');

  return (
    <MoreWrapper>
      <Separator />
      <h4>{t('overview.moreResources')}</h4>
      <section>
        <ButtonPrimaryInvert
          iconLeft={faCoins}
          lg
          disabled={false}
          text="Other Balances"
        />
      </section>
    </MoreWrapper>
  );
};
