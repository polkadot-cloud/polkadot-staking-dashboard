// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { useApi } from 'contexts/Api';
import React, { useEffect, useState } from 'react';
import { AnyApi } from 'types';
import { parseHumanBN } from 'Utils';
import * as defaults from './defaults';
import { Asset, AssetsContextInterface } from './types';

export const AssetsContext = React.createContext<AssetsContextInterface>(
  defaults.defaultAssetsContext
);

type NftItem = {
  collId: number;
  itemId: number;
};

export const useAssets = () => React.useContext(AssetsContext);

export const AssetsProvider = ({ children }: { children: React.ReactNode }) => {
  const { isReady, api } = useApi();
  const [assets, setAssets] = useState<Array<Asset>>([]);
  const [collectionSize, setCollectionSize] = useState<Array<number>>([]);
  const [unsub, setUnsub] = useState<AnyApi>(undefined);

  const subscribeToNfts = async () => {
    if (!isReady || !api) return;

    const _unsub = await api.query.nftModule.itemsCount(
      (itemsCount: AnyApi) => {
        setCollectionSize(itemsCount.toHuman());
      }
    );

    setUnsub(_unsub);
  };

  useEffect(() => {
    const fetchAssets = async () => {
      if (!api) return;
      const len = collectionSize.length;
      const nftItems: NftItem[] = [];
      for (let collId = 0; collId < len; ++collId) {
        for (let itemId = 0; itemId < collectionSize[collId]; ++itemId)
          nftItems.push({ collId, itemId });
      }
      const res = await api.query.onboardingModule.houses.multi(
        nftItems.map(({ collId, itemId }) => [collId, itemId])
      );
      const _assets = res
        .map((item) => item.toHuman())
        .map((nft: any, index) => ({
          collId: nftItems[index].collId,
          itemId: nftItems[index].itemId,
          status: nft?.status,
          created: nft?.created,
          metadata: nft?.infos.metadata,
          price: parseHumanBN(nft?.price),
          tenants: nft?.tenants,
        }));
      setAssets(_assets);
    };
    fetchAssets();
  }, [collectionSize]);

  useEffect(() => {
    subscribeToNfts();
    return () => {
      if (unsub) {
        unsub();
      }
    };
  }, [isReady]);

  return (
    <AssetsContext.Provider
      value={{
        assets,
      }}
    >
      {children}
    </AssetsContext.Provider>
  );
};
