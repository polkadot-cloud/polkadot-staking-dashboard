// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import {
  ButtonPrimary,
  ButtonPrimaryInvert,
  Separator,
} from '@polkadotcloud/core-ui';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useTranslation } from 'react-i18next';
import { MoreWrapper } from './Wrappers';

export const BalanceLinks = () => {
  const { t } = useTranslation('pages');
  const { name } = useApi().network;
  const { activeAccount, accountHasSigner } = useConnect();
  const { openModalWith } = useModal();

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
            disabled={!activeAccount}
          />
        </div>
        <div>
          {' '}
          <ButtonPrimary
            disabled={!activeAccount || !accountHasSigner(activeAccount)}
            marginRight
            onClick={() => openModalWith('UpdateReserve')}
            text={t('overview.updateReserve')}
          />
        </div>
      </section>
    </MoreWrapper>
  );
};
