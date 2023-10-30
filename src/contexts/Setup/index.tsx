// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  greaterThanZero,
  localStorageOrDefault,
  unitToPlanck,
} from '@polkadot-cloud/utils';
import React, { useState } from 'react';
import { usePoolMemberships } from 'contexts/Pools/PoolMemberships';
import type { BondFor, MaybeAddress } from 'types';
import { useEffectIgnoreInitial } from '@polkadot-cloud/react/hooks';
import { useNetwork } from 'contexts/Network';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';
import { useStaking } from '../Staking';
import {
  defaultNominatorProgress,
  defaultPoolProgress,
  defaultSetupContext,
} from './defaults';
import type {
  NominatorProgress,
  NominatorSetup,
  NominatorSetups,
  PoolProgress,
  PoolSetup,
  PoolSetups,
  SetupContextInterface,
} from './types';

export const SetupProvider = ({ children }: { children: React.ReactNode }) => {
  const { inSetup } = useStaking();
  const {
    network,
    networkData: { units },
  } = useNetwork();
  const { accounts } = useImportedAccounts();
  const { activeAccount } = useActiveAccounts();
  const { membership: poolMembership } = usePoolMemberships();

  // is the user actively on the setup page
  const [onNominatorSetup, setOnNominatorSetup] = useState<boolean>(false);

  // is the user actively on the pool creation page
  const [onPoolSetup, setOnPoolSetup] = useState<boolean>(false);

  // Store all imported accounts nominator setups.
  const [nominatorSetups, setNominatorSetups] = useState<NominatorSetups>({});

  // Store all imported accounts pool creation setups.
  const [poolSetups, setPoolSetups] = useState<PoolSetups>({});

  // Generates the default setup objects or the currently connected accounts. Refers to local
  // storage to hydrate state, falls back to defaults otherwise.
  const refreshSetups = () => {
    setNominatorSetups(localNominatorSetups());
    setPoolSetups(localPoolSetups());
  };

  // Gets the setup progress for a connected account. Falls back to default setup if progress does
  // not yet exist.
  const getSetupProgress = (
    type: BondFor,
    address: MaybeAddress
  ): NominatorSetup | PoolSetup => {
    const setup = Object.fromEntries(
      Object.entries(
        type === 'nominator' ? nominatorSetups : poolSetups
      ).filter(([k]) => k === address)
    );
    return (
      setup[address || ''] || {
        progress: defaultProgress(type),
        section: 1,
      }
    );
  };

  // Remove setup progress for an account.
  const removeSetupProgress = (type: BondFor, address: MaybeAddress) => {
    const updatedSetups = Object.fromEntries(
      Object.entries(
        type === 'nominator' ? nominatorSetups : poolSetups
      ).filter(([k]) => k !== address)
    );
    setSetups(type, updatedSetups);
  };

  // Sets setup progress for an address. Updates localStorage followed by app state.
  const setActiveAccountSetup = (
    type: BondFor,
    progress: NominatorProgress | PoolProgress
  ) => {
    if (!activeAccount) return;

    const updatedSetups = updateSetups(
      assignSetups(type),
      progress,
      activeAccount
    );
    setSetups(type, updatedSetups);
  };

  // Sets active setup section for an address.
  const setActiveAccountSetupSection = (type: BondFor, section: number) => {
    if (!activeAccount) return;

    const setups = assignSetups(type);
    const updatedSetups = updateSetups(
      setups,
      setups[activeAccount]?.progress ?? defaultProgress(type),
      activeAccount,
      section
    );
    setSetups(type, updatedSetups);
  };

  // Utility to update the progress item of either a nominator setup or pool setup,
  const updateSetups = <
    T extends NominatorSetups | PoolSetups,
    U extends NominatorProgress | PoolProgress,
  >(
    all: T,
    newSetup: U,
    account: string,
    maybeSection?: number
  ) => {
    const current = Object.assign(all[account] || {});
    const section = maybeSection ?? current.section ?? 1;

    all[account] = {
      ...current,
      progress: newSetup,
      section,
    };

    return all;
  };

  // Gets the stake setup progress as a percentage for an address.
  const getNominatorSetupPercent = (address: MaybeAddress) => {
    if (!address) return 0;
    const setup = getSetupProgress('nominator', address) as NominatorSetup;
    const { progress } = setup;
    const bond = unitToPlanck(progress?.bond || '0', units);

    const p = 33;
    let percentage = 0;
    if (greaterThanZero(bond)) percentage += p;
    if (progress.nominations.length) percentage += p;
    if (progress.payee.destination !== null) percentage += p;
    return percentage;
  };

  // Gets the stake setup progress as a percentage for an address.
  const getPoolSetupPercent = (address: MaybeAddress) => {
    if (!address) return 0;
    const setup = getSetupProgress('pool', address) as PoolSetup;
    const { progress } = setup;
    const bond = unitToPlanck(progress?.bond || '0', units);

    const p = 25;
    let percentage = 0;
    if (progress.metadata !== '') percentage += p;
    if (greaterThanZero(bond)) percentage += p;
    if (progress.nominations.length) percentage += p;
    if (progress.roles !== null) percentage += p - 1;
    return percentage;
  };

  // Utility to copy the current setup state based on setup type.
  const assignSetups = (type: BondFor) =>
    type === 'nominator' ? { ...nominatorSetups } : { ...poolSetups };

  // Utility to get the default progress based on type.
  const defaultProgress = (type: BondFor) =>
    type === 'nominator' ? defaultNominatorProgress : defaultPoolProgress;

  // Utility to get nominator setups, type casted as NominatorSetups.
  const localNominatorSetups = () =>
    localStorageOrDefault('nominator_setups', {}, true) as NominatorSetups;

  // Utility to get pool setups, type casted as PoolSetups.
  const localPoolSetups = () =>
    localStorageOrDefault('pool_setups', {}, true) as PoolSetups;

  // Utility to update setups state depending on type.
  const setSetups = (type: BondFor, setups: NominatorSetups | PoolSetups) => {
    setLocalSetups(type, setups);

    if (type === 'nominator') {
      setNominatorSetups(setups as NominatorSetups);
    } else {
      setPoolSetups(setups as PoolSetups);
    }
  };

  // Utility to either update local setups or remove if empty.
  const setLocalSetups = (
    type: BondFor,
    setups: NominatorSetups | PoolSetups
  ) => {
    const key = type === 'nominator' ? 'nominator_setups' : 'pool_setups';
    const setupsStr = JSON.stringify(setups);

    if (setupsStr === '{}') {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, setupsStr);
    }
  };

  // Move away from setup pages on completion / network change.
  useEffectIgnoreInitial(() => {
    if (!inSetup()) {
      setOnNominatorSetup(false);
    }
    if (poolMembership) {
      setOnPoolSetup(false);
    }
  }, [inSetup(), network, poolMembership]);

  // Update setup state when activeAccount changes
  useEffectIgnoreInitial(() => {
    if (accounts.length) refreshSetups();
  }, [activeAccount, network, accounts]);

  return (
    <SetupContext.Provider
      value={{
        getSetupProgress,
        removeSetupProgress,
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

export const SetupContext =
  React.createContext<SetupContextInterface>(defaultSetupContext);

export const useSetup = () => React.useContext(SetupContext);
