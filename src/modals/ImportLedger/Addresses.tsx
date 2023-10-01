// Copyright 2023 @paritytech/polkadot-live authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { ButtonText, HardwareAddress, Polkicon } from '@polkadot-cloud/react';
import { ellipsisFn, unescape } from '@polkadot-cloud/utils';
import { useTranslation } from 'react-i18next';
import { useConnect } from 'contexts/Connect';
import { useLedgerHardware } from 'contexts/Hardware/Ledger';
import { getLocalLedgerAddresses } from 'contexts/Hardware/Utils';
import { usePrompt } from 'contexts/Prompt';
import { Confirm } from 'library/Import/Confirm';
import { Remove } from 'library/Import/Remove';
import { AddressesWrapper } from 'library/Import/Wrappers';
import type { AnyJson } from 'types';
import { useNetwork } from 'contexts/Network';

export const Addresess = ({ addresses, handleLedgerLoop }: AnyJson) => {
  const { t } = useTranslation('modals');
  const { network } = useNetwork();

  const {
    getIsExecuting,
    ledgerAccountExists,
    renameLedgerAccount,
    addLedgerAccount,
    removeLedgerAccount,
    setIsExecuting,
    getLedgerAccount,
    pairDevice,
  } = useLedgerHardware();
  const { openPromptWith } = usePrompt();
  const { renameImportedAccount } = useConnect();
  const isExecuting = getIsExecuting();

  const renameHandler = (address: string, newName: string) => {
    renameLedgerAccount(address, newName);
    renameImportedAccount(address, newName);
  };

  const openConfirmHandler = (address: string, index: number) => {
    openPromptWith(
      <Confirm address={address} index={index} addHandler={addLedgerAccount} />,
      'small'
    );
  };

  const openRemoveHandler = (address: string) => {
    openPromptWith(
      <Remove
        address={address}
        removeHandler={removeLedgerAccount}
        getHandler={getLedgerAccount}
      />,
      'small'
    );
  };

  return (
    <>
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
                address={address}
                index={index}
                initial={initialName}
                Identicon={<Polkicon address={address} size={40} />}
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
              // re-pair the device if it has been disconnected.
              const paired = await pairDevice();
              if (paired) {
                setIsExecuting(true);
                handleLedgerLoop();
              }
            }}
          />
        </div>
      </AddressesWrapper>
    </>
  );
};
