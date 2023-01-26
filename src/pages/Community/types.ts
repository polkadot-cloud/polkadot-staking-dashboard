// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors

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
  thumbnail: string;
  validators: { [key: string]: string };
}
