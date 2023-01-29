// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { usePoolMemberships } from 'contexts/Pools/PoolMemberships';
import React, { useEffect, useRef, useState } from 'react';
import { AnyJson, MaybeAccount } from 'types';
import { greaterThanZero, setStateWithRef, unitToPlanck } from 'Utils';
import { useApi } from '../Api';
import { useConnect } from '../Connect';
import { useStaking } from '../Staking';
import * as defaults from './defaults';
import {
  NominatorSetup,
  PoolSetup,
  SetupContextInterface,
  SetupType,
} from './types';

export const SetupContext = React.createContext<SetupContextInterface>(
  defaults.defaultSetupContext
);

export const useSetup = () => React.useContext(SetupContext);

export const SetupProvider = ({ children }: { children: React.ReactNode }) => {
  const { network } = useApi();
  const { inSetup } = useStaking();
  const { membership: poolMembership } = usePoolMemberships();
  const { accounts: connectAccounts, activeAccount } = useConnect();

  // is the user actively on the setup page
  const [onNominatorSetup, setOnNominatorSetup] = useState<boolean>(false);

  // is the user actively on the pool creation page
  const [onPoolSetup, setOnPoolSetup] = useState<boolean>(false);

  // staking setup persist
  const [setup, setSetup]: any = useState([]);
  const setupRef = useRef<any>(setup);

  // move away from setup pages on completion / network change
  useEffect(() => {
    if (!inSetup()) {
      setOnNominatorSetup(false);
    }
    if (poolMembership) {
      setOnPoolSetup(false);
    }
  }, [inSetup(), network, poolMembership]);

  // update setup state when activeAccount changes
  useEffect(() => {
    if (connectAccounts.length) {
      setStateWithRef(setupDefault(), setSetup, setupRef);
    }
  }, [activeAccount, network, connectAccounts]);

  /*
   * Generates the default setup objects or the currently
   * connected accounts.
   */
  const setupDefault = () =>
    connectAccounts.map((item) => {
      const localStakeSetup = localStorage.getItem(
        `${network.name}_stake_setup_${item.address}`
      );
      const localPoolSetup = localStorage.getItem(
        `${network.name}_pool_setup_${item.address}`
      );
      const stakeProgress =
        localStakeSetup !== null
          ? JSON.parse(localStakeSetup)
          : defaults.defaultStakeSetup;

      const poolProgress =
        localPoolSetup !== null
          ? JSON.parse(localPoolSetup)
          : defaults.defaultPoolSetup;

      return {
        address: item.address,
        progress: {
          stake: stakeProgress,
          pool: poolProgress,
        },
      };
    });

  /*
   * Gets the stake setup progress for a connected account.
   */
  const getSetupProgress = (
    type: SetupType,
    address: MaybeAccount
  ): NominatorSetup | PoolSetup => {
    const progress = setupRef.current.find((s: any) => s.address === address);
    if (progress === undefined) {
      return type === 'stake'
        ? defaults.defaultStakeSetup
        : defaults.defaultPoolSetup;
    }
    return progress.progress[type];
  };

  /*
   * Gets the stake setup progress as a percentage for an address.
   */
  const getNominatorSetupPercent = (address: MaybeAccount) => {
    if (!address) return 0;
    const progress = getSetupProgress('stake', address) as NominatorSetup;
    const bond = unitToPlanck(progress?.bond || '0', network.units);

    const p = 33;
    let percentageComplete = 0;
    if (greaterThanZero(bond)) percentageComplete += p;
    if (progress.nominations.length) percentageComplete += p;
    if (progress.payee.destination !== null) percentageComplete += p;
    return percentageComplete;
  };

  /*
   * Gets the stake setup progress as a percentage for an address.
   */
  const getPoolSetupPercent = (address: MaybeAccount) => {
    if (!address) return 0;
    const progress = getSetupProgress('pool', address) as PoolSetup;
    const bond = unitToPlanck(progress?.bond || '0', network.units);

    const p = 25;
    let percentageComplete = 0;
    if (progress.metadata !== '') percentageComplete += p;
    if (greaterThanZero(bond)) percentageComplete += p;
    if (progress.nominations.length) percentageComplete += p;
    if (progress.roles !== null) percentageComplete += p - 1;
    return percentageComplete;
  };

  /*
   * Sets stake setup progress for an address. Updates localStorage followed by app state.
   */
  const setActiveAccountSetup = (
    type: SetupType,
    progress: NominatorSetup | PoolSetup
  ) => {
    if (!activeAccount) return;

    localStorage.setItem(
      `${network.name}_${type}_setup_${activeAccount}`,
      JSON.stringify(progress)
    );

    const setupUpdated = setupRef.current.map((obj: AnyJson) =>
      obj.address === activeAccount
        ? {
            ...obj,
            progress: {
              ...obj.progress,
              [type]: progress,
            },
          }
        : obj
    );
    setStateWithRef(setupUpdated, setSetup, setupRef);
  };

  /*
   * Sets active setup section for an address.
   */
  const setActiveAccountSetupSection = (type: SetupType, section: number) => {
    if (!activeAccount) return;

    // get current progress.
    const accountSetup = [...setupRef.current].find(
      (item) => item.address === activeAccount
    );

    // abort if setup does not exist.
    if (accountSetup === null) {
      return;
    }

    // amend section.
    accountSetup.progress[type].section = section;

    // update context setup.
    const progress = setupRef.current.map((obj: any) =>
      obj.address === activeAccount ? accountSetup : obj
    );

    // update local storage.
    localStorage.setItem(
      `${network.name}_${type}_setup_${activeAccount}`,
      JSON.stringify(accountSetup.progress[type])
    );

    // update context.
    setStateWithRef(progress, setSetup, setupRef);
  };

  return (
    <SetupContext.Provider
      value={{
        getSetupProgress,
        getNominatorSetupPercent,
        getPoolSetupPercent,
        setActiveAccountSetup,
        setActiveAccountSetupSection,
        setOnNominatorSetup,
        setOnPoolSetup,
        onNominatorSetup,
        onPoolSetup,
      }}
    >
      {children}
    </SetupContext.Provider>
  );
};
