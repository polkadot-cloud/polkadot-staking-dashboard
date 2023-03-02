import {
  RegisteredTenant,
  TenantContextInterface,
  TenantIdentity,
} from './types';

export const emptyIdentity: TenantIdentity = {
  display: '',
  legal: '',
  web: '',
  riot: '',
  email: '',
  pgpFingerprint: '',
  image: '',
  twitter: '',
};

export const defaultRenant: RegisteredTenant = {
  accountId: '',
  identity: emptyIdentity,
  registeredAtBlock: 0,
  assetRequested: '',
};

export const defaultTenantContext: TenantContextInterface = {
  fetchRegisteredTenants: async () => [],
  registeredTenants: [],
};
