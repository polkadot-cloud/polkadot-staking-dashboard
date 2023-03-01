import { useAccount } from 'contexts/Account';
import { useAssets } from 'contexts/Assets';
import { useRoles } from 'contexts/Roles';
import { RepresentativeInfo } from 'contexts/Roles/types';
import { useTenants } from 'contexts/Tenants';
import { Warning } from 'library/Form/Warning';
import { CardWrapper } from 'library/Graphs/Wrappers';
import { HouseList } from 'library/HouseList';
import PageTitle from 'library/PageTitle';
import { TenantCard } from 'library/TenantCard/TenantCard';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageRowWrapper, Separator } from 'Wrappers';

export const Representative = () => {
  const { t } = useTranslation('pages');

  const { address, isRepresentative } = useAccount();
  const { assets } = useAssets();
  const { registeredTenants } = useTenants();
  const { fetchRepresentativeDetails } = useRoles();
  const [repInfo, setRepInfo] = useState<RepresentativeInfo>();

  const isRep = isRepresentative();
  const tenantsFiltered = !repInfo
    ? []
    : registeredTenants.filter(
        (tenant) => repInfo?.assetAccounts.indexOf(tenant.assetRequested) !== -1
      );
  console.log(tenantsFiltered);
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
          {tenantsFiltered.map((tenant, index) => (
            <TenantCard tenant={tenant} key={index} menuItems={[]} />
          ))}
        </CardWrapper>
      </PageRowWrapper>
    </>
  );
};
