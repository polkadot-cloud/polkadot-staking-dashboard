// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faGear, faWallet } from '@fortawesome/free-solid-svg-icons';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useStaking } from 'contexts/Staking';
import { useUi } from 'contexts/UI';
import { PayeeItem, usePayeeConfig } from 'library/Hooks/usePayeeConfig';
import { useUnstaking } from 'library/Hooks/useUnstaking';
import { Stat } from 'library/Stat';
import { useTranslation } from 'react-i18next';

export const PayoutDestinationStatus = () => {
  const { t } = useTranslation('pages');
  const { isSyncing } = useUi();
  const { openModalWith } = useModal();
  const { staking, inSetup } = useStaking();
  const { isFastUnstaking } = useUnstaking();
  const { getPayeeItems } = usePayeeConfig();
  const { activeAccount, isReadOnlyAccount } = useConnect();
  const { payee } = staking;

  // Get payee status text to display.
  const getPayeeStatus = () => {
    if (inSetup()) {
      return t('nominate.notAssigned');
    }
    const status = getPayeeItems(true).find(
      (p: PayeeItem) => p.value === payee.destination
    )?.activeTitle;

    if (status) {
      return status;
    }
    return t('nominate.notAssigned');
  };

  // Get the payee destination icon to display, falling back to wallet icon.
  const payeeIcon = inSetup()
    ? undefined
    : getPayeeItems(true).find((p: PayeeItem) => p.value === payee.destination)
        ?.icon || faWallet;

  return (
    <Stat
      label={t('nominate.payoutDestination')}
      helpKey="Payout Destination"
      icon={payeeIcon}
      stat={getPayeeStatus()}
      buttons={
        !inSetup()
          ? [
              {
                title: t('nominate.update'),
                icon: faGear,
                small: true,
                disabled:
                  inSetup() ||
                  isSyncing ||
                  isReadOnlyAccount(activeAccount) ||
                  isFastUnstaking,
                onClick: () => openModalWith('UpdatePayee', {}, 'small'),
              },
            ]
          : []
      }
    />
  );
};
