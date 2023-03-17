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
import { ButtonMono, ButtonText } from '@polkadotcloud/dashboard-ui';
import { useLedgerHardware } from 'contexts/Hardware/Ledger';
import { useOverlay } from 'contexts/Overlay';
import { Identicon } from 'library/Identicon';
import React, { useState } from 'react';
import type { AnyJson } from 'types';
import { clipAddress, localStorageOrDefault, unescape } from 'Utils';
import { Confirm } from './Confirm';
import { Remove } from './Remove';
import type { AddressProps } from './types';

export const Address = ({ address, index }: AddressProps) => {
  const { openOverlayWith } = useOverlay();
  const { ledgerAccountExists } = useLedgerHardware();

  // store whether this address is being edited.
  const [editing, setEditing] = useState<boolean>(false);

  // store the current name of the address
  const initialName = () => {
    const defaultName = clipAddress(address);
    const localLedger = localStorageOrDefault(
      'ledger_addresses',
      [],
      true
    ) as Array<AnyJson>;
    if (!localLedger) {
      return defaultName;
    }
    const localAddress = localLedger.find(
      (i: AnyJson) => i.address === address
    );
    return localAddress?.name ? unescape(localAddress.name) : defaultName;
  };

  const [name, setName] = useState<string>(initialName());

  // store the currently edited name.
  const [editName, setEditName] = useState<string>(initialName());

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
    ) as Array<AnyJson>;
    if (!localLedger) {
      return false;
    }
    localLedger = localLedger?.map((i: AnyJson) => {
      if (i.address !== address) {
        return i;
      }
      return {
        ...i,
        name: editName,
      };
    });

    localStorage.setItem('ledger_addresses', JSON.stringify(localLedger));
  };

  return (
    <div className="item">
      <div>
        <Identicon value={address} size={38} />
        <div className="text">
          <section className="row">
            <h5 className="label">
              <span className="withBg">Polkadot Account {index + 1}</span>
            </h5>
          </section>
          <section className="row">
            <FontAwesomeIcon icon={faPen} transform="shrink-2" opacity={0.5} />
            <input
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
                  <FontAwesomeIcon icon={faCheck} transform="grow-1" />
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
          <h5 className="addressFull">{address}</h5>
        </div>
      </div>
      <div>
        {ledgerAccountExists(address) ? (
          <>
            <ButtonMono
              iconLeft={faTimes}
              text="Remove"
              onClick={() => {
                openOverlayWith(<Remove address={address} />, 'small');
              }}
            />
          </>
        ) : (
          <ButtonText
            iconLeft={faPlus}
            text="Import"
            onClick={() => {
              openOverlayWith(<Confirm address={address} />, 'small');
            }}
          />
        )}
      </div>
    </div>
  );
};
