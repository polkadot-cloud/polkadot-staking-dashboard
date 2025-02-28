// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faQrcode } from '@fortawesome/free-solid-svg-icons';
import { Polkicon } from '@w3ux/react-polkicon';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useVaultAccounts } from 'contexts/Hardware/Vault/VaultAccounts';
import { usePrompt } from 'contexts/Prompt';
import PolkadotVaultSVG from '@w3ux/extension-assets/PolkadotVault.svg?react';
import { Confirm } from 'library/Import/Confirm';
import { Heading } from 'library/Import/Heading';
import { NoAccounts } from 'library/Import/NoAccounts';
import { Remove } from 'library/Import/Remove';
import { AddressesWrapper } from 'library/Import/Wrappers';
import type { AnyJson } from 'types';
import { useOverlay } from 'kits/Overlay/Provider';
import { useOtherAccounts } from 'contexts/Connect/OtherAccounts';
import { Reader } from './Reader';
import { ButtonPrimary } from 'kits/Buttons/ButtonPrimary';
import { ButtonText } from 'kits/Buttons/ButtonText';
import { HardwareAddress } from 'library/Hardware/HardwareAddress';
import { HardwareStatusBar } from 'library/Hardware/HardwareStatusBar';

export const ImportVault = () => {
  const { t } = useTranslation();
  const { replaceModal } = useOverlay().modal;
  const { renameOtherAccount } = useOtherAccounts();
  const { openPromptWith, status: promptStatus } = usePrompt();

  const {
    vaultAccounts,
    vaultAccountExists,
    renameVaultAccount,
    addVaultAccount,
    removeVaultAccount,
    getVaultAccount,
  } = useVaultAccounts();
  const { setModalResize } = useOverlay().modal;
  const source = 'vault';

  const renameHandler = (address: string, newName: string) => {
    renameVaultAccount(address, newName);
    renameOtherAccount(address, newName);
  };

  const openConfirmHandler = (address: string, index: number) => {
    openPromptWith(
      <Confirm
        address={address}
        index={index}
        addHandler={addVaultAccount}
        source={source}
      />,
      'small'
    );
  };

  const openRemoveHandler = (address: string) => {
    openPromptWith(
      <Remove
        address={address}
        removeHandler={removeVaultAccount}
        getHandler={getVaultAccount}
        source={source}
      />,
      'small'
    );
  };

  useEffect(() => {
    setModalResize();
  }, [vaultAccounts]);

  return vaultAccounts.length === 0 ? (
    <NoAccounts
      Icon={PolkadotVaultSVG}
      text={t('noVaultAccountsImported', { ns: 'modals' })}
    >
      <div>
        <ButtonPrimary
          lg
          iconLeft={faQrcode}
          text={t('importAccount', { ns: 'modals' })}
          disabled={promptStatus !== 0}
          onClick={() => {
            openPromptWith(<Reader />, 'small');
          }}
        />
      </div>
    </NoAccounts>
  ) : (
    <>
      <Heading title={vaultAccounts.length ? 'Polkadot Vault' : ''} />
      <AddressesWrapper>
        <div className="items">
          {vaultAccounts.map(({ address, name, index }: AnyJson, i) => (
            <HardwareAddress
              key={i}
              address={address}
              index={index}
              initial={name}
              Identicon={<Polkicon address={address} size={40} />}
              existsHandler={vaultAccountExists}
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
            iconLeft={faQrcode}
            text={t('importAnotherAccount', { ns: 'modals' })}
            disabled={promptStatus !== 0}
            onClick={() => {
              openPromptWith(<Reader />, 'small');
            }}
          />
        </div>
      </AddressesWrapper>
      <HardwareStatusBar
        show
        Icon={PolkadotVaultSVG}
        text={t('vaultAccounts', {
          ns: 'modals',
          count: vaultAccounts.length,
        })}
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
