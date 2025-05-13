# Welcome to Polkadot Cloud Staking!

This section aims to familiarise developers to the Polkadot Staking Dashboard. Reach out to __staking@polkadot.cloud__ for clarification of any content in this document.

## Submitting Pull Requests

This project follows the Conventional Commits specification. Pull requests are merged and squashed, with the pull request title being used as the commit message. Commit messages should adhere to the following structure:

```
<type>(<scope>): <summary>
```

Example PR titles:

- feat: implement help overlay
- feat(auth): implement login API
- fix: resolve issue with button alignment
- fix(docs): fix installation section to README

The **chore** type will not be added to release change logs, and should be used for silent updates.

If you would like to know more about the Conventional Commits specification, please visit the [Conventional Commits website](https://www.conventionalcommits.org/).

## Releases

[Release Please](https://github.com/googleapis/release-please) is used for automating staking each package's changelog and release generation.

Release Please is a GitHub action maintained by Google that automates CHANGELOG generation, the creation of GitHub releases, and version bumps. [[Gtihub docs](https://github.com/googleapis/release-please), [Action](https://github.com/marketplace/actions/release-please-action)]

## URL Variables

URL variables can be used to direct users to specific configurations of the app. URL variables take precedence over saved values in local storage, and will overwrite current configurations.

The currently supported URL variables are as follows:

- **n**: Default network to connect to upon visiting the app
- **l**: Language to use upon visiting the app
- **a**: The ccount to connect to upon visiting the app (ignored if the account is not present in the user's imported accounts)

As an example, the following URL will load Kusama and use Chinese localisation:

**staking.polkadot.cloud/#/overview?n=kusama&l=zh**

## Adding Validator Operators

To add a validator operator, submit a PR to [**@w3ux/w3ux-library**](https://github.com/w3ux/w3ux-library/tree/main). The operator will then be available in the **@w3ux/validator-assets** NPM package. [Full instructions](https://github.com/w3ux/w3ux-library/tree/main/library/validator-assets).

## Presentations

- 29/06/2023: [[Video] Polkadot Decoded 2023: The Next Step of the Polkadot UX Journey](https://www.youtube.com/watch?v=s78SZZ_ZA64)
- 30/06/2022: [[Video] Polkadot Decoded 2022: Polkadot Staking Dashboard Demo](https://youtu.be/H1WGu6mf1Ls)

## Repository Transfer History

**17/06/2024:** Moved from **paritytech/polkadot-staking-dashboard**
