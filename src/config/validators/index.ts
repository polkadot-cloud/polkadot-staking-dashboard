// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* Import your SVG Here.
 * Use upper camel-case for your SVG import, lower camel case for the svg.
 * import { ReactComponent as ValidatorEntityName } from './thumbnails/validatorEntityName.svg';
 */
import { ReactComponent as Placeholder } from './thumbnails/placeholder.svg';
import { ReactComponent as Amforc } from './thumbnails/amforc.svg';

export const VALIDATOR_COMMUNITY = [
  {
    name: 'Test Validator Entity',
    Thumbnail: Placeholder,
    bio: 'Summing up my validator identity in a sentence or so. Maximum 300 characters.',
    email: 'ross@parity.io',
    twitter: '@ParityTech',
    website: 'https://parity.io/',
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
  {
    name: 'Amforc',
    Thumbnail: Amforc,
    bio: 'We are a independent and experienced staking provider from Switzerland. We run our validators in a hybrid cloud setup across multiple geographical locations. Our validators run significantly above average and close to no blocks are missed as para-validator.',
    email: 'staking@amforc.com',
    twitter: '@amforcag',
    website: 'https://amforc.com/',
    validators: {
      polkadot: [
        '1y6CPLgccsysCEii3M7jQF834GZsz9A3HMcZz3w7RjGPpBL',
      ],
      kusama: [
        'DVUNoinHdSNfismcrFaBwdJfysxc7A48QkNvTDnTSPXPw3q',
        'DpLatoXXBiSAPooF17bzUZGo7huNB7USfRqd2SgL6RBy2zr',
        'E8zY6KdAH1vuKKMaPdHYLAziht32v2BLqXk6qBw7WtiV2Dv',
        'Ff3xdNrXA47svhiTJHj9uNhxLo29PYjYcJ9cUseAd9FK6iQ',
      ],
    },
  },
];
