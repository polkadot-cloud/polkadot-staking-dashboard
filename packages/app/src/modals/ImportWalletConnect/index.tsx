// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faRefresh } from '@fortawesome/free-solid-svg-icons';
import { Polkicon } from '@w3ux/react-polkicon';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { usePrompt } from 'contexts/Prompt';
import WalletConnectSVG from '@w3ux/extension-assets/WalletConnect.svg?react';
import { Heading } from 'library/Import/Heading';
import { NoAccounts } from 'library/Import/NoAccounts';
import { AddressesWrapper } from 'library/Import/Wrappers';
import type { AnyJson } from '@w3ux/types';
import { useOverlay } from 'kits/Overlay/Provider';
import { useOtherAccounts } from 'contexts/Connect/OtherAccounts';
import { ButtonPrimary } from 'ui-buttons';
import { ButtonText } from 'kits/Buttons/ButtonText';
import { HardwareAddress } from 'library/Hardware/HardwareAddress';
import { HardwareStatusBar } from 'library/Hardware/HardwareStatusBar';
import { useWcAccounts } from '@w3ux/react-connect-kit';
import { useNetwork } from 'contexts/Network';
import { useWalletConnect } from 'contexts/WalletConnect';
import { useApi } from 'contexts/Api';

export const ImportWalletConnect = () => {
  const { t } = useTranslation();
  const { addWcAccount, getWcAccounts, wcAccountExists, renameWcAccount } =
    useWcAccounts();
  const { api } = useApi();
  const { network } = useNetwork();
  const { status: promptStatus } = usePrompt();
  const { replaceModal, setModalResize } = useOverlay().modal;
  const { wcInitialized, fetchAddresses } = useWalletConnect();
  const { renameOtherAccount, addOtherAccounts } = useOtherAccounts();

  const wcAccounts = getWcAccounts(network);

  const renameHandler = (address: string, newName: string) => {
    renameWcAccount(network, address, newName);
    renameOtherAccount(address, newName);
  };

  // Handle wallet account importing.
  const handleImportAddresses = async () => {
    if (!wcInitialized || !api) {
      return;
    }

    // Fetch wallet connect accounts.
    const filteredAccounts = await fetchAddresses();

    // Save accounts to local storage.
    filteredAccounts.forEach((address) => {
      const account = addWcAccount(network, address, wcAccounts.length);
      if (account) {
        addOtherAccounts([account]);
      }
    });
  };

  useEffect(() => {
    setModalResize();
  }, [JSON.stringify(wcAccounts)]);

  return wcAccounts.length === 0 ? (
    <NoAccounts
      Icon={WalletConnectSVG}
      text={t('noAccounts', { ns: 'modals' })}
    >
      <div>
        <ButtonPrimary
          lg
          onClick={() => handleImportAddresses()}
          iconLeft={faRefresh}
          text={t('import', { ns: 'modals' })}
          disabled={promptStatus !== 0}
        />
      </div>
    </NoAccounts>
  ) : (
    <>
      <Heading title="Wallet Connect" />
      <AddressesWrapper>
        <div className="items">
          {wcAccounts.map(({ address, name, index }: AnyJson, i) => (
            <HardwareAddress
              network={network}
              key={i}
              address={address}
              index={index}
              initial={name}
              allowAction={false}
              Identicon={<Polkicon address={address} />}
              existsHandler={wcAccountExists}
              renameHandler={renameHandler}
              openRemoveHandler={() => {
                // Do nothing.
              }}
              openConfirmHandler={() => {
                // Do nothing.
              }}
              t={{
                tRemove: t('remove', { ns: 'modals' }),
                tImport: t('import', { ns: 'modals' }),
              }}
            />
          ))}
        </div>
        <div className="more">
          <ButtonText
            onClick={() => handleImportAddresses()}
            iconLeft={faRefresh}
            text={t('refreshAccounts', { ns: 'modals' })}
            disabled={promptStatus !== 0}
          />
        </div>
      </AddressesWrapper>
      <HardwareStatusBar
        show
        Icon={WalletConnectSVG}
        text={`Wallet Connect ${t('accounts', { ns: 'library' })}`}
        inProgress={false}
        handleDone={() =>
          replaceModal({ key: 'Connect', options: { disableScroll: true } })
        }
        t={{
          tDone: t('done', { ns: 'library' }),
          tCancel: t('cancel', { ns: 'library' }),
        }}
      />
    </>
  );
};
