# Contribution Guide

This section aims to familiarise developers to the Polkadot Staking Dashboard [[GitHub](https://github.com/paritytech/polkadot-staking-dashboard), [Demo](https://paritytech.github.io/polkadot-staking-dashboard/#/overview)] for the purpose of contributing to the project.

Reach out to ross@parity.io for clarification of any content within this document.

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

## Major Packages Used

- React 18
- Polkadot JS API [[docs](https://polkadot.js.org/docs/api)]
- React Chart JS 2 for graphing. [[docs](https://www.chartjs.org/docs/latest/), [React docs](https://react-chartjs-2.js.org/)]
- Framer Motion. [[docs](https://www.framer.com/docs/animation/)]
- [Font Awesome](https://fontawesome.com/v5/search) for the majority of icons. [Ionicons](https://ionic.io/ionicons) for side menu footer icons
- SCSS for theme configuration and Styled Components [[docs](https://styled-components.com/docs)] for component styling.

## Environment Variables

Optionally apply envrionment variables in an environment file such as `.env` or with `yarn build` to customise the build of staking dashboard.

Refer to the [`.env`](https://github.com/paritytech/polkadot-staking-dashboard/blob/main/.env) file in the root of the repository for all supported variables.

## Config Files

There are some ad-hoc files defining app configuration where needed. These just provide a means of bootstrapping app data, and further abstraction could be explored in the future.

- [`config/pages.ts`](https://github.com/paritytech/polkadot-staking-dashboard/blob/main/src/config/pages.ts): provides the pages and page categories of the app.
- [`config/help.ts`](https://github.com/paritytech/polkadot-staking-dashboard/blob/main/src/config/help.ts): provides the help content.

## App Entry

Going from the top-most component, the component hierarchy is set up as follows:

- `src/index.tsx`: DOM render, of little interest.
- `src/App.tsx`: wraps `<App />` in the theme provider context and determines the active network from local storage.
- `src/Providers.tsx`: imports and wraps `<Router />` with all the contexts using a withProviders hook. We also wrap styled component's theme provider context here to make the theme configuration work.
- `src/Router.tsx`: contains react router `<Route>`'s, in addition to the major app presentational components.

## Development Patterns

Documenting some of the development patterns used:

- We use the **"Wrapper" terminology for styled components** that wrap a functional component.
- **Styles are defined on a per-component basis**, being defined in the same folder as the component markup itself. Where unavoidable (such as global styles, interface layout), styled components should reside in `src/Wrappers.ts`.
- **Constants or default values** (such as those waiting for Polkadot API) are defined in `src/consts.ts`.
- Packages with missing TypeScript definitions can be declared in `src/vite-env.d.ts`.

## TypeScript Support

Strict mode is used in development and full type coverage is required.
