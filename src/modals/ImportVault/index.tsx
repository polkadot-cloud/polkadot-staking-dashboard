// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faQrcode } from '@fortawesome/free-solid-svg-icons';
import { ButtonText } from '@polkadotcloud/core-ui';
import { capitalizeFirstLetter } from '@polkadotcloud/utils';
import { useApi } from 'contexts/Api';
import { useVaultHardware } from 'contexts/Hardware/Vault';
import { useModal } from 'contexts/Modal';
import { useOverlay } from 'contexts/Overlay';
import { ReactComponent as Icon } from 'img/polkadotVault.svg';
import { Address } from 'library/Import/Address';
import { Heading } from 'library/Import/Heading';
import { StatusBar } from 'library/Import/StatusBar';
import { AddressesWrapper } from 'library/Import/Wrappers';
import { useEffect } from 'react';
import type { AnyJson } from 'types';
import { Reader } from './Reader';

export const ImportVault = () => {
  const { network } = useApi();
  const { openOverlayWith, status: overlayStatus } = useOverlay();
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
      <Heading title="Polkadot Vault" />
      <AddressesWrapper>
        <div className="items">
          {vaultAccounts.map(({ address, name, index }: AnyJson, i: number) => {
            return (
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
            );
          })}
        </div>
        <div className="more">
          <ButtonText
            iconLeft={faQrcode}
            text="Import An Account"
            disabled={overlayStatus !== 0}
            onClick={() => {
              openOverlayWith(<Reader />, 'small');
            }}
          />
        </div>
      </AddressesWrapper>

      <StatusBar
        StatusBarIcon={Icon}
        text="No Accounts Imported"
        helpKey={undefined}
        inProgress={false}
        handleCancel={() => {}}
      />
    </>
  );
};
