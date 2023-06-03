// Copyright 2023 @paritytech/polkadot-live authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  faCheck,
  faPlus,
  faTimes,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonText } from '@polkadotcloud/core-ui';
import { clipAddress, unescape } from '@polkadotcloud/utils';
import { Identicon } from 'library/Identicon';
import React, { useState } from 'react';
import type { AddressProps } from './types';

export const Address = ({
  address,
  index,
  initial,
  badgePrefix,
  disableEditIfImported = false,
  existsHandler,
  renameHandler,
  openConfirmHandler,
  openRemoveHandler,
  t: { tAccount, tImport, tRemove },
}: AddressProps) => {
  // store whether this address is being edited.
  const [editing, setEditing] = useState<boolean>(false);

  const [name, setName] = useState<string>(initial);

  // store the currently edited name.
  const [editName, setEditName] = useState<string>(initial);

  const cancelEditing = () => {
    setEditName(name);
    setEditing(false);
  };

  const commitEdit = () => {
    let newName = editName;
    if (editName === '') {
      newName = clipAddress(address);
    }
    if (newName !== name) {
      setName(newName);
      setEditName(newName);
      renameHandler(address, newName);
    }
    setEditing(false);
  };
  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    let val = e.currentTarget.value || '';
    val = unescape(val);
    setEditName(val);
  };

  const isImported = existsHandler(address);

  return (
    <div className="item">
      <div className="content">
        <div className="head">
          <h5>
            {badgePrefix} {tAccount} {index + 1}
          </h5>
        </div>
        <div className="inner">
          <div className="identicon">
            <Identicon value={address} size={38} />
          </div>
          <div>
            <section className="row">
              <input
                disabled={isImported && disableEditIfImported}
                type="text"
                value={editing ? editName : name}
                onChange={(e) => handleChange(e)}
                onFocus={() => setEditing(true)}
                onBlur={() => commitEdit()}
                onKeyUp={(e) => {
                  if (e.key === 'Enter') {
                    commitEdit();
                    e.currentTarget.blur();
                  }
                }}
              />

              {editing && (
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
              )}
            </section>
            <h5 className="full">
              <span>{address}</span>
            </h5>
          </div>
        </div>
      </div>
      <div className="action">
        {isImported ? (
          <>
            <ButtonText
              iconLeft={faTimes}
              text={tRemove}
              onClick={() => openRemoveHandler(address)}
            />
          </>
        ) : (
          <ButtonText
            iconLeft={faPlus}
            text={tImport}
            onClick={() => openConfirmHandler(address, index)}
          />
        )}
      </div>
    </div>
  );
};
