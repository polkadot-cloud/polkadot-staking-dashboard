// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FunctionComponent, SVGProps } from 'react';

export enum NetworkName {
  Polkadot = 'polkadot',
  Westend = 'westend',
}

export interface NodeEndpoint {
  name: string;
  endpoint: string;
  subscanEndpoint: string;
  unit: string;
  units: number;
  ss58: number;
  icon: FunctionComponent<
    SVGProps<SVGSVGElement> & { title?: string | undefined }
  >;
  api: {
    unit: string;
    priceTicker: string;
  };
  features: {
    pools: boolean;
  };
}

export interface NodeEndpoints {
  [key: string]: NodeEndpoint;
}
