// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect } from 'react';
import { useAccount } from 'contexts/Account';
import { useConnect } from 'contexts/Connect';
import { useApi } from 'contexts/Api';
import { APIContextInterface } from 'types/api';
import { CardHeaderWrapper } from 'library/Graphs/Wrappers';
import { OpenAssistantIcon } from 'library/OpenAssistantIcon';
import { useActivePool } from 'contexts/Pools/ActivePool';
import { ConnectContextInterface } from 'types/connect';
import { ActivePoolContextState } from 'types/pools';
import { PoolAccount } from './PoolAccount';
import { RolesWrapper } from './ManagePool/Wrappers';

export const Roles = () => {
  const { isReady } = useApi() as APIContextInterface;
  const { activeAccount } = useConnect() as ConnectContextInterface;
  const { fetchAccountMetaBatch } = useAccount();
  const { activeBondedPool } = useActivePool() as ActivePoolContextState;
  const activePool = activeBondedPool;
  const { roles } = activePool || {};

  const batchKey = 'pool_roles';

  const _accounts: Array<string> = [
    roles.root,
    roles.depositor,
    roles.nominator,
    roles.stateToggler,
  ];

  // store role accounts
  const [accounts, setAccounts] = useState(_accounts);

  // is this the initial fetch
  const [fetched, setFetched] = useState(false);

  // update default roles on account switch
  useEffect(() => {
    setAccounts(_accounts);
    setFetched(false);
  }, [activeAccount]);

  // fetch accounts meta batch
  useEffect(() => {
    if (isReady && !fetched) {
      // setAccounts(_accounts);
      setFetched(true);
      fetchAccountMetaBatch(batchKey, _accounts, false);
    }
  }, [isReady, fetched]);

  return (
    <>
      <CardHeaderWrapper>
        <h2>Roles</h2>
      </CardHeaderWrapper>
      <RolesWrapper>
        <section>
          <div className="inner">
            <h3>
              Root
              <OpenAssistantIcon page="pools" title="Joined Pool" />
            </h3>
            <PoolAccount
              address={roles.root ?? null}
              batchIndex={accounts.indexOf(roles.root)}
              batchKey={batchKey}
            />
          </div>
        </section>
        <section>
          <div className="inner">
            <h3>
              Depositor <OpenAssistantIcon page="pools" title="Joined Pool" />
            </h3>
            <PoolAccount
              address={roles.depositor ?? null}
              batchIndex={accounts.indexOf(roles.depositor)}
              batchKey={batchKey}
            />
          </div>
        </section>
        <section>
          <div className="inner">
            <h3>
              Nominator <OpenAssistantIcon page="pools" title="Joined Pool" />
            </h3>
            <PoolAccount
              address={roles.nominator ?? null}
              batchIndex={accounts.indexOf(roles.nominator)}
              batchKey={batchKey}
            />
          </div>
        </section>
        <section>
          <div className="inner">
            <h3>
              State Toggler
              <OpenAssistantIcon page="pools" title="Joined Pool" />
            </h3>
            <PoolAccount
              address={roles.stateToggler ?? null}
              batchIndex={accounts.indexOf(roles.stateToggler)}
              batchKey={batchKey}
              last
            />
          </div>
        </section>
      </RolesWrapper>
    </>
  );
};

export default Roles;
