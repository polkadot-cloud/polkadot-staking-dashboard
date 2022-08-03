// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* Import your SVG Here.
 * Use upper camel-case for your SVG import, lower camel case for the svg.
 * import { ReactComponent as ValidatorEntityName } from './thumbnails/validatorEntityName.svg';
 */
import { ReactComponent as Amforc } from './thumbnails/amforc.svg';
import { ReactComponent as Stakerspace } from './thumbnails/stakerspace.svg';

export const VALIDATOR_COMMUNITY = [
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
  {
    name: 'Staker Space',
    Thumbnail: Stakerspace,
    bio: 'Hi! We are an independent and experienced staking provider. Our homebase is the Netherlands, but we have a run across multiple geographical locations dedicated hardware for our validators. We have been running Kusama and Polkadot validators since the start of the network are highly experienced in doing so. If you have any questions, please get in touch with us.',
    email: 'hello@staker.space',
    twitter: '@stakerspace',
    website: 'https://staker.space',
    validators: {
      polkadot: [
        '16SpacegeUTft9v3ts27CEC3tJaxgvE4uZeCctThFH3Vb24p',
        '14N5nJ4oR4Wj36DsBcPLh1JqjvrM2Uf23No2yc2ojjCvSC24',
        '1NqVmUJCyaj5yZ9jp7ZZa58hbUx2QaBZ4eSCu9bqAdZXgAm',
      ],
      kusama: [
        'FcjmeNzPk3vgdENm1rHeiMCxFK96beUoi2kb59FmCoZtkGF',
        'Eksma7JmWh8DenpNKi2uCavwaKJ9QrJJbtcnmwJr3hbHSmC',
        'Dm64aaAUyy5dvYCSmyzz3njGrWrVaki9F6BvUDSYjDDoqR2',
        'DfHkfoKa6xzNMWTNGL8SH8VyY69gajen4ijgmegeU4cZm1H',
      ],
    },
  },
];
