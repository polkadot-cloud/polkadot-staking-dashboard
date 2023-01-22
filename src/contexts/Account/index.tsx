// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useConnect } from 'contexts/Connect';
import React, { useEffect, useState } from 'react';
import { useApi } from '../Api';
import { defaultAccountContext } from './defaults';
import {
  AccountContextInterface,
  AccountRole,
  Address,
  isRoleValid,
} from './types';

// context definition
export const AccountContext = React.createContext<AccountContextInterface>(
  defaultAccountContext
);

export const useAccount = () => React.useContext(AccountContext);

// wrapper component to provide components with context
export const AccountProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isReady, api } = useApi();
  const { activeAccount } = useConnect();
  const [address, setAddress] = useState<Address>(undefined);
  const [role, setRole] = useState<AccountRole>(undefined);

  const fetchRole = async (_account: string) => {
    setAddress(_account);

    const res = await api?.query.roleModule.accountsRolesLog(_account);
    const _role = res?.toString();
    setRole(isRoleValid(_role) ? _role : undefined);
  };

  const update = () => {
    if (api && activeAccount) {
      fetchRole(activeAccount);
    } else {
      setAddress(undefined);
      setRole(undefined);
    }
  };

  useEffect(() => {
    update();
  }, [isReady, activeAccount]);

  return (
    <AccountContext.Provider value={{ address, role, update }}>
      {children}
    </AccountContext.Provider>
  );
};
