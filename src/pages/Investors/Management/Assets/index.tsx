import { useAccount } from 'contexts/Account';
import { useAssets } from 'contexts/Assets';
import { Asset } from 'contexts/Assets/types';
import { useShareDistributor } from 'contexts/ShareDistributor';
import { CardWrapper } from 'library/Graphs/Wrappers';
import { HouseList } from 'library/HouseList';
import { useEffect, useState } from 'react';
import { PageRowWrapper } from 'Wrappers';

export const ManageAssets = () => {
  const { assets } = useAssets();
  const { address } = useAccount();
  const { fetchAssetShareInfo } = useShareDistributor();

  const [owned, setOwned] = useState<Asset[]>([]);

  const initStates = () => {
    setOwned([]);
  };

  const fetchInfo = async () => {
    initStates();
    if (!address) return;
    const purchased: Array<Asset> = assets.filter(
      (asset) => asset.status === 'PURCHASED'
    );
    const _owned = [];
    for await (const asset of purchased) {
      const { collId, itemId } = asset;
      const assetShares = await fetchAssetShareInfo(collId, itemId);
      if (!assetShares) continue;
      if (assetShares.owners.indexOf(address) === -1) continue;
      _owned.push(asset);
    }
    setOwned(_owned);
  };

  useEffect(() => {
    fetchInfo();
  }, [assets, address]);
  return (
    <>
      <PageRowWrapper className="page-padding" noVerticalSpacer>
        <CardWrapper>
          <HouseList assets={owned} title="Owned Assets" />
        </CardWrapper>
      </PageRowWrapper>
    </>
  );
};
