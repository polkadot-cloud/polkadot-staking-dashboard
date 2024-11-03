// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { Polkicon } from '@w3ux/react-polkicon';
import { ellipsisFn, unescape } from '@w3ux/utils';
import { useTranslation } from 'react-i18next';
import { useLedgerHardware } from 'contexts/LedgerHardware';
import { getLocalLedgerAddresses } from 'contexts/LedgerHardware/Utils';
import { usePrompt } from 'contexts/Prompt';
import { Confirm } from 'library/Import/Confirm';
import { Remove } from 'library/Import/Remove';
import { AddressesWrapper } from 'library/Import/Wrappers';
import type { AnyJson } from '@w3ux/types';
import { useNetwork } from 'contexts/Network';
import { useOtherAccounts } from 'contexts/Connect/OtherAccounts';
import { ButtonText } from 'kits/Buttons/ButtonText';
import { HardwareAddress } from 'library/Hardware/HardwareAddress';
import { useLedgerAccounts } from '@w3ux/react-connect-kit';

export const Addresess = ({ addresses, onGetAddress }: AnyJson) => {
  const { t } = useTranslation('modals');

  const {
    ledgerAccountExists,
    getLedgerAccount,
    addLedgerAccount,
    removeLedgerAccount,
    renameLedgerAccount,
  } = useLedgerAccounts();
  const { network } = useNetwork();
  const { openPromptWith } = usePrompt();
  const { getIsExecuting } = useLedgerHardware();
  const { renameOtherAccount } = useOtherAccounts();

  const source = 'ledger';
  const isExecuting = getIsExecuting();

  const renameHandler = (address: string, newName: string) => {
    renameLedgerAccount(network, address, newName);
    renameOtherAccount(address, newName);
  };

  const openConfirmHandler = (address: string, index: number) => {
    openPromptWith(
      <Confirm
        address={address}
        index={index}
        addHandler={addLedgerAccount}
        source={source}
      />,
      'small'
    );
  };

  const openRemoveHandler = (address: string) => {
    openPromptWith(
      <Remove
        address={address}
        removeHandler={removeLedgerAccount}
        getHandler={getLedgerAccount}
        source={source}
      />,
      'small'
    );
  };

  return (
    <AddressesWrapper>
      <div className="items">
        {addresses.map(({ address, index }: AnyJson, i: number) => {
          const initialName = (() => {
            const localAddress = getLocalLedgerAddresses().find(
              (a) => a.address === address && a.network === network
            );
            return localAddress?.name
              ? unescape(localAddress.name)
              : ellipsisFn(address);
          })();

          return (
            <HardwareAddress
              key={i}
              network={network}
              address={address}
              index={index}
              initial={initialName}
              Identicon={<Polkicon address={address} />}
              existsHandler={ledgerAccountExists}
              renameHandler={renameHandler}
              openRemoveHandler={openRemoveHandler}
              openConfirmHandler={openConfirmHandler}
              t={{
                tRemove: t('remove'),
                tImport: t('import'),
              }}
            />
          );
        })}
      </div>
      <div className="more">
        <ButtonText
          iconLeft={faArrowDown}
          text={isExecuting ? t('gettingAccount') : t('getAnotherAccount')}
          disabled={isExecuting}
          onClick={async () => {
            await onGetAddress();
          }}
        />
      </div>
    </AddressesWrapper>
  );
};
