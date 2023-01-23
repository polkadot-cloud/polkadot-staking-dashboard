// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { useConnect } from 'contexts/Connect';
import React, { useEffect, useState } from 'react';
import { rmCommas, ZERO } from 'Utils';
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
  const [balance, setBalance] = useState<BN>(ZERO);

  const fetchRole = async (_account: string) => {
    const res = await api?.query.roleModule.accountsRolesLog(_account);
    const _role = res?.toString();
    setRole(isRoleValid(_role) ? _role : undefined);
  };

  const fetchBalance = async (_account: string) => {
    const res = await api?.query.system.account(_account);
    const json = res?.toHuman() as any;
    setBalance(new BN(rmCommas(json.data.free)));
  };

  const update = () => {
    if (api && activeAccount) {
      setAddress(activeAccount);
      fetchRole(activeAccount);
      fetchBalance(activeAccount);
    } else {
      setAddress(undefined);
      setRole(undefined);
      setBalance(ZERO);
    }
  };

  useEffect(() => {
    update();
  }, [isReady, activeAccount]);

  return (
    <AccountContext.Provider value={{ address, role, update, balance }}>
      {children}
    </AccountContext.Provider>
  );
};
