// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import React from 'react';
import { AnyJson } from 'types';
import { defaultRoleContext } from './defaults';
import { RoleContextInterface } from './types';

// context definition
export const RoleContext =
  React.createContext<RoleContextInterface>(defaultRoleContext);

export const useRoles = () => React.useContext(RoleContext);

// wrapper component to provide components with context
export const RoleProvider = ({ children }: { children: React.ReactNode }) => {
  const { isReady, api } = useApi();

  const fetchAvailableReps = async () => {
    if (!isReady || !api) return [];

    const reps: Array<string> = [];
    const res = await api.query.roleModule.repApprovalList.entries();
    res.forEach((item) => {
      if (item[1].isEmpty) return;
      const data: AnyJson = item[1].toJSON();
      reps.push(data.accountId);
    });
    return reps;
  };

  const fetchRepresentativeDetails = async (_address: string) => {
    if (!isReady || !api) return undefined;
    const res = await api.query.roleModule.representativeLog(_address);
    if (res.isEmpty) return undefined;
    const data: AnyJson = res.toPrimitive();
    return {
      activated: data.activated,
      registeredAt: data.age,
      assetAccounts: data.assetsAccounts,
      index: data.index,
    };
  };

  return (
    <RoleContext.Provider
      value={{ fetchAvailableReps, fetchRepresentativeDetails }}
    >
      {children}
    </RoleContext.Provider>
  );
};
