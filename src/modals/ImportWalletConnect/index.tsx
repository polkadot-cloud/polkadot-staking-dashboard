// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faQrcode, faRefresh } from '@fortawesome/free-solid-svg-icons';
import { Polkicon } from '@w3ux/react-polkicon';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { usePrompt } from 'contexts/Prompt';
import WalletConnectSVG from '@w3ux/extension-assets/WalletConnect.svg?react';
import { Confirm } from 'library/Import/Confirm';
import { Heading } from 'library/Import/Heading';
import { NoAccounts } from 'library/Import/NoAccounts';
import { Remove } from 'library/Import/Remove';
import { AddressesWrapper } from 'library/Import/Wrappers';
import type { AnyJson } from '@w3ux/types';
import { useOverlay } from 'kits/Overlay/Provider';
import { useOtherAccounts } from 'contexts/Connect/OtherAccounts';
import { ButtonPrimary } from 'kits/Buttons/ButtonPrimary';
import { ButtonText } from 'kits/Buttons/ButtonText';
import { HardwareAddress } from 'library/Hardware/HardwareAddress';
import { HardwareStatusBar } from 'library/Hardware/HardwareStatusBar';
import { useWcAccounts } from '@w3ux/react-connect-kit';
import { useNetwork } from 'contexts/Network';

export const ImportWalletConnect = () => {
  const { t } = useTranslation();
  const { network } = useNetwork();
  const { replaceModal } = useOverlay().modal;
  const { renameOtherAccount } = useOtherAccounts();
  const { openPromptWith, status: promptStatus } = usePrompt();

  const {
    addWcAccount,
    getWcAccount,
    getWcAccounts,
    wcAccountExists,
    renameWcAccount,
    removeWcAccount,
  } = useWcAccounts();
  const { setModalResize } = useOverlay().modal;

  const wcAccounts = getWcAccounts(network);

  const renameHandler = (address: string, newName: string) => {
    renameWcAccount(network, address, newName);
    renameOtherAccount(address, newName);
  };

  const openConfirmHandler = (address: string, index: number) => {
    openPromptWith(
      <Confirm address={address} index={index} addHandler={addWcAccount} />,
      'small'
    );
  };

  const openRemoveHandler = (address: string) => {
    openPromptWith(
      <Remove
        address={address}
        removeHandler={removeWcAccount}
        getHandler={getWcAccount}
      />,
      'small'
    );
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
          iconLeft={faQrcode}
          text={t('importAccount', { ns: 'modals' })}
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
              Identicon={<Polkicon address={address} size={40} />}
              existsHandler={wcAccountExists}
              renameHandler={renameHandler}
              openRemoveHandler={openRemoveHandler}
              openConfirmHandler={openConfirmHandler}
              t={{
                tRemove: t('remove', { ns: 'modals' }),
                tImport: t('import', { ns: 'modals' }),
              }}
            />
          ))}
        </div>
        <div className="more">
          <ButtonText
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
