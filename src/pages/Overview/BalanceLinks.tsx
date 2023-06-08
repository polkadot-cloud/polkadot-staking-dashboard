// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  faCheck,
  faCheckDouble,
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
  const { reserve, getTransferOptions } = useTransferOptions();
  const { forceReserved } = getTransferOptions(activeAccount);

  return (
    <MoreWrapper>
      <Separator />
      <h4>{t('overview.moreResources')}</h4>
      <section>
        <ButtonPrimaryInvert
          lg
          onClick={() =>
            window.open(
              `https://${name}.subscan.io/account/${activeAccount}`,
              '_blank'
            )
          }
          iconRight={faExternalLinkAlt}
          iconTransform="shrink-2"
          text="Subscan"
          disabled={!activeAccount}
        />
        <ButtonPrimaryInvert
          lg
          marginLeft
          disabled={!activeAccount || !accountHasSigner(activeAccount)}
          iconTransform="grow-1"
          onClick={() => openModalWith('UpdateReserve', {}, 'small')}
          iconRight={
            !reserve.isZero() && !forceReserved.isZero()
              ? faCheckDouble
              : reserve.isZero() && forceReserved.isZero()
              ? undefined
              : faCheck
          }
          text={t('overview.updateReserve')}
        />
      </section>
    </MoreWrapper>
  );
};
