export interface RepresentativeInfo {
  activated: boolean;
  registeredAt: number;
  assetAccounts: Array<string>;
  index: number;
}

type RepresentativeInfoResult = RepresentativeInfo | undefined;

export interface RoleContextInterface {
  fetchAvailableReps: () => Promise<Array<string>>;
  fetchRepresentativeDetails: (
    _address: string
  ) => Promise<RepresentativeInfoResult>;
}
