import { useApi } from 'contexts/Api';
import React from 'react';
import { AnyJson } from 'types';
import { defaultShareDistributorContext } from './defaults';
import {
  SharedAsset,
  SharedAssetResult,
  ShareDistributorContextInterface,
} from './types';

export const ShareDistributorContext =
  React.createContext<ShareDistributorContextInterface>(
    defaultShareDistributorContext
  );

export const useShareDistributor = () =>
  React.useContext(ShareDistributorContext);

export const ShareDistributorProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { api, isReady } = useApi();
  const fetchAssetShareInfo = async (
    collId: number,
    itemId: number
  ): Promise<SharedAssetResult> => {
    if (!api || !isReady) return null;
    const res = await api.query.shareDistributor.virtual(collId, itemId);
    if (res.isEmpty) return null;
    const { virtualAccount, owners, created, tokenId, rentNbr } =
      res.toJSON() as AnyJson;
    return {
      collId,
      itemId,
      virtualAccount,
      owners,
      created,
      tokenId,
      rentNbr,
    } as SharedAsset;
  };
  return (
    <ShareDistributorContext.Provider value={{ fetchAssetShareInfo }}>
      {children}
    </ShareDistributorContext.Provider>
  );
};
