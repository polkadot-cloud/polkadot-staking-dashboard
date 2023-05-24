// Copyright 2023 @paritytech/polkadot-live authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { ButtonText } from '@polkadotcloud/core-ui';
import { clipAddress, unescape } from '@polkadotcloud/utils';
import { useApi } from 'contexts/Api';
import { useLedgerHardware } from 'contexts/Hardware/Ledger';
import { getLocalLedgerAddresses } from 'contexts/Hardware/Utils';
import { Address } from 'library/Import/Address';
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
    pairDevice,
  } = useLedgerHardware();
  const isExecuting = getIsExecuting();

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
              <Address
                key={i}
                address={address}
                index={index}
                initial={initialName}
                existsHandler={ledgerAccountExists}
                renameHandler={renameLedgerAccount}
                addHandler={addLedgerAccount}
                removeHandler={removeLedgerAccount}
                getHandler
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
