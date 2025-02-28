# Using Yarn Modern

Staking dashboard uses Yarn Modern as its package manager. It contains a local binary of the yarn version used, so you don't need to install anything globally.

_If you fetch this repository for the first time, or if the yarn version is updated in the repository, restart or reload your IDE or CLI to make sure it picks up the updated version._

## Troubleshooting

This section documents some common issues that may arise when using Yarn Modern for the first time, or if Yarn Classic is installed globally.

### Yarn install is failing

Ensure that you have the latest version of `npm` installed on your machine. Instead of installing it via `yarn`, use the [direct download](https://www.npmjs.com/package/npm#direct-download):

```
curl -qL https://www.npmjs.com/install.sh | sh
```

Verify the version with `npm --version`. You may need to restart your IDE or CLI to pick up the updated version.

### I cannot switch between Yarn Classic and Yarn Modern on my machine

It should not matter that you have Yarn Classic installed globally, as staking dashboard has a local yarn binary that it uses. If however you _do_ require Yarn Modern on your machine, try the following troubleshooting steps:

#### Check for other yarn config files

Check if there are any `.yarnrc.yml` or `.yarnrc` files in your root directory, or any parent directories from your project directory. If so, delete them.

#### Check your active system yarn binary

Run `which yarn` to determine where your system yarn binary is located and verify which binary is currently being used. For macOS, you may receive the following: `/Users/<username>/.yarn/bin/yarn`

#### Verify your system's yarn version

Verify the active yarn version on your machine with `yarn --version`. This should be run outside of the staking dashboard repository as to not pick up the local yarn binary in the project. To be sure the correct version is being displayed, it is safest to do this in the active yarn directory, e.g. the directory from the previous step.

#### Set a new yarn version

Set a new yarn version by running `yarn set version <version_name>`. To be sure the system version is being set, it is safest to do this in the system yarn directory:

```
cd /Users/<username>/.yarn/bin/yarn && yarn set version berry
```

Yarn Berry is the latest version of Yarn Modern. To switch back to Yarn Classic, run `yarn set version classic` instead.

## Other Resources

- Step by step migration guide from Yarn Classic: https://yarnpkg.com/migration/guide
- Yarn Questions & Answers: https://yarnpkg.com/getting-started/qa
- `yarn set version` reference: https://yarnpkg.com/cli/set/version
