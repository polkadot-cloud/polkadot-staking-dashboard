[![Polkadot - App](https://img.shields.io/badge/Polkadot-App-E6007A?logo=polkadot&logoColor=E6007A)](https://staking.polkadot.network) ![ci](https://github.com/paritytech/polkadot-staking-dashboard/actions/workflows/ci.yml/badge.svg) [![License](https://img.shields.io/badge/License-GPL3.0-blue.svg)](https://opensource.org/licenses/GPL-3.0)

# Polkadot Staking Dashboard

<img width="1727" alt="Screenshot 2023-08-29 at 18 54 33" src="https://github.com/paritytech/polkadot-staking-dashboard/assets/13929023/6291d682-0434-4b77-b6e9-383d277893b0">

## Contributing Community Assets

The Polkadot Staking Dashboard is a community-driven project, and we welcome contributions to bolster the dashboard's functionality and features.

- **Web Extensions**: Submit PR to the [Polkadot Cloud repository](https://github.com/polkadot-cloud/polkadot-cloud/tree/main/packages/assets#adding-web-extension-wallets) to add a web extension. The extension will then be available in the `@polkadot-cloud/assets` NPM package. Full instructions can be found [here](https://github.com/polkadot-cloud/polkadot-cloud/tree/main/packages/assets#adding-web-extension-wallets).

- **Validator Operators**: Submit PR to the [Polkadot Cloud repository](https://github.com/polkadot-cloud/polkadot-cloud/tree/main/packages/assets#adding-validator-operators) to add a validator operator. The operator will then be available in the `@polkadot-cloud/assets` NPM package. Full instructions can be found [here](https://github.com/polkadot-cloud/polkadot-cloud/tree/main/packages/assets#adding-validator-operators).

## URL Variable Support

Polkadot Staking Dashboard supports URL variables that can be used to direct users to specific configurations of the app, such as landing on a specific language or on a specific network. Variables are added at the end of the hash portion of URL.

The currently supported URL variables are as follows:

- **n**: Controls the default network to connect to upon visiting the dashboard. Supported values are `polkadot`, `kusama` and `westend`.
- **l**: Controls the default to use upon visiting the dashboard. Supported values are `en` and `cn`.
- **a**: Controls the account to connect to upon visiting the dashboard. Ignored if the account is not present in the initial imported accounts.

URL variables take precedence over saved values in local storage, and will overwrite current configurations. URL variables will update (if present) as a user switches configurations in-app, such as changing the network or language.

### Example URL:

The following URL will load Kusama and use the Chinese localisation resource:

```
staking.polkadot.network/#/overview?n=kusama&l=cn
```

## Using Containers

You may build a container using:

```
./shell/build-container.sh
```

Then run your container with:

```
podman run --d -p 8080:80 localhost/polkadot-staking-dashboard
```

And access the **Staking Dashboard** at http://localhost:8080/.

## Presentations

- 29/06/2023: [[Video] Polkadot Decoded 2023: The Next Step of the Polkadot UX Journey](https://www.youtube.com/watch?v=s78SZZ_ZA64)
- 30/06/2022: [[Video] Polkadot Decoded 2022: Polkadot Staking Dashboard Demo](https://youtu.be/H1WGu6mf1Ls)
