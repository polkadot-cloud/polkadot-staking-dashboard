// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useConnect } from 'contexts/Connect';
import React, { useEffect, useState } from 'react';
import { useApi } from '../Api';
import { defaultAccountContext } from './defaults';
import { AccountContextInterface, AccountRole, Address } from './types';

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

    const _role = await api?.query.roleModule.accountsRolesLog(_account);
    setRole(_role?.toString());
  };

  useEffect(() => {
    if (!api || activeAccount === null) return;
    fetchRole(activeAccount);
  }, [isReady, activeAccount]);

  return (
    <AccountContext.Provider value={{ address, role }}>
      {children}
    </AccountContext.Provider>
  );
};
