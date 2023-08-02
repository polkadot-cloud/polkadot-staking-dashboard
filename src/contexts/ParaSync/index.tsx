// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useRef, useState } from 'react';
import BigNumber from 'bignumber.js';
import type { AnyJson, Sync } from 'types';
import { getParaMeta } from 'config/paras';
import { useConnect } from 'contexts/Connect';
import { useApi } from 'contexts/Api';
import { useEffectIgnoreInitial } from 'library/Hooks/useEffectIgnoreInitial';
import type { ParaBalances, ParaSyncContextInterface } from './types';
import { defaultParaSyncContext } from './defaults';
import { useAssetHub } from './Hooks/useAssetHub';
import { useInterlay } from './Hooks/useInterlay';

export const ParaSyncProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Store para token balances.
  const { network } = useApi();
  const { activeAccount } = useConnect();

  // Store parachain token balance metadata.
  const [paraBalances, setParaBalances] = useState<ParaBalances>({});

  // Store parachain foreign asset registry metadata.
  const [paraForeignAssets, setParaForeignAssets] = useState<AnyJson>({});

  // Reference whether the app has been synced.
  const isSyncingRef = useRef<Sync>('unsynced');

  // Instantiate parachain hooks.
  const assetHub = useAssetHub();
  const interlay = useInterlay();

  // We need to connect to parachains and check the user's balances.
  const syncBalances = async () => {
    if (!activeAccount || isSyncingRef.current !== 'unsynced') return;
    isSyncingRef.current = 'syncing';

    // Sync chain states to get supported local and foreign assets.
    const assetHubState = await assetHub.getBalances(activeAccount);
    const interlayState = await interlay.getBalances(activeAccount);

    if (interlayState?.foreignAssets) {
      setParaForeignAssets({
        ...paraForeignAssets,
        interlay: interlayState.foreignAssets,
      });
    }

    const newParaBalances: ParaBalances = {};
    if (interlayState) {
      newParaBalances.interlay = {
        paraId: interlayState.paraId,
        tokens: interlayState.tokens,
      };
    }

    if (assetHubState) {
      newParaBalances.assethub = {
        paraId: assetHubState.paraId,
        tokens: assetHubState.assets,
      };
    }
    setParaBalances({
      ...paraBalances,
      ...newParaBalances,
    });
    isSyncingRef.current = 'synced';
  };

  // NOTE: could make `syncBalances` cancelable and cancel when this useEffect is triggered.
  useEffectIgnoreInitial(() => {
    isSyncingRef.current = 'unsynced';
    setParaBalances({});
    syncBalances();
  }, [activeAccount, network]);

  // Getter for Asset Hub token balance.
  // getAssetHubBalance('USDT');
  const getAssetHubBalance = (symbol: string) => {
    const token = paraBalances?.assethub?.tokens.find(
      (t) => t.symbol === symbol
    );

    if (token) {
      if (token.key === 'Native') {
        return new BigNumber(token.free);
      }
      return new BigNumber(token.balance);
    }
    return new BigNumber(0);
  };

  // Getter for interlay balance.
  // getInterlayBalance('ForeignAsset', '2');
  const getInterlayBalance = (key: string, symbol: string) => {
    const token = paraBalances?.interlay?.tokens?.find(
      (t) => t.key === key && t.symbol === symbol
    );
    return !token ? new BigNumber(0) : new BigNumber(token.free);
  };

  // Getter for an interlay symbol.
  // If `ForeignAsset`, `paraForeignAssets` needs to be referred to.
  const getInterlaySymbol = (key: string, symbol: string) => {
    if (key === 'ForeignAsset') {
      return paraForeignAssets?.interlay[symbol]?.symbol;
    }
    return symbol;
  };

  // Getter for interlay units
  // If `ForeignAsset`, `paraForeignAssets` needs to be referred to.
  const getTokenUnits = (key: string, symbol: string): number => {
    return (
      getParaMeta(key).supportedAssets.find((a) => a.symbol === symbol)
        ?.units || 0
    );
  };

  return (
    <ParaSyncContext.Provider
      value={{
        paraSyncing: isSyncingRef.current,
        paraBalances,
        paraForeignAssets,
        getters: {
          getAssetHubBalance,
          getInterlayBalance,
          getInterlaySymbol,
          getTokenUnits,
        },
      }}
    >
      {children}
    </ParaSyncContext.Provider>
  );
};

export const ParaSyncContext = React.createContext<ParaSyncContextInterface>(
  defaultParaSyncContext
);

export const useParaSync = () => React.useContext(ParaSyncContext);
