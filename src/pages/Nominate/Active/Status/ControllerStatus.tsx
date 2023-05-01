// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { clipAddress } from '@polkadotcloud/utils';
import { useBalances } from 'contexts/Balances';
import { useConnect } from 'contexts/Connect';
import { Stat } from 'library/Stat';
import { useTranslation } from 'react-i18next';

export const ControllerStatus = () => {
  const { t } = useTranslation('pages');
  const { getBondedAccount } = useBalances();
  const { activeAccount, getAccount } = useConnect();
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
