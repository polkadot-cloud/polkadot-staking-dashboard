// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FunctionComponent, SVGProps } from 'react';

export interface ItemProps {
  item: Item;
  actionable: boolean;
}

export interface Item {
  bio: string;
  name: string;
  email: string;
  twitter: string;
  website: string;
  Thumbnail: FunctionComponent<SVGProps<SVGSVGElement>>;
  validators: { [key: string]: string };
}
