import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAccount } from 'contexts/Account';
import { useApi } from 'contexts/Api';
import { useAssets } from 'contexts/Assets';
import { useNotifications } from 'contexts/Notifications';
import { useRoles } from 'contexts/Roles';
import { RepresentativeInfo } from 'contexts/Roles/types';
import { useTenants } from 'contexts/Tenants';
import { RegisteredTenant } from 'contexts/Tenants/types';
import { Warning } from 'library/Form/Warning';
import { CardWrapper } from 'library/Graphs/Wrappers';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { HouseList } from 'library/HouseList';
import PageTitle from 'library/PageTitle';
import { TenantCard } from 'library/TenantCard';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnyApi } from 'types';
import { PageRowWrapper, Separator } from 'Wrappers';
import { TenantListWrapper } from './styles';

export const Representative = () => {
  const { t } = useTranslation('pages');

  const { address, isRepresentative } = useAccount();
  const { api } = useApi();
  const { assets, fetchAssetAccount } = useAssets();
  const { notifyError, notifySuccess } = useNotifications();
  const { registeredTenants } = useTenants();
  const { fetchRepresentativeDetails } = useRoles();
  const [repInfo, setRepInfo] = useState<RepresentativeInfo>();
  const [tx, setTx] = useState<AnyApi>(null);
  const [pending, setPending] = useState(false);

  const isRep = isRepresentative();
  const tenantsFiltered = !repInfo
    ? []
    : registeredTenants.filter(
        (tenant) => repInfo?.assetAccounts.indexOf(tenant.assetRequested) !== -1
      );
  const assetsFiltered = assets.filter(
    (asset) => asset.representative === address
  );

  const initStates = () => {
    setRepInfo(undefined);
  };

  const fetchRepInfo = async () => {
    if (!address) return;
    const _repInfo = await fetchRepresentativeDetails(address);
    setRepInfo(_repInfo);
  };

  useEffect(() => {
    initStates();
    fetchRepInfo();
  }, [address]);

  const getAssetByAccount = async (_assetAccount: string) => {
    for await (const asset of assetsFiltered) {
      const account = await fetchAssetAccount(asset.collId, asset.itemId);
      if (account === _assetAccount) return asset;
    }
    return null;
  };

  const menu = (_tenant: RegisteredTenant) => {
    const menuItems = [];
    menuItems.push({
      title: 'Approve Request',
      icon: <FontAwesomeIcon icon={faThumbsUp} />,
      cb: async () => {
        const asset = await getAssetByAccount(_tenant.assetRequested);
        setTx(
          !api || !asset
            ? null
            : api.tx.assetManagementModule.launchTenantSession(
                asset.collId,
                asset.itemId,
                _tenant.accountId,
                'Election',
                'Reasonable'
              )
        );
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
      notifySuccess(t('representatives.success'));
    },
    callbackError: () => {
      notifyError(t('notary.failure'));
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
      <PageTitle title={t('representatives.pageTitle')} />
      <Separator />
      <PageRowWrapper className="page-padding" noVerticalSpacer>
        {!isRep && (
          <Warning text="Only users with the REPRESENTATIVE role can use functions on this page" />
        )}
        {isRep && !repInfo?.activated && (
          <Warning text="You are not approved as a REPRESENTATIVE yet. Please wait for approval from investors." />
        )}
      </PageRowWrapper>
      <PageRowWrapper className="page-padding" noVerticalSpacer>
        <CardWrapper>
          <HouseList
            assets={repInfo?.assetAccounts ? assetsFiltered : []}
            title="Linked assets"
          />
        </CardWrapper>
      </PageRowWrapper>
      <PageRowWrapper className="page-padding" noVerticalSpacer>
        <CardWrapper>
          <h3>Tenant Requests</h3>
          <Separator />
          <TenantListWrapper>
            {tenantsFiltered.map((tenant, index) => (
              <TenantCard
                tenant={tenant}
                key={index}
                menuItems={pending ? [] : menu(tenant)}
              />
            ))}
          </TenantListWrapper>
        </CardWrapper>
      </PageRowWrapper>
    </>
  );
};
