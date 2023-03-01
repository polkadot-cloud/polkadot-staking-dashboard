import { useApi } from 'contexts/Api';
import React, { useEffect, useState } from 'react';
import { AnyApi, AnyJson } from 'types';
import { defaultTenantContext, emptyIdentity } from './defaults';
import { RegisteredTenant, TenantContextInterface } from './types';

export const TenantContext =
  React.createContext<TenantContextInterface>(defaultTenantContext);

export const useTenants = () => React.useContext(TenantContext);

export const TenantContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isReady, api } = useApi();
  const [unsub, setUnsub] = useState<AnyApi>();
  const [registeredTenants, setRegisteredTenants] = useState<
    RegisteredTenant[]
  >([]);

  const initStates = () => {
    setUnsub(undefined);
    setRegisteredTenants([]);
  };

  const fetchRegisteredTenants = async (): Promise<Array<RegisteredTenant>> => {
    return [];
  };

  const subscribe = async () => {
    if (!api || !isReady) {
      return;
    }
    const _unsub = api.query.tenancyModule.tenants.entries((res: AnyJson) => {
      if (res.isEmpty) return;
      const _tenants: RegisteredTenant[] = [];
      res.forEach((item: AnyJson) => {
        console.log(item);
        const data: AnyJson = item[1].toPrimitive();
        const infos: AnyJson = data.infos;
        _tenants.push({
          accountId: item[0].toString(),
          assetRequested: data.assetRequested,
          registeredAtBlock: data.registeredAtBlock,
          identity: {
            ...emptyIdentity,
            display: infos.display.raw || '',
            email: infos.email.raw || '',
            legal: infos.legal.raw || '',
            riot: infos.riot.raw || '',
            twitter: infos.twitter.raw || '',
            web: infos.web.raw || '',
          },
        });
      });
      setRegisteredTenants(_tenants);
    });
    setUnsub(_unsub);
  };

  useEffect(() => {
    initStates();
    subscribe();
    return () => {
      if (unsub) unsub.then();
    };
  }, [isReady, api]);

  return (
    <TenantContext.Provider
      value={{ fetchRegisteredTenants, registeredTenants }}
    >
      {children}
    </TenantContext.Provider>
  );
};
