// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { usePoolMemberships } from 'contexts/Pools/PoolMemberships';
import React, { useEffect, useRef, useState } from 'react';
import { AnyJson, MaybeAccount } from 'types';
import { setStateWithRef, unitToPlanckBn } from 'Utils';
import { useApi } from '../Api';
import { useConnect } from '../Connect';
import { useStaking } from '../Staking';
import * as defaults from './defaults';
import { SetupContextInterface, SetupType } from './types';

export const SetupContext = React.createContext<SetupContextInterface>(
  defaults.defaultSetupContext
);

export const useSetup = () => React.useContext(SetupContext);

export const SetupProvider = ({ children }: { children: React.ReactNode }) => {
  const { network } = useApi();
  const { accounts: connectAccounts, activeAccount } = useConnect();
  const { inSetup } = useStaking();

  const { membership: poolMembership } = usePoolMemberships();

  // is the user actively on the setup page
  const [onNominatorSetup, setOnNominatorSetup] = useState(0);

  // is the user actively on the pool creation page
  const [onPoolSetup, setOnPoolSetup] = useState(0);

  // staking setup persist
  const [setup, setSetup]: any = useState([]);
  const setupRef = useRef<any>(setup);

  // move away from setup pages on completion / network change
  useEffect(() => {
    if (!inSetup()) {
      setOnNominatorSetup(0);
    }
    if (poolMembership) {
      setOnPoolSetup(0);
    }
  }, [inSetup(), network, poolMembership]);

  // update setup state when activeAccount changes
  useEffect(() => {
    if (connectAccounts.length) {
      const _setup = setupDefault();
      setStateWithRef(_setup, setSetup, setupRef);
    }
  }, [activeAccount, network, connectAccounts]);

  /*
   * Generates the default setup objects or the currently
   * connected accounts.
   */
  const setupDefault = () => {
    // generate setup objects from connected accounts
    const _setup = connectAccounts.map((item) => {
      const localStakeSetup = localStorage.getItem(
        `${network.name.toLowerCase()}_stake_setup_${item.address}`
      );
      const localPoolSetup = localStorage.getItem(
        `${network.name.toLowerCase()}_pool_setup_${item.address}`
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
    return _setup;
  };

  /*
   * Gets the stake setup progress for a connected account.
   */
  const getSetupProgress = (type: SetupType, address: MaybeAccount) => {
    const _setup = setupRef.current.find((s: any) => s.address === address);
    if (_setup === undefined) {
      return type === SetupType.Stake
        ? defaults.defaultStakeSetup
        : defaults.defaultPoolSetup;
    }
    return _setup.progress[type];
  };

  /*
   * Gets the stake setup progress as a percentage for an address.
   */
  const getStakeSetupProgressPercent = (address: MaybeAccount) => {
    if (!address) return 0;
    const setupProgress = getSetupProgress(SetupType.Stake, address);
    const bondBn = unitToPlanckBn(setupProgress.bond, network.units);

    const p = 25;
    let progress = 0;
    if (bondBn.gt(new BN(0))) progress += p;
    if (setupProgress.controller !== null) progress += p;
    if (setupProgress.nominations.length) progress += p;
    if (setupProgress.payee !== null) progress += p - 1;
    return progress;
  };

  /*
   * Gets the stake setup progress as a percentage for an address.
   */
  const getPoolSetupProgressPercent = (address: MaybeAccount) => {
    if (!address) return 0;
    const setupProgress = getSetupProgress(SetupType.Pool, address);
    const bondBn = unitToPlanckBn(setupProgress.bond, network.units);

    const p = 25;
    let progress = 0;
    if (setupProgress.metadata !== '') progress += p;
    if (bondBn.gt(new BN(0))) progress += p;
    if (setupProgress.nominations.length) progress += p;
    if (setupProgress.roles !== null) progress += p - 1;
    return progress;
  };

  /*
   * Sets stake setup progress for an address.
   * Updates localStorage followed by app state.
   */
  const setActiveAccountSetup = (type: SetupType, progress: AnyJson) => {
    if (!activeAccount) return;

    localStorage.setItem(
      `${network.name.toLowerCase()}_${type}_setup_${activeAccount}`,
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
   * Sets active setup section for an address
   */
  const setActiveAccountSetupSection = (type: SetupType, section: number) => {
    if (!activeAccount) return;

    // get current progress
    const _accountSetup = [...setupRef.current].find(
      (item) => item.address === activeAccount
    );

    // abort if setup does not exist
    if (_accountSetup === null) {
      return;
    }

    // amend section
    _accountSetup.progress[type].section = section;

    // update context setup
    const _setup = setupRef.current.map((obj: any) =>
      obj.address === activeAccount ? _accountSetup : obj
    );

    // update local storage
    localStorage.setItem(
      `${network.name.toLowerCase()}_${type}_setup_${activeAccount}`,
      JSON.stringify(_accountSetup.progress[type])
    );

    // update context
    setStateWithRef(_setup, setSetup, setupRef);
  };

  return (
    <SetupContext.Provider
      value={{
        getSetupProgress,
        getStakeSetupProgressPercent,
        getPoolSetupProgressPercent,
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
