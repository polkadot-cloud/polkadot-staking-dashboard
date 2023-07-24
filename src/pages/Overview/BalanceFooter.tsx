// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faCheck, faCheckDouble } from '@fortawesome/free-solid-svg-icons';
import { ButtonPrimaryInvert, Separator } from '@polkadotcloud/core-ui';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useTransferOptions } from 'contexts/TransferOptions';
import { useUi } from 'contexts/UI';
import { useTranslation } from 'react-i18next';
import { MoreWrapper } from './Wrappers';

export const BalanceFooter = () => {
  const { t } = useTranslation('pages');
  const { openModalWith } = useModal();
  const { isNetworkSyncing } = useUi();
  const { activeAccount, accountHasSigner } = useConnect();
  const { feeReserve, getTransferOptions } = useTransferOptions();
  const { edReserved } = getTransferOptions(activeAccount);

  return (
    <MoreWrapper>
      <Separator />
      <h4>{t('overview.moreResources')}</h4>
      <section>
        <ButtonPrimaryInvert
          lg
          disabled={
            isNetworkSyncing ||
            !activeAccount ||
            !accountHasSigner(activeAccount)
          }
          iconTransform="grow-1"
          onClick={() => openModalWith('UpdateReserve', {}, 'small')}
          iconRight={
            isNetworkSyncing
              ? undefined
              : !feeReserve.isZero() && !edReserved.isZero()
              ? faCheckDouble
              : feeReserve.isZero() && edReserved.isZero()
              ? undefined
              : faCheck
          }
          text={t('overview.updateReserve')}
        />
      </section>
    </MoreWrapper>
  );
};
