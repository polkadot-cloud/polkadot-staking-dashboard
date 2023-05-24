// Copyright 2023 @paritytech/polkadot-live authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  faCheck,
  faPlus,
  faTimes,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonMono, ButtonText } from '@polkadotcloud/core-ui';
import { clipAddress, unescape } from '@polkadotcloud/utils';
import { useConnect } from 'contexts/Connect';
import { useOverlay } from 'contexts/Overlay';
import { Identicon } from 'library/Identicon';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Confirm } from './Confirm';
import { Remove } from './Remove';
import type { AddressProps } from './types';

export const Address = ({
  address,
  index,
  initial,
  badgePrefix,
  disableEditIfImported = false,
  existsHandler,
  renameHandler,
  addHandler,
  removeHandler,
  getHandler,
}: AddressProps) => {
  const { t } = useTranslation('modals');
  const { openOverlayWith } = useOverlay();
  const { renameImportedAccount } = useConnect();

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
    setName(newName);
    setEditName(newName);
    setEditing(false);
    renameHandler(address, newName);
    renameImportedAccount(address, newName);
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
            {badgePrefix} {t('account')} {index + 1}
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
      </div>
      <div className="action">
        {isImported ? (
          <>
            <ButtonMono
              iconLeft={faTimes}
              text={t('remove')}
              onClick={() => {
                openOverlayWith(
                  <Remove
                    address={address}
                    removeHandler={removeHandler}
                    getHandler={getHandler}
                  />,
                  'small'
                );
              }}
            />
          </>
        ) : (
          <ButtonText
            iconLeft={faPlus}
            text={t('import')}
            onClick={() => {
              openOverlayWith(
                <Confirm
                  address={address}
                  index={index}
                  addHandler={addHandler}
                />,
                'small'
              );
            }}
          />
        )}
      </div>
    </div>
  );
};
