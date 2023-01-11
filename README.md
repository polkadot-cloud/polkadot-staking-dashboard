# Polkadot Staking Dashboard

#### Staging (Latest Version):
https://paritytech.github.io/polkadot-staking-dashboard

#### Production:
https://staking.polkadot.network

<img width="1744" alt="Screenshot 2022-12-20 at 13 46 30" src="https://user-images.githubusercontent.com/13929023/208601280-5a06b7cb-141e-42c8-a278-50cd4dec018d.png">


## URL Variables Support Guide

2 URL variables : n and l, have been introduced to load a default locale and a default network upon the first page visit. 
Take the following example:

staking.polkadot.network?n=polkadot&l=cn

The n  variable(which is polkadot) is passed to load the polkadot network resource, and the l variable (which is cn) is passed to load the Chinese language resource. 

And  the url will be amended when a network is switched.

e.g. if n=kusama is in the URL, and a user switches to polkadot, change the URL to be n=polkadot

## Validator Operator Setup Guide

Validator operators can add their contact information, icon, and which validators they operate, to the dashboard’s Community section. The Community feature is designed to give non-biased exposure to validator operators, and to host a fully-featured validator browser just for that operator's validators.

To add an operator, submit a PR with the following changes:

- **Thumbnail:** Add your operator's thumbnail as an SVG Component in [this folder](https://github.com/paritytech/polkadot-staking-dashboard/tree/master/src/config/validators/thumbnails).
- **Operator details:** Add your operator details to the `VALIDATORS_COMMUNITY`JSON object in [this file](https://github.com/paritytech/polkadot-staking-dashboard/blob/master/src/config/validators/index.ts).

### Operator Structure
 
The following table outlines the structure of a `VALIDATOR_COMMUNITY` entry:

| Element | Key | Required | Notes | Example
| ------- | --- | -------- | ----- | ------- |
| Operator Name  | `name` | Yes | The chosen name of the operator. | `Validator Central` |
| Thumbnail Name | `thumbnail` | Yes | The name of your SVG component representing your thumbnail.  | *See Below* | 
| Bio  | `bio` | No | A short description of your entity. Maximum 300 characters. | `Summing up my validator identity in a sentence or so.` |
| Email Address  | `email` | No | A public email address representing the operator. | `validatorcentral@parity.io` |
| Twitter Handle | `twitter` | No | The Twitter handle representing the operator.  | `@ParityTech` |
| Website URL | `website` | No |  A live and vlid secure URL to your website. | `https://parity.io` |
| Validator List | `validators` | Yes |  A list of validators grouped by network. At least 1 validator in 1 network must be defined. | *See Below* |

### Example Operator

Upload your SVG icon as a React component. Look at the existing icons as examples, or use the [SVGR Playground](https://react-svgr.com/playground/) to convert your raw SVG file into a component.

Next, add your operator details to the `VALIDATOR_COMMUNITY` object. Only provide the validator(s) for the particular network(s) you are operating in. If you have no operating validators on Kusama, for example, the `kusama` key can be omitted.

The following example defines 2 validators on the Polkadot network, and 1 on Kusama:

```
export const VALIDATOR_COMMUNITY = [
  ...
  {
    name: 'Validator Central',
    thumbnail: 'ValidatorCentral',
    bio: 'Summing up my validator identity in a sentence or so. Maximum 300 characters.',
    email: 'validatorcentral@parity.io',
    twitter: '@ParityTech',
    website: 'https://parity.io',
    validators: {
      polkadot: [
      '1hYiMW8KSfUYChzCQSPGXvMSyKVqmyvMXqohjKr3oU5PCXF', 
      '14QSBoJMHF2Zn2XEoLNSeWgqBRr8XoKPy4BxToD6yLSeFFYe'
      ],
      kusama: ['FykhnPA3pn269LAcQ8VQKDgUQ8ieAaSLwJDhAVhu3dcokVR'],
    },
  },
  ...
];

```

### General Requirements

| Requirement | Notes
| ----------- | ----- |
| Accuracy | Operator contact details must be working and valid. |
| Liveness | All submitted validator addresses must be discoverable as a validator on the network in question - whether Polkadot or Kusama. |
| Ordering | Please place your operator in alphabetical order within `VALIDATOR_COMMUNITY`. Operators are shuffled before being displayed in the dashboard, removing any bias associated with ordering methods. |

Please submit an issue for any queries around adding your operator details.

## Presentations

- 30/06/2022: [[Video] Polkadot Decoded 2022: Polkadot Staking Dashboard Demo](https://youtu.be/H1WGu6mf1Ls)
