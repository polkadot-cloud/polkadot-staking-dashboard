// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* Import your SVG Here.
 * Use upper camel-case for your SVG import.
 * import { ReactComponent as ValidatorEntityName } from './thumbnails/ValidatorEntityName.svg';
 */
import { ReactComponent as Placeholder } from './thumbnails/Placeholder.svg';

export const VALIDATOR_COMMUNITY = [
  {
    name: 'Test Validator Entity',
    website: 'https://rossbulat.medium.com/',
    twitter: '@rossbulat',
    Thumbnail: Placeholder,
    email: 'ross@parity.io',
    bio: 'Summing up my validator identity in a sentence or so. Maximum 300 characters.',
    validators: {
      polkadot: [
        '13StYv65m44kLu1mGwHYm4GuXR1vLVamUoSvVfCPoZGFX4S6',
        '148Ta5cWD3wekK3C6EbdDhYrdxC5e71VTKQCjmHUjE1DCG31',
        '13idDU1EZyPTA1Y57tN9grzmLfQm4TEbvc98QErRbQuZyRVu',
        '13KoLANqZqUtyfj6hVDzLh3euJZmabuhepT8xG2VrNsF5XjA',
        '1zugcag7cJVBtVRnFxv5Qftn7xKAnR6YJ9x4x3XLgGgmNnS',
      ],
      kusama: [
        'GXTJJh2kQJoS9amET2WmZ82uFkm7HYCScoP9bEDV5JyKsWE',
        'Dm64aaAUyy5dvYCSmyzz3njGrWrVaki9F6BvUDSYjDDoqR2',
        'GvBUeTDynB9A7fFDPoBt3RGXSjZVeCetoXjYQ44cMNp5myY',
        'GeejAnVcS68oHMdYzXGSkfahPQRi1Q5jYKuZt7Abi6nQbaK',
      ],
      westend: ['5GYaYNVq6e855t5hVCyk4Wuqssaf6ADTrvdPZ3QXyHvFXTip'],
    },
  },
];
