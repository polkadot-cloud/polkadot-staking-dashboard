// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { ButtonPrimaryInvert } from '@polkadotcloud/core-ui';
import { Separator } from 'Wrappers';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useTranslation } from 'react-i18next';
import { MoreWrapper } from './Wrappers';

export const BalanceLinks = () => {
  const { t } = useTranslation('pages');
  const { name } = useApi().network;
  const { activeAccount } = useConnect();

  return (
    <MoreWrapper>
      <Separator />
      <h4>{t('overview.moreResources')}</h4>
      <section>
        <div>
          <ButtonPrimaryInvert
            onClick={() =>
              window.open(
                `https://${name}.subscan.io/account/${activeAccount}`,
                '_blank'
              )
            }
            lg
            iconRight={faExternalLinkAlt}
            iconTransform="shrink-2"
            text="Subscan"
          />
        </div>
      </section>
    </MoreWrapper>
  );
};
