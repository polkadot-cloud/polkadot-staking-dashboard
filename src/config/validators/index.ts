// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* Import your SVG Here.
 * Use upper camel-case for your SVG import, lower camel case for the svg.
 * import { ReactComponent as ValidatorEntityName } from './thumbnails/validatorEntityName.svg';
 */
import { ReactComponent as Amforc } from './thumbnails/amforc.svg';
import { ReactComponent as HighStake } from './thumbnails/highstake.svg';

export const VALIDATOR_COMMUNITY = [
  {
    name: '🍁 HIGH/STAKE 🥩',
    Thumbnail: HighStake,
    bio: 'We came for the memes, we stay for the tech. Located in Switzerland with 15+ years of experience in running reliable online services. We are exclusively running our validators on dedicated hardware in datacenters across Europe.',
    email: 'highstake@nexus-informatik.ch',
    website: 'https://highstake.tech/',
    validators: {
      polkadot: [
        '12bget8jJWnyjqYPiCwkXZjDh5tDBkta1WUcDYyndbXVDmQ1',
        '12Dw4SzhsxX3fpDiLUYXm9oGbfxcbg1Peq67gc5jkkEo1TKr',
      ],
      kusama: [
        'DbRgw96nMQcFEFZWTLd6LSPNdh8u3NBuUDfAhDmB6UU8cJC',
        'HQuPha82sRy91zZn73XRGJVV3ernBh5HZKftUcoDT8CSUwK',
      ],
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
      polkadot: ['1y6CPLgccsysCEii3M7jQF834GZsz9A3HMcZz3w7RjGPpBL'],
      kusama: [
        'DVUNoinHdSNfismcrFaBwdJfysxc7A48QkNvTDnTSPXPw3q',
        'DpLatoXXBiSAPooF17bzUZGo7huNB7USfRqd2SgL6RBy2zr',
        'E8zY6KdAH1vuKKMaPdHYLAziht32v2BLqXk6qBw7WtiV2Dv',
        'Ff3xdNrXA47svhiTJHj9uNhxLo29PYjYcJ9cUseAd9FK6iQ',
      ],
    },
  },
];
