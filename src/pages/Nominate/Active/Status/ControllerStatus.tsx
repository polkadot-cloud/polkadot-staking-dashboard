// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { clipAddress } from '@polkadotcloud/utils';
import { useTranslation } from 'react-i18next';
import { useBonded } from 'contexts/Bonded';
import { useConnect } from 'contexts/Connect';
import { Stat } from 'library/Stat';

export const ControllerStatus = () => {
  const { t } = useTranslation('pages');
  const { getBondedAccount } = useBonded();
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
