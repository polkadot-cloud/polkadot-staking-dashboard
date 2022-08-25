// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect } from 'react';
import { useAccount } from 'contexts/Account';
import { useConnect } from 'contexts/Connect';
import { useApi } from 'contexts/Api';
import { CardHeaderWrapper } from 'library/Graphs/Wrappers';
import { OpenAssistantIcon } from 'library/OpenAssistantIcon';
import { useActivePool } from 'contexts/Pools/ActivePool';
import Button from 'library/Button';
import {
  faEdit,
  faCheckCircle,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { useUi } from 'contexts/UI';
import { useModal } from 'contexts/Modal';
import { PoolAccount } from '../../PoolAccount';
import { RolesWrapper } from '../ManagePool/Wrappers';
import RoleEditInput from './RoleEditInput';
import { RoleEdit } from './types';

export const Roles = () => {
  const { isReady } = useApi();
  const { activeAccount, isReadOnlyAccount } = useConnect();
  const { fetchAccountMetaBatch } = useAccount();
  const { activeBondedPool, isOwner, getPoolRoles } = useActivePool();
  const { isSyncing } = useUi();
  const { openModalWith } = useModal();
  const { id } = activeBondedPool || {};
  const roles = getPoolRoles();

  const batchKey = 'pool_roles';

  // role edits
  const initEditState = (() => {
    const initState: Record<string, RoleEdit> = {};
    Object.entries(roles).forEach(([role, who]) => {
      initState[role] = {
        oldAddress: who,
        newAddress: who,
        valid: true,
        reformatted: false,
      };
    });
    return initState;
  })();

  // store whether roles are being edited
  const [isEditing, setIsEditing] = useState(false);

  // store role edits pre-submission
  const [roleEdits, setRoleEdits] = useState(initEditState);

  // store role accounts
  const [accounts, setAccounts] = useState(Object.values(roles));

  // is this the initial fetch
  const [fetched, setFetched] = useState(false);

  // update default roles on account switch
  useEffect(() => {
    setAccounts(Object.values(roles));
    setFetched(false);
  }, [activeAccount]);

  // fetch accounts meta batch
  useEffect(() => {
    if (isReady && !fetched) {
      setFetched(true);
      fetchAccountMetaBatch(batchKey, Object.values(roles), false);
    }
  }, [isReady, fetched]);

  const isRoleEditsValid = () => {
    for (const roleEdit of Object.values<RoleEdit>(roleEdits)) {
      if (roleEdit?.valid === false) {
        return false;
      }
    }
    return true;
  };

  // logic for saving edit state
  const saveHandler = () => {
    openModalWith('ChangePoolRoles', { id, roleEdits }, 'small');
    setIsEditing(false);
  };

  // enter edit state
  const editHandler = () => {
    setRoleEdits(initEditState);
    setIsEditing(true);
  };

  // cancel editing and revert edit state
  const cancelHandler = () => {
    setRoleEdits(initEditState);
    setIsEditing(false);
  };

  // passed down to `RoleEditInput` to update roleEdits
  const setRoleEditHandler = (role: string, edit: RoleEdit) => {
    setRoleEdits((values: Record<string, RoleEdit>) => ({
      ...values,
      [role]: edit,
    }));
  };

  return (
    <>
      <CardHeaderWrapper withAction>
        <h3>Roles</h3>
        {isOwner() === true && (
          <>
            {isEditing && (
              <div>
                <Button
                  small
                  icon={faTimesCircle}
                  transform="grow-1"
                  inline
                  primary
                  title="Cancel"
                  disabled={isSyncing || isReadOnlyAccount(activeAccount)}
                  onClick={() => cancelHandler()}
                />
              </div>
            )}
            &nbsp;&nbsp;
            <div>
              <Button
                small
                icon={isEditing ? faCheckCircle : faEdit}
                transform="grow-1"
                inline
                primary
                title={isEditing ? 'Save' : 'Edit'}
                disabled={
                  isSyncing ||
                  isReadOnlyAccount(activeAccount) ||
                  !isRoleEditsValid()
                }
                onClick={() => (isEditing ? saveHandler() : editHandler())}
              />
            </div>
          </>
        )}
      </CardHeaderWrapper>
      <RolesWrapper>
        <section>
          <div className="inner">
            <h4>
              Root
              <OpenAssistantIcon page="pools" title="Pool Roles" />
            </h4>
            <PoolAccount
              address={roles.root ?? null}
              batchIndex={accounts.indexOf(roles.root ?? '-1')}
              batchKey={batchKey}
            />
          </div>
        </section>
        <section>
          <div className="inner">
            <h4>
              Depositor <OpenAssistantIcon page="pools" title="Pool Roles" />
            </h4>
            <PoolAccount
              address={roles.depositor ?? null}
              batchIndex={accounts.indexOf(roles.depositor ?? '-1')}
              batchKey={batchKey}
            />
          </div>
        </section>
        <section>
          <div className="inner">
            <h4>
              Nominator <OpenAssistantIcon page="pools" title="Pool Roles" />
            </h4>
            {isEditing ? (
              <RoleEditInput
                roleKey="nominator"
                roleEdit={roleEdits?.nominator}
                setRoleEdit={setRoleEditHandler}
              />
            ) : (
              <PoolAccount
                address={roles.nominator ?? null}
                batchIndex={accounts.indexOf(roles.nominator ?? '-1')}
                batchKey={batchKey}
              />
            )}
          </div>
        </section>
        <section>
          <div className="inner">
            <h4>
              State Toggler
              <OpenAssistantIcon page="pools" title="Pool Roles" />
            </h4>
            {isEditing ? (
              <RoleEditInput
                roleKey="stateToggler"
                roleEdit={roleEdits?.stateToggler}
                setRoleEdit={setRoleEditHandler}
              />
            ) : (
              <PoolAccount
                address={roles.stateToggler ?? null}
                batchIndex={accounts.indexOf(roles.stateToggler ?? '-1')}
                batchKey={batchKey}
                last
              />
            )}
          </div>
        </section>
      </RolesWrapper>
    </>
  );
};

export default Roles;
