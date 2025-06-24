# Changelog

## [1.3.0](https://github.com/polkadot-cloud/polkadot-staking-dashboard/compare/types-v1.2.0...types-v1.3.0) (2025-06-17)


### Features

* Add `rpc-config` package with scheduled updates ([#2706](https://github.com/polkadot-cloud/polkadot-staking-dashboard/issues/2706)) ([a27b300](https://github.com/polkadot-cloud/polkadot-staking-dashboard/commit/a27b30049d0db72ec23a057dd2686585fa1045f3))
* Add AssetHub chains to `dedot-api` default services ([#2701](https://github.com/polkadot-cloud/polkadot-staking-dashboard/issues/2701)) ([6e1ba02](https://github.com/polkadot-cloud/polkadot-staking-dashboard/commit/6e1ba02edb8689c609a9b3af35820f081ce67be0))
* Controller migration prompt ([#2780](https://github.com/polkadot-cloud/polkadot-staking-dashboard/issues/2780)) ([1d29aa7](https://github.com/polkadot-cloud/polkadot-staking-dashboard/commit/1d29aa7a11f1f87aaf4290cdb7c52a3f3ea59ae2))
* Init `global-bus`, refactor assets, consts, network data. Network to global bus ([#2640](https://github.com/polkadot-cloud/polkadot-staking-dashboard/issues/2640)) ([00d7ca4](https://github.com/polkadot-cloud/polkadot-staking-dashboard/commit/00d7ca4d765777ca59ce055484c23fc138bdb935))
* Init Dedot API support, expand `global-bus`, `dedot-api` packages, remove Polkadot API ([#2656](https://github.com/polkadot-cloud/polkadot-staking-dashboard/issues/2656)) ([024eff3](https://github.com/polkadot-cloud/polkadot-staking-dashboard/commit/024eff3a8c006ed842af42b9d86f97f1e7481da2))
* Migrate Westend api to asset hub ([#2749](https://github.com/polkadot-cloud/polkadot-staking-dashboard/issues/2749)) ([e48a1cd](https://github.com/polkadot-cloud/polkadot-staking-dashboard/commit/e48a1cdb9ff5b6c62d06feeabccb3f82185b9f8c))
* Pool and Nominator Setups Revision, One-Click Setup ([#2729](https://github.com/polkadot-cloud/polkadot-staking-dashboard/issues/2729)) ([92750f0](https://github.com/polkadot-cloud/polkadot-staking-dashboard/commit/92750f08c99626fbcc19dbf58aad4c6656588ec0))
* Quick actions component for overview page ([#2728](https://github.com/polkadot-cloud/polkadot-staking-dashboard/issues/2728)) ([ce60b2f](https://github.com/polkadot-cloud/polkadot-staking-dashboard/commit/ce60b2f8800d19287647d388bb47f3a98eecabc3))
* **refactor:** `[@w3ux](https://github.com/w3ux) bumps`, types updates ([#2619](https://github.com/polkadot-cloud/polkadot-staking-dashboard/issues/2619)) ([08a0027](https://github.com/polkadot-cloud/polkadot-staking-dashboard/commit/08a0027f941cf2505311c381855e7994aef582ff))
* **refactor:** Abstract balance functions, add unit tests, `useAccountBalances` hook ([#2819](https://github.com/polkadot-cloud/polkadot-staking-dashboard/issues/2819)) ([78160d7](https://github.com/polkadot-cloud/polkadot-staking-dashboard/commit/78160d740ec2a6d53136a7ea05938b3b0b927639))
* **refactor:** Global bus external accounts, use `activeAddress` ([#2642](https://github.com/polkadot-cloud/polkadot-staking-dashboard/issues/2642)) ([f2e0842](https://github.com/polkadot-cloud/polkadot-staking-dashboard/commit/f2e084261201dfe67ac8ca613940f8e1b7fd1bd9))
* **refactor:** Migrate from yarn to pnpm ([#2628](https://github.com/polkadot-cloud/polkadot-staking-dashboard/issues/2628)) ([7efe25e](https://github.com/polkadot-cloud/polkadot-staking-dashboard/commit/7efe25e7e98895ad89a69c3e55a2688e088f82a5))
* **refactor:** Move active proxy logic to `global-bus`, `dedot-api` ([#2786](https://github.com/polkadot-cloud/polkadot-staking-dashboard/issues/2786)) ([40a6bdb](https://github.com/polkadot-cloud/polkadot-staking-dashboard/commit/40a6bdbfb623d6ad4d17f4ca9457f9c39f0b35ed))
* **refactor:** Move syncing to `global-bus` and `dedot-api` ([#2741](https://github.com/polkadot-cloud/polkadot-staking-dashboard/issues/2741)) ([c8f4531](https://github.com/polkadot-cloud/polkadot-staking-dashboard/commit/c8f45316ffd68f55cd2930097ae145f85a535737))
* **refactor:** Notifications to global bus ([#2797](https://github.com/polkadot-cloud/polkadot-staking-dashboard/issues/2797)) ([6a833ca](https://github.com/polkadot-cloud/polkadot-staking-dashboard/commit/6a833cae656451c269d6f293dcfaf4238aa19f58))
* **refactor:** Optimise tsconfigs ([#2781](https://github.com/polkadot-cloud/polkadot-staking-dashboard/issues/2781)) ([00245a0](https://github.com/polkadot-cloud/polkadot-staking-dashboard/commit/00245a01717d82f7b0e33c384a7e9cf2fb5a728f))
* support unmigrated controller accounts in `dedot-api` ([#2779](https://github.com/polkadot-cloud/polkadot-staking-dashboard/issues/2779)) ([9c36a4e](https://github.com/polkadot-cloud/polkadot-staking-dashboard/commit/9c36a4edbe0ecd28502812e6b8e90f6b2618e354))
* Use `dedot/merkleized-metadata`, misc tidy-ups ([#2721](https://github.com/polkadot-cloud/polkadot-staking-dashboard/issues/2721)) ([51d1cee](https://github.com/polkadot-cloud/polkadot-staking-dashboard/commit/51d1cee9cd3e9020edd201a42ba83e5c33558d2e))
* **ux:** Add canvas max width support ([#2609](https://github.com/polkadot-cloud/polkadot-staking-dashboard/issues/2609)) ([077ba6b](https://github.com/polkadot-cloud/polkadot-staking-dashboard/commit/077ba6b790acbc2a4becdae5f9a6867b3a3c7877))
* **ux:** Manage Nominations Full Screen UI, Remove confirm dialogue ([#2613](https://github.com/polkadot-cloud/polkadot-staking-dashboard/issues/2613)) ([7afb86f](https://github.com/polkadot-cloud/polkadot-staking-dashboard/commit/7afb86fc9ebeed9ddd580a01179ebb1ef6f90320))
* **ux:** Simplified header UI, new Account, Settings popovers ([#2573](https://github.com/polkadot-cloud/polkadot-staking-dashboard/issues/2573)) ([d384b83](https://github.com/polkadot-cloud/polkadot-staking-dashboard/commit/d384b83409e6941187da2fd910a96b803644fcdc))
* Various fixes for solo chain support ([#2778](https://github.com/polkadot-cloud/polkadot-staking-dashboard/issues/2778)) ([d27fc66](https://github.com/polkadot-cloud/polkadot-staking-dashboard/commit/d27fc66b09ab4d5bd6edd875ec4f1db9fd195ccc))

## [1.2.0](https://github.com/polkadot-cloud/polkadot-staking-dashboard/compare/types-v1.1.0...types-v1.2.0) (2025-02-24)


### Features

* Validator performance charts from Staking API ([#2466](https://github.com/polkadot-cloud/polkadot-staking-dashboard/issues/2466)) ([6215f47](https://github.com/polkadot-cloud/polkadot-staking-dashboard/commit/6215f4731505e95bf78ffe826f57918b99e7a6a5))
* Validator ranks from Staking API, stop historical era point scraping ([#2480](https://github.com/polkadot-cloud/polkadot-staking-dashboard/issues/2480)) ([abe0b1c](https://github.com/polkadot-cloud/polkadot-staking-dashboard/commit/abe0b1c097dc89b60fd2c540fe84f66f69a2b6c4))

## [1.1.0](https://github.com/polkadot-cloud/polkadot-staking-dashboard/compare/types-v1.0.0...types-v1.1.0) (2025-01-16)


### Features

* **fix:** Remove left pool from state ([#2373](https://github.com/polkadot-cloud/polkadot-staking-dashboard/issues/2373)) ([4b823b9](https://github.com/polkadot-cloud/polkadot-staking-dashboard/commit/4b823b9108b7502f0a40ed4c08da3197dd4f343c))
* **refactor:** Pool rewards to controller, pool types to `types` package ([#2344](https://github.com/polkadot-cloud/polkadot-staking-dashboard/issues/2344)) ([437ffe4](https://github.com/polkadot-cloud/polkadot-staking-dashboard/commit/437ffe4cca9ac23fe412cec68f59ee095f1e195f))
* **refactor:** Remove semi ([#2356](https://github.com/polkadot-cloud/polkadot-staking-dashboard/issues/2356)) ([4c10b19](https://github.com/polkadot-cloud/polkadot-staking-dashboard/commit/4c10b192612f557128b3eb23af68a24a993f41e7))
