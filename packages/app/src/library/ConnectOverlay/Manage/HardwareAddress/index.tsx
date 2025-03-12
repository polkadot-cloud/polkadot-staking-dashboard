// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { faCheck, faTimes, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ellipsisFn, unescape } from '@w3ux/utils'
import type { FormEvent } from 'react'
import { useState } from 'react'
import { Wrapper } from './Wrapper'
import type { HardwareAddressProps } from './types'

export const HardwareAddress = ({
  network,
  address,
  index,
  initial,
  disableEditIfImported = false,
  allowAction = true,
  Identicon,
  existsHandler,
  renameHandler,
  onConfirm,
  onRemove,
  last,
}: HardwareAddressProps) => {
  // Store whether this address is being edited.
  const [editing, setEditing] = useState<boolean>(false)

  // Store the currently saved name.
  const [name, setName] = useState<string>(initial)

  // Store the currently edited name.
  const [editName, setEditName] = useState<string>(initial)

  // Cancel editing and revert to the original name.
  const cancelEditing = () => {
    setEditName(name)
    setEditing(false)
  }

  // Commit the edited name.
  const commitEdit = () => {
    let newName = editName
    if (editName === '') {
      newName = ellipsisFn(address, 6)
    }
    if (newName !== name) {
      setName(newName)
      setEditName(newName)
      renameHandler(address, newName)
    }
    setEditing(false)
  }

  // Handle an input change.
  const handleChange = (e: FormEvent<HTMLInputElement>) => {
    let val = e.currentTarget.value || ''
    val = unescape(val)
    setEditName(val)
  }

  // Check whether this address is imported.
  const isImported = existsHandler(network, address)

  return (
    <Wrapper className={last === true ? ` last` : undefined}>
      <div className={`border ${last === true ? ` last` : ``}`}></div>
      <div className="content">
        <div className="inner">
          <div className="identicon">{Identicon}</div>
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
                    commitEdit()
                    e.currentTarget.blur()
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
                      transform="shrink-2"
                      className="icon"
                    />
                  </button>
                  &nbsp;
                  <button
                    type="button"
                    className="edit"
                    onClick={() => cancelEditing()}
                  >
                    <FontAwesomeIcon icon={faXmark} transform="shrink-2" />
                  </button>
                </div>
              )}
            </section>
            <h4 className="full">
              <span>{ellipsisFn(address, 10)}</span>
            </h4>
          </div>
        </div>
      </div>
      {allowAction && (
        <div className="action">
          {isImported ? (
            <button type="button" onClick={() => onRemove(address)}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          ) : (
            <button type="button" onClick={() => onConfirm(address, index)}>
              Import
            </button>
          )}
        </div>
      )}
    </Wrapper>
  )
}
