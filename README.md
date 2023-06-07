![ci](https://github.com/gluwa/creditcoin-staking-dashboard/actions/workflows/ci.yml/badge.svg) [![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

# Creditcoin Staking Dashboard

#### Staging (Latest Version):

https://staking-dashboard-test-app.azurewebsites.net

#### Production:

https://staking.creditcoin.org


## Validator Operator Setup Guide

Validator operators can add their contact information, icon, and which validators they operate, to the dashboard’s Community section. The Community feature is designed to give non-biased exposure to validator operators, and to host a fully-featured validator browser just for that operator's validators.

To add an operator, submit a PR with the following changes:

- **Thumbnail:** Add your operator's thumbnail as an SVG Component in [this folder](https://github.com/gluwa/creditcoin-staking-dashboard/tree/main/src/config/validators/thumbnails).
- **Operator details:** Add your operator details to the `VALIDATORS_COMMUNITY`JSON object in [this file](https://github.com/gluwa/creditcoin-staking-dashboard/blob/main/src/config/validators/index.ts).

### Operator Structure

The following table outlines the structure of a `ValidatorCommunity` entry:

| Element        | Key          | Required | Notes                                                                                       | Example                                                 |
| -------------- | ------------ | -------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| Operator Name  | `name`       | Yes      | The chosen name of the operator.                                                            | `Validator Central`                                     |
| Thumbnail Name | `thumbnail`  | Yes      | The name of your SVG component representing your thumbnail.                                 | _See Below_                                             |
| Bio            | `bio`        | No       | A short description of your entity. Maximum 300 characters.                                 | `Summing up my validator identity in a sentence or so.` |
| Email Address  | `email`      | No       | A public email address representing the operator.                                           | `validatorcentral@parity.io`                            |
| Twitter Handle | `twitter`    | No       | The Twitter handle representing the operator.                                               | `@ParityTech`                                           |
| Website URL    | `website`    | No       | A live and vlid secure URL to your website.                                                 | `https://parity.io`                                     |
| Validator List | `validators` | Yes      | A list of validators grouped by network. At least 1 validator in 1 network must be defined. | _See Below_                                             |

### Example Operator

Upload your SVG icon as a React component. Look at the existing icons as examples, or use the [SVGR Playground](https://react-svgr.com/playground/) to convert your raw SVG file into a component.

Next, add your operator details to the `ValidatorCommunity` object. Only provide the validator(s) for the particular network(s) you are operating in.

The following example defines 2 validators on the Creditcoin Mainnet, and 1 on the Creditcoin Testnet:

```
export const ValidatorCommunity = [
  ...
  {
    name: 'Validator Central',
    thumbnail: 'ValidatorCentral',
    bio: 'Summing up my validator identity in a sentence or so. Maximum 300 characters.',
    email: 'validatorcentral@parity.io',
    twitter: '@ParityTech',
    website: 'https://parity.io',
    validators: {
      creditcoin: [
      '1hYiMW8KSfUYChzCQSPGXvMSyKVqmyvMXqohjKr3oU5PCXF',
      '14QSBoJMHF2Zn2XEoLNSeWgqBRr8XoKPy4BxToD6yLSeFFYe'
      ],
      creditcoinTest: ['FykhnPA3pn269LAcQ8VQKDgUQ8ieAaSLwJDhAVhu3dcokVR'],
    },
  },
  ...
];

```

### General Requirements

| Requirement | Notes                                                                                                                                                                                             |
| ----------- |---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Accuracy    | Operator contact details must be working and valid.                                                                                                                                               |
| Liveness    | All submitted validator addresses must be discoverable as a validator on the network in question - whether Mainnet or Testnet.                                                                    |
| Ordering    | Please place your operator in alphabetical order within `ValidatorCommunity`. Operators are shuffled before being displayed in the dashboard, removing any bias associated with ordering methods. |

Please submit an issue for any queries around adding your operator details.
