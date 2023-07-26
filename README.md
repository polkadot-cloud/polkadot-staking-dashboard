[![Polkadot - App](https://img.shields.io/badge/Polkadot-App-E6007A?logo=polkadot&logoColor=E6007A)](https://staking.polkadot.network) ![ci](https://github.com/paritytech/polkadot-staking-dashboard/actions/workflows/ci.yml/badge.svg) [![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

# Polkadot Staking Dashboard

<img width="1739" alt="Screenshot 2023-06-16 at 01 23 08" src="https://github.com/paritytech/polkadot-staking-dashboard/assets/13929023/ed4c11c2-38f5-41bd-a32e-46c27a4fb590">

## Validator Operator Setup Guide

Validator operators can add their contact information, icon, and which validators they operate, to the dashboard’s Community section. The Community feature is designed to give non-biased exposure to validator operators, and to host a fully-featured validator browser just for that operator's validators.

To add an operator, submit a PR with the following changes:

- **Thumbnail:** Add your operator's thumbnail as an SVG Component in [this folder](https://github.com/paritytech/polkadot-staking-dashboard/tree/main/src/config/validators/thumbnails).
- **Operator details:** Add your operator details to the `VALIDATORS_COMMUNITY`JSON object in [this file](https://github.com/paritytech/polkadot-staking-dashboard/blob/main/src/config/validators/index.ts).

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

Next, add your operator details to the `ValidatorCommunity` object. Only provide the validator(s) for the particular network(s) you are operating in. If you have no operating validators on Kusama, for example, the `kusama` key can be omitted.

The following example defines 2 validators on the Polkadot network, and 1 on Kusama:

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

| Requirement | Notes                                                                                                                                                                                             |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Accuracy    | Operator contact details must be working and valid.                                                                                                                                               |
| Liveness    | All submitted validator addresses must be discoverable as a validator on the network in question - whether Polkadot or Kusama.                                                                    |
| Ordering    | Please place your operator in alphabetical order within `ValidatorCommunity`. Operators are shuffled before being displayed in the dashboard, removing any bias associated with ordering methods. |

Please submit an issue for any queries around adding your operator details.

## URL Variables Support

Polkadot Staking Dashboard supports URL variables that can be used to direct users to specific configurations of the app, such as landing on a specific language or on a specific network.

Variables are added at the end of the hash portion of URL:

```
staking.polkadot.network/#/overview?n=polkadot&l=en
```

The currently supported URL variables are as follows:

- `n`: Controls the network to default to upon visiting the dashboard. Supported values are `polkadot`, `kusama` and `westend`.
- `l`: Controls the language to default to upon visiting the dashboard. Supported values are `en` and `cn`.
- `a`: Controls the account to connect to upon visiting the dashboard. Ignored if the account is not present in the initial imported accounts.

URL variables take precedence over saved values in local storage, and will overwrite current configurations. URL variables will update (if present) as a user switches configurations in-app, such as changing the network or language.

### Example URL:

The following URL will load Kusama and use the Chinese localisation resource:

```
staking.polkadot.network/#/overview?n=kusama&l=cn
```

## Presentations

- 30/06/2022: [[Video] Polkadot Decoded 2022: Polkadot Staking Dashboard Demo](https://youtu.be/H1WGu6mf1Ls)

## Using containers

You may build a container using:

```
./scripts/build-container.sh
```

then run your container with:

```
podman run --d -p 8080:80 localhost/polkadot-staking-dashboard
```

and access the **Staking Dashboard** at http://localhost:8080/
