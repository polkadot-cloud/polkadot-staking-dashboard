# Contribution Guide

This section aims to familiarise developers to the Polkadot Staking Dashboard [[Deployment](https://staking.polkadot.cloud)].

Reach out to ross@jkrb.io for clarification of any content within this document.

## Submitting Pull Requests

This project follows the Conventional Commits specification. Pull requests are merged and squashed, with the pull request title being used as the commit message. Commit messages should adhere to the following structure:

```
<type>(<scope>): <summary>
```

Some example PR titles:

- `feat: implement help overlay`
- `feat(auth): implement login API`
- `fix: resolve issue with button alignment`
- `fix(docs): fix installation section to README`

The `chore` type will not be added to release change logs, and should be used for silent updates.

If you would like to know more about the Conventional Commits specification, please visit the [Conventional Commits website](https://www.conventionalcommits.org/).

## Releases

[Release Please](https://github.com/googleapis/release-please) is used for automating staking dashboard's changelog and release generation.

Release Please is a GitHub action maintained by Google that automates CHANGELOG generation, the creation of GitHub releases, and version bumps. [[Gtihub docs](https://github.com/googleapis/release-please), [Action](https://github.com/marketplace/actions/release-please-action)]

## TypeScript Support

Strict mode is used in development and full type coverage is required.
