// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faGear } from '@fortawesome/free-solid-svg-icons';
import { useBalances } from 'contexts/Accounts/Balances';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useStaking } from 'contexts/Staking';
import { useUnstaking } from 'library/Hooks/useUnstaking';
import { Stat } from 'library/Stat';
import { useTranslation } from 'react-i18next';
import { clipAddress } from 'Utils';

export const ControllerStatus = () => {
  const { t } = useTranslation('pages');
  const { isReady } = useApi();
  const { openModalWith } = useModal();
  const { isFastUnstaking } = useUnstaking();
  const { getBondedAccount } = useBalances();
  const { inSetup, hasController } = useStaking();
  const { activeAccount, isReadOnlyAccount, getAccount } = useConnect();
  const controller = getBondedAccount(activeAccount);

  return (
    <Stat
      label={t('nominate.controllerAccount', { ns: 'pages' })}
      helpKey="Stash and Controller Accounts"
      stat={
        controller
          ? {
              address: controller,
              display: getAccount(controller)?.name || clipAddress(controller),
            }
          : `${t('nominate.none')}`
      }
      buttons={
        !inSetup()
          ? [
              {
                title: t('nominate.change'),
                icon: faGear,
                small: true,
                disabled:
                  !isReady ||
                  !hasController() ||
                  isReadOnlyAccount(activeAccount) ||
                  isFastUnstaking,
                onClick: () => openModalWith('UpdateController', {}, 'large'),
              },
            ]
          : []
      }
      copy={
        !controller
          ? undefined
          : {
              content: controller,
              notification: {
                title: t('nominate.addressCopied'),
                subtitle: controller,
              },
            }
      }
    />
  );
};
