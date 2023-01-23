// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { useConnect } from 'contexts/Connect';
import React, { useEffect, useState } from 'react';
import { AnyApi } from 'types';
import { rmCommas, ZERO } from 'Utils';
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
  const [balance, setBalance] = useState<BN>(ZERO);
  const [unsub, setUnsub] = useState<AnyApi>(undefined);

  const subscribe = async (_account: string | null) => {
    if (!_account) {
      setAddress(undefined);
      setBalance(ZERO);
      setRole(undefined);
      return;
    }
    if (!api) return;
    setAddress(_account);
    if (isReady) {
      const _unsub = await api.queryMulti(
        [
          [api.query.roleModule.accountsRolesLog, _account],
          [api.query.system.account, _account],
        ],
        ([_role, _balance]) => {
          setRole(_role.toString());
          const jsonData = _balance.toHuman() as any;
          setBalance(new BN(rmCommas(jsonData.data.free)));
        }
      );
      setUnsub(_unsub);
    }
  };

  useEffect(() => {
    subscribe(activeAccount);
    return () => {
      if (unsub) {
        unsub();
      }
    };
  }, [isReady, activeAccount]);

  return (
    <AccountContext.Provider value={{ address, role, balance }}>
      {children}
    </AccountContext.Provider>
  );
};
