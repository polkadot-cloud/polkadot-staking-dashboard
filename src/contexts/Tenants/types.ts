//
/**
 * TODO:
 * - update this interface to support all types (raw/hash/...)
 * currently supports raw data only
 */
export interface TenantIdentity {
  display: string;
  legal: string;
  web: string;
  riot: string;
  email: string;
  pgpFingerprint: string;
  image: string;
  twitter: string;
}
export interface RegisteredTenant {
  accountId: string;
  identity: TenantIdentity;
  registeredAtBlock: number;
  assetRequested: string;
}

export interface TenantContextInterface {
  fetchRegisteredTenants: () => Promise<Array<RegisteredTenant>>;
  registeredTenants: Array<RegisteredTenant>;
}
