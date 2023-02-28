import { faSignIn } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAccount } from 'contexts/Account';
import { useAssets } from 'contexts/Assets';
import { Asset } from 'contexts/Assets/types';
import { useModal } from 'contexts/Modal';
import { AssetMenuItem } from 'library/AssetItem';
import { Warning } from 'library/Form/Warning';
import { CardWrapper } from 'library/Graphs/Wrappers';
import { HouseList } from 'library/HouseList';
import PageTitle from 'library/PageTitle';
import { useTranslation } from 'react-i18next';
import { PageRowWrapper, Separator } from 'Wrappers';

export const Tenants = () => {
  const { t } = useTranslation('pages');
  const { isTenant } = useAccount();
  const { assets } = useAssets();
  const { openModalWith } = useModal();

  const assetsFiltered = assets.filter(
    (asset) => asset.status === 'PURCHASED' && asset.representative !== null
  );

  const menu = (asset: Asset) => {
    if (!isTenant()) return [];
    const menuItems: AssetMenuItem[] = [];
    menuItems.push({
      icon: <FontAwesomeIcon icon={faSignIn} />,
      title: t('tenants.requestAsset'),
      cb: () => {
        openModalWith('TenantsForm', {
          asset,
        });
      },
    });
    return menuItems;
  };

  return (
    <>
      <PageTitle title={t('tenants.pageTitle')} />
      <Separator />

      <PageRowWrapper className="page-padding" noVerticalSpacer>
        {!isTenant() && <Warning text={t('tenants.roleWarning')} />}
        <CardWrapper>
          <HouseList
            assets={assetsFiltered}
            title={`${assetsFiltered.length} assets available`}
            menu={menu}
          />
        </CardWrapper>
      </PageRowWrapper>
    </>
  );
};
