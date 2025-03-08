<!-- markdown-link-check-disable -->

[![Polkadot - App](https://img.shields.io/badge/Polkadot-App-E6007A?logo=polkadot&logoColor=E6007A)](https://staking.polkadot.cloud) ![ci](https://github.com/polkadot-cloud/polkadot-staking-dashboard/actions/workflows/ci.yml/badge.svg) [![License](https://img.shields.io/badge/License-GPL3.0-blue.svg)](https://opensource.org/licenses/GPL-3.0)

<!-- markdown-link-check-enable -->

# Polkadot Cloud Staking

<img width="1672" alt="Screenshot 2025-03-08 at 15 41 56" src="https://github.com/user-attachments/assets/99de5d57-3d99-4f84-8690-e358867877cd" />

## Contributing Community Assets

### Validator Operators

To showcase your validator operator, submit a PR to [**`@w3ux/w3ux-library`**](https://github.com/w3ux/w3ux-library/tree/main). The operator will then be available in the **`@w3ux/validator-assets`** NPM package. [Full instructions](https://github.com/w3ux/w3ux-library/tree/main/library/validator-assets).

## URL Variable Support

Polkadot Cloud Staking supports URL variables that can be used to direct users to specific configurations of the app, such as landing on a specific language or on a specific network. Variables are added at the end of the hash portion of URL.

The currently supported URL variables are as follows:

- **n**: Controls the default network to connect to upon visiting the app. Supported values are `polkadot`, `kusama` and `westend`.
- **l**: Controls the default to use upon visiting the app.
- **a**: Controls the account to connect to upon visiting the app. Ignored if the account is not present in the initial imported accounts.

URL variables take precedence over saved values in local storage, and will overwrite current configurations. URL variables will update (if present) as a user switches configurations in-app, such as changing the network or language.

### Example URL:

The following URL will load Kusama and use the Chinese localisation resource:

```
staking.polkadot.cloud/#/overview?n=kusama&l=zh
```

## Presentations

- 29/06/2023: [[Video] Polkadot Decoded 2023: The Next Step of the Polkadot UX Journey](https://www.youtube.com/watch?v=s78SZZ_ZA64)
- 30/06/2022: [[Video] Polkadot Decoded 2022: Polkadot Staking Dashboard Demo](https://youtu.be/H1WGu6mf1Ls)

## Repository Transfer History

**17/06/2024:** Moved from `paritytech/polkadot-staking-dashboard`.
