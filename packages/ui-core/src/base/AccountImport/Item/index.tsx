// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ellipsisFn } from '@w3ux/utils'
import classNames from 'classnames'
import type { FormEvent } from 'react'
import { useState } from 'react'
import type { ItemProps } from '../types'
import classes from './index.module.scss'

export const Item = ({
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
}: ItemProps) => {
  // Store whether this address is being edited.
  const [editing, setEditing] = useState<boolean>(false)

  // Store the currently saved name.
  const [name, setName] = useState<string>(initial)

  // Store the currently edited name.
  const [editName, setEditName] = useState<string>(initial)

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

  const containerClasses = classNames(classes.item, {
    [classes.last]: last,
  })
  const borderClasses = classNames(classes.border, {
    [classes.last]: last,
  })

  return (
    <div className={containerClasses}>
      <div className={borderClasses}></div>
      <div className={classes.content}>
        <div className={classes.inner}>
          <div className={classes.identicon}>{Identicon}</div>
          <div>
            <h4 className={classes.full}>
              <span>{address}</span>
            </h4>
            <section className={classes.row}>
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
            </section>
          </div>
        </div>
      </div>
      {allowAction && (
        <div className={classes.action}>
          {isImported ? (
            <button type="button" onClick={() => onRemove(address)}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
          ) : (
            <button type="button" onClick={() => onConfirm(address, index)}>
              Import
            </button>
          )}
        </div>
      )}
    </div>
  )
}
