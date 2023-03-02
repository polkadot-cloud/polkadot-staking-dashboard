import { faLink, faUnlink, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Identicon from '@polkadot/react-identicon';
import { useAccount } from 'contexts/Account';
import { useApi } from 'contexts/Api';
import { useAssets } from 'contexts/Assets';
import { Asset } from 'contexts/Assets/types';
import { useModal } from 'contexts/Modal';
import { useNotifications } from 'contexts/Notifications';
import { useRoles } from 'contexts/Roles';
import { useShareDistributor } from 'contexts/ShareDistributor';
import { TokenOwnership } from 'contexts/ShareDistributor/types';
import { AssetMenuItem } from 'library/AssetItem';
import { RowWrapper } from 'library/Form/Wrappers';
import { CardWrapper } from 'library/Graphs/Wrappers';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { HouseList } from 'library/HouseList';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnyApi } from 'types';
import { humanNumber } from 'Utils';
import { PageRowWrapper } from 'Wrappers';
import { OwnershipItemWrapper } from './styles';

interface RepresentativeItemProps {
  address: string;
  onClick?: () => void;
}

const RepresentativeItem = ({ address, onClick }: RepresentativeItemProps) => {
  return (
    <div>
      <RowWrapper onClick={onClick}>
        <Identicon value={address} size={28} />
        <div>{address}</div>
      </RowWrapper>
    </div>
  );
};

interface OwnershipItemProps {
  owner: string;
  count: number;
}
const OwnershipItem = ({ owner, count }: OwnershipItemProps) => {
  return (
    <OwnershipItemWrapper>
      <Identicon value={owner} size={28} />
      <span className="owner">{owner}</span>
      <span className="count">{humanNumber(count)}</span>
    </OwnershipItemWrapper>
  );
};

interface AssetWithTokens extends Asset {
  owners: Array<TokenOwnership>;
}

export const ManageAssets = () => {
  const { t } = useTranslation('pages');

  const { api } = useApi();
  const { assets } = useAssets();
  const { address } = useAccount();
  const { openModalWith, setStatus } = useModal();
  const { notifyError, notifySuccess } = useNotifications();
  const { fetchAvailableReps } = useRoles();
  const { fetchAssetShareInfo, getTokenShares } = useShareDistributor();

  const [owned, setOwned] = useState<AssetWithTokens[]>([]);
  const [tx, setTx] = useState<AnyApi>(null);
  const [pending, setPending] = useState(false);

  const initStates = () => {
    setOwned([]);
    setPending(false);
    setTx(null);
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
      const tokenShare = await getTokenShares(assetShares.virtualAccount);
      _owned.push({ ...asset, owners: tokenShare?.owners || [] });
    }
    setOwned(_owned);
  };

  useEffect(() => {
    initStates();
    fetchInfo();
  }, [assets, address]);

  const electRep = (collId: number, itemId: number, rep: string) => {
    setTx(
      api?.tx.assetManagementModule.launchRepresentativeSession(
        collId,
        itemId,
        rep,
        'Election'
      )
    );
    setStatus(2);
  };

  const demoteRep = (collId: number, itemId: number, rep: string) => {
    setTx(
      api?.tx.assetManagementModule.launchRepresentativeSession(
        collId,
        itemId,
        rep,
        'Demotion'
      )
    );
  };

  const menu = (asset: Asset) => {
    const { collId, itemId, representative: rep } = asset;
    const menuItems: Array<AssetMenuItem> = [];
    if (!rep) {
      menuItems.push({
        icon: <FontAwesomeIcon icon={faLink} />,
        title: 'Elect a representative',
        cb: async () => {
          if (pending) return;
          const availableReps = await fetchAvailableReps();
          openModalWith('Tables', {
            title: 'Select a representative',
            data: availableReps,
            render: (_rep: string) => (
              <RepresentativeItem
                address={_rep}
                onClick={() => electRep(collId, itemId, _rep)}
              />
            ),
          });
        },
      });
    } else {
      menuItems.push({
        icon: <FontAwesomeIcon icon={faUnlink} />,
        title: 'Demote the representative',
        cb: () => {
          if (!pending) demoteRep(collId, itemId, rep);
        },
      });
    }
    menuItems.push({
      icon: <FontAwesomeIcon icon={faUsers} />,
      title: 'See owners',
      cb: () => {
        const ownedAsset = owned.find(
          (item) => item.collId === collId && item.itemId === itemId
        );
        if (!ownedAsset) return;
        openModalWith('Tables', {
          title: 'Token distribution',
          data: ownedAsset.owners,
          render: (props: TokenOwnership) => <OwnershipItem {...props} />,
        });
      },
    });
    return menuItems;
  };

  const { submitTx } = useSubmitExtrinsic({
    tx,
    from: address as string,
    shouldSubmit: true,
    callbackInBlock: () => {},
    callbackSubmit: () => {},
    callbackSuccess: () => {
      setPending(false);
      notifySuccess(t('representatives.sessionLaunchSuccess'));
    },
    callbackError: () => {
      notifyError(t('representatives.sessionLaunchFailure'));
      setPending(false);
    },
  });

  useEffect(() => {
    if (tx) {
      setPending(true);
      submitTx();
    }
  }, [tx]);

  return (
    <>
      <PageRowWrapper className="page-padding" noVerticalSpacer>
        <CardWrapper>
          <HouseList assets={owned} title="Owned Assets" menu={menu} />
        </CardWrapper>
      </PageRowWrapper>
    </>
  );
};
