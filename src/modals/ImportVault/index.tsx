// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faQrcode } from '@fortawesome/free-solid-svg-icons';
import { ButtonPrimary, ButtonText } from '@polkadotcloud/core-ui';
import { capitalizeFirstLetter } from '@polkadotcloud/utils';
import { useApi } from 'contexts/Api';
import { useVaultHardware } from 'contexts/Hardware/Vault';
import { useModal } from 'contexts/Modal';
import { useOverlay } from 'contexts/Overlay';
import { ReactComponent as Icon } from 'img/polkadotVault.svg';
import { Address } from 'library/Import/Address';
import { Heading } from 'library/Import/Heading';
import { NoAccounts } from 'library/Import/NoAccounts';
import { StatusBar } from 'library/Import/StatusBar';
import { AddressesWrapper } from 'library/Import/Wrappers';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { AnyJson } from 'types';
import { Reader } from './Reader';

export const ImportVault = () => {
  const { t } = useTranslation();
  const { network } = useApi();
  const { openOverlayWith, status: overlayStatus } = useOverlay();
  const { replaceModalWith } = useModal();

  const {
    vaultAccounts,
    vaultAccountExists,
    renameVaultAccount,
    addVaultAccount,
    removeVaultAccount,
    getVaultAccount,
  } = useVaultHardware();
  const { setResize } = useModal();

  useEffect(() => {
    setResize();
  }, [vaultAccounts]);

  return (
    <>
      <Heading title={vaultAccounts.length ? 'Polkadot Vault' : ''} />
      {vaultAccounts.length === 0 ? (
        <NoAccounts
          Icon={Icon}
          text={t('noVaultAccountsImported', { ns: 'modals' })}
        >
          <div>
            <ButtonPrimary
              lg
              iconLeft={faQrcode}
              text={t('importAccount', { ns: 'modals' })}
              disabled={overlayStatus !== 0}
              onClick={() => {
                openOverlayWith(<Reader />, 'small');
              }}
            />
          </div>
        </NoAccounts>
      ) : (
        <>
          <AddressesWrapper>
            <div className="items">
              {vaultAccounts.map(({ address, name, index }: AnyJson, i) => (
                <Address
                  key={i}
                  address={address}
                  index={index}
                  initial={name}
                  badgePrefix={capitalizeFirstLetter(network.name)}
                  existsHandler={vaultAccountExists}
                  renameHandler={renameVaultAccount}
                  addHandler={addVaultAccount}
                  removeHandler={removeVaultAccount}
                  getHandler={getVaultAccount}
                />
              ))}
            </div>
            <div className="more">
              <ButtonText
                iconLeft={faQrcode}
                text={t('importAnotherAccount', { ns: 'modals' })}
                disabled={overlayStatus !== 0}
                onClick={() => {
                  openOverlayWith(<Reader />, 'small');
                }}
              />
            </div>
          </AddressesWrapper>
          <StatusBar
            StatusBarIcon={Icon}
            text={t('vaultAccounts', {
              ns: 'modals',
              count: vaultAccounts.length,
            })}
            inProgress={false}
            handleDone={() =>
              replaceModalWith('Connect', { disableScroll: true }, 'large')
            }
            t={{
              tDone: t('done', { ns: 'library' }),
              tCancel: t('cancel', { ns: 'library' }),
            }}
          />
        </>
      )}
    </>
  );
};
