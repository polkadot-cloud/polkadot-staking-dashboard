// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  faCheckCircle,
  faExternalLinkAlt,
} from '@fortawesome/free-solid-svg-icons';
import { ButtonPrimaryInvert, Separator } from '@polkadotcloud/core-ui';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useTransferOptions } from 'contexts/TransferOptions';
import { useTranslation } from 'react-i18next';
import { MoreWrapper } from './Wrappers';

export const BalanceLinks = () => {
  const { t } = useTranslation('pages');
  const { name } = useApi().network;
  const { activeAccount, accountHasSigner } = useConnect();
  const { openModalWith } = useModal();
  const { reserve } = useTransferOptions();

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
          <ButtonPrimaryInvert
            disabled={!activeAccount || !accountHasSigner(activeAccount)}
            lg
            iconTransform="shrink-2"
            onClick={() => openModalWith('UpdateReserve')}
            iconRight={reserve.toNumber() !== 0 ? faCheckCircle : undefined}
            text={t('overview.updateReserve')}
          />
        </div>
      </section>
    </MoreWrapper>
  );
};
