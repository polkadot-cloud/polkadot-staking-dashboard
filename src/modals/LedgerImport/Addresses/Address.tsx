// Copyright 2023 @paritytech/polkadot-live authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  faCheck,
  faPen,
  faPlus,
  faTimes,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonMono, ButtonText } from '@polkadotcloud/core-ui';
import {
  clipAddress,
  localStorageOrDefault,
  unescape,
} from '@polkadotcloud/utils';
import { useApi } from 'contexts/Api';
import { useLedgerHardware } from 'contexts/Hardware/Ledger';
import { getLedgerApp, getLocalLedgerAddresses } from 'contexts/Hardware/Utils';
import type { LedgerAddress } from 'contexts/Hardware/types';
import { useOverlay } from 'contexts/Overlay';
import { Identicon } from 'library/Identicon';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Confirm } from './Confirm';
import { Remove } from './Remove';
import type { AddressProps } from './types';

export const Address = ({ address, index }: AddressProps) => {
  const { t } = useTranslation('modals');
  const { network } = useApi();
  const { openOverlayWith } = useOverlay();
  const { ledgerAccountExists, renameLedgerAccount } = useLedgerHardware();
  const { appName } = getLedgerApp(network.name);

  // store whether this address is being edited.
  const [editing, setEditing] = useState<boolean>(false);

  // store the current name of the address
  const initialName = (() => {
    const localAddress = getLocalLedgerAddresses().find(
      (i) => i.address === address && i.network === network.name
    );
    return localAddress?.name
      ? unescape(localAddress.name)
      : clipAddress(address);
  })();
  const [name, setName] = useState<string>(initialName);

  // store the currently edited name.
  const [editName, setEditName] = useState<string>(initialName);

  const cancelEditing = () => {
    setEditName(name);
    setEditing(false);
  };

  const commitEdit = () => {
    let newName = editName;
    if (editName === '') {
      newName = clipAddress(address);
    }
    setName(newName);
    setEditName(newName);
    setEditing(false);
    renameLocalAccount();
    renameLedgerAccount(address, newName);
  };
  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    let val = e.currentTarget.value || '';
    val = unescape(val);
    setEditName(val);
  };

  const renameLocalAccount = () => {
    let localLedger = localStorageOrDefault(
      'ledger_addresses',
      [],
      true
    ) as LedgerAddress[];
    if (!localLedger) {
      return false;
    }
    localLedger = localLedger?.map((i) => {
      if (i.address !== address || i.network !== network.name) {
        return i;
      }
      return {
        ...i,
        name: editName,
      };
    });
    localStorage.setItem('ledger_addresses', JSON.stringify(localLedger));
  };

  const isImported = ledgerAccountExists(address);

  return (
    <div className="item">
      <div>
        <Identicon value={address} size={38} />
        <div className="inner">
          <section className="row">
            <h5 className="label">
              <span className="withBg">
                {appName} {t('account')} {index + 1}
              </span>
            </h5>
          </section>
          <section className="row">
            <FontAwesomeIcon
              icon={faPen}
              transform="shrink-2"
              className="icon"
              opacity={isImported ? 0.1 : 0.5}
            />
            <input
              disabled={isImported}
              type="text"
              value={editing ? editName : name}
              onChange={(e: React.FormEvent<HTMLInputElement>) =>
                handleChange(e)
              }
              onFocus={() => setEditing(true)}
              onBlur={() => commitEdit()}
              onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === 'Enter') {
                  commitEdit();
                  e.currentTarget.blur();
                }
              }}
            />
            {editing ? (
              <div style={{ display: 'flex' }}>
                &nbsp;
                <button
                  type="button"
                  className="edit"
                  onClick={() => commitEdit()}
                >
                  <FontAwesomeIcon
                    icon={faCheck}
                    transform="grow-1"
                    className="icon"
                  />
                </button>
                &nbsp;
                <button
                  type="button"
                  className="edit"
                  onClick={() => cancelEditing()}
                >
                  <FontAwesomeIcon icon={faXmark} transform="grow-1" />
                </button>
              </div>
            ) : null}
          </section>
          <h5 className="addressFull">
            <span>{address}</span>
          </h5>
        </div>
      </div>
      <div>
        {isImported ? (
          <>
            <ButtonMono
              iconLeft={faTimes}
              text={t('remove')}
              onClick={() => {
                openOverlayWith(<Remove address={address} />, 'small');
              }}
            />
          </>
        ) : (
          <ButtonText
            iconLeft={faPlus}
            text={t('import')}
            onClick={() => {
              openOverlayWith(
                <Confirm address={address} index={index} />,
                'small'
              );
            }}
          />
        )}
      </div>
    </div>
  );
};
