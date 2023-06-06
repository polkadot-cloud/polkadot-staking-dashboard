// Copyright 2023 @paritytech/polkadot-live authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { ButtonText, HardwareAddress } from '@polkadotcloud/core-ui';
import { clipAddress, unescape } from '@polkadotcloud/utils';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useLedgerHardware } from 'contexts/Hardware/Ledger';
import { getLocalLedgerAddresses } from 'contexts/Hardware/Utils';
import { useOverlay } from 'contexts/Overlay';
import { Identicon } from 'library/Identicon';
import { Confirm } from 'library/Import/Confirm';
import { Remove } from 'library/Import/Remove';
import { AddressesWrapper } from 'library/Import/Wrappers';
import { useTranslation } from 'react-i18next';
import type { AnyJson } from 'types';

export const Addresess = ({ addresses, handleLedgerLoop }: AnyJson) => {
  const { t } = useTranslation('modals');
  const { network } = useApi();
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
  const { openOverlayWith } = useOverlay();
  const { renameImportedAccount } = useConnect();
  const isExecuting = getIsExecuting();

  const renameHandler = (address: string, newName: string) => {
    renameLedgerAccount(address, newName);
    renameImportedAccount(address, newName);
  };

  const openConfirmHandler = (address: string, index: number) => {
    openOverlayWith(
      <Confirm address={address} index={index} addHandler={addLedgerAccount} />,
      'small'
    );
  };

  const openRemoveHandler = (address: string) => {
    openOverlayWith(
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
                (a) => a.address === address && a.network === network.name
              );
              return localAddress?.name
                ? unescape(localAddress.name)
                : clipAddress(address);
            })();

            return (
              <HardwareAddress
                key={i}
                address={address}
                index={index}
                initial={initialName}
                Identicon={<Identicon value={address} size={40} />}
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
