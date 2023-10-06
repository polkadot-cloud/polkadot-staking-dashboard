// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useTranslation } from 'react-i18next';
import { useTxMeta } from 'contexts/TxMeta';
import type { MaybeAccount } from 'types';
import { useActiveAccount } from 'contexts/Connect/ActiveAccount';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';

export const useSignerWarnings = () => {
  const { t } = useTranslation('modals');
  const { activeProxy } = useActiveAccount();
  const { accountHasSigner } = useImportedAccounts();
  const { controllerSignerAvailable } = useTxMeta();

  const getSignerWarnings = (
    account: MaybeAccount,
    controller = false,
    proxySupported = false
  ) => {
    const warnings = [];

    if (controller) {
      switch (controllerSignerAvailable(account, proxySupported)) {
        case 'controller_not_imported':
          warnings.push(`${t('controllerImported')}`);
          break;
        case 'read_only':
          warnings.push(`${t('readOnlyCannotSign')}`);
          break;
        default:
          break;
      }
    } else if (
      !(
        accountHasSigner(account) ||
        (accountHasSigner(activeProxy) && proxySupported)
      )
    ) {
      warnings.push(`${t('readOnlyCannotSign')}`);
    }

    return warnings;
  };

  return { getSignerWarnings };
};
