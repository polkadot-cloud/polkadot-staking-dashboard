# Changelog

## [1.3.0](https://github.com/polkadot-cloud/polkadot-staking-dashboard/compare/consts-v1.2.0...consts-v1.3.0) (2025-06-17)


### Features

* Add `rpc-config` package with scheduled updates ([#2706](https://github.com/polkadot-cloud/polkadot-staking-dashboard/issues/2706)) ([a27b300](https://github.com/polkadot-cloud/polkadot-staking-dashboard/commit/a27b30049d0db72ec23a057dd2686585fa1045f3))
* Add AssetHub chains to `dedot-api` default services ([#2701](https://github.com/polkadot-cloud/polkadot-staking-dashboard/issues/2701)) ([6e1ba02](https://github.com/polkadot-cloud/polkadot-staking-dashboard/commit/6e1ba02edb8689c609a9b3af35820f081ce67be0))
* Disable Westend in production - Prep for AssetHub Migration ([#2702](https://github.com/polkadot-cloud/polkadot-staking-dashboard/issues/2702)) ([349d1e0](https://github.com/polkadot-cloud/polkadot-staking-dashboard/commit/349d1e030fedc48df3c6df5396bcb12af098fd77))
* Implement RPC health check on network connect ([#2822](https://github.com/polkadot-cloud/polkadot-staking-dashboard/issues/2822)) ([6891521](https://github.com/polkadot-cloud/polkadot-staking-dashboard/commit/689152198ab00deb7a7e1a11866a83c048636f76))
* Init `global-bus`, refactor assets, consts, network data. Network to global bus ([#2640](https://github.com/polkadot-cloud/polkadot-staking-dashboard/issues/2640)) ([00d7ca4](https://github.com/polkadot-cloud/polkadot-staking-dashboard/commit/00d7ca4d765777ca59ce055484c23fc138bdb935))
* Init Dedot API support, expand `global-bus`, `dedot-api` packages, remove Polkadot API ([#2656](https://github.com/polkadot-cloud/polkadot-staking-dashboard/issues/2656)) ([024eff3](https://github.com/polkadot-cloud/polkadot-staking-dashboard/commit/024eff3a8c006ed842af42b9d86f97f1e7481da2))
* Init simple mode, advanced mode toggle ([#2742](https://github.com/polkadot-cloud/polkadot-staking-dashboard/issues/2742)) ([2d5274b](https://github.com/polkadot-cloud/polkadot-staking-dashboard/commit/2d5274b243b95407821de6587ebd6e71d34b2d39))
* **locales:** Add multi-currency support for staking rewards & balances ([#2563](https://github.com/polkadot-cloud/polkadot-staking-dashboard/issues/2563)) ([c25e64f](https://github.com/polkadot-cloud/polkadot-staking-dashboard/commit/c25e64f0b35beb555641a1a6f018b63bb3cf32db))
* Migrate Westend api to asset hub ([#2749](https://github.com/polkadot-cloud/polkadot-staking-dashboard/issues/2749)) ([e48a1cd](https://github.com/polkadot-cloud/polkadot-staking-dashboard/commit/e48a1cdb9ff5b6c62d06feeabccb3f82185b9f8c))
* Pool and Nominator Setups Revision, One-Click Setup ([#2729](https://github.com/polkadot-cloud/polkadot-staking-dashboard/issues/2729)) ([92750f0](https://github.com/polkadot-cloud/polkadot-staking-dashboard/commit/92750f08c99626fbcc19dbf58aad4c6656588ec0))
* **refactor:** Global bus external accounts, use `activeAddress` ([#2642](https://github.com/polkadot-cloud/polkadot-staking-dashboard/issues/2642)) ([f2e0842](https://github.com/polkadot-cloud/polkadot-staking-dashboard/commit/f2e084261201dfe67ac8ca613940f8e1b7fd1bd9))
* **refactor:** Migrate from yarn to pnpm ([#2628](https://github.com/polkadot-cloud/polkadot-staking-dashboard/issues/2628)) ([7efe25e](https://github.com/polkadot-cloud/polkadot-staking-dashboard/commit/7efe25e7e98895ad89a69c3e55a2688e088f82a5))
* **refactor:** Move active proxy logic to `global-bus`, `dedot-api` ([#2786](https://github.com/polkadot-cloud/polkadot-staking-dashboard/issues/2786)) ([40a6bdb](https://github.com/polkadot-cloud/polkadot-staking-dashboard/commit/40a6bdbfb623d6ad4d17f4ca9457f9c39f0b35ed))
* **refactor:** Notifications to global bus ([#2797](https://github.com/polkadot-cloud/polkadot-staking-dashboard/issues/2797)) ([6a833ca](https://github.com/polkadot-cloud/polkadot-staking-dashboard/commit/6a833cae656451c269d6f293dcfaf4238aa19f58))
* **refactor:** Optimise tsconfigs ([#2781](https://github.com/polkadot-cloud/polkadot-staking-dashboard/issues/2781)) ([00245a0](https://github.com/polkadot-cloud/polkadot-staking-dashboard/commit/00245a01717d82f7b0e33c384a7e9cf2fb5a728f))
* **refactor:** Use `@substrate/connect-known-chains` for light client chain specs ([#2643](https://github.com/polkadot-cloud/polkadot-staking-dashboard/issues/2643)) ([1638c17](https://github.com/polkadot-cloud/polkadot-staking-dashboard/commit/1638c17188c9d1ae4f70df2015f384c81ea80b18))
* **ux:** Simplified header UI, new Account, Settings popovers ([#2573](https://github.com/polkadot-cloud/polkadot-staking-dashboard/issues/2573)) ([d384b83](https://github.com/polkadot-cloud/polkadot-staking-dashboard/commit/d384b83409e6941187da2fd910a96b803644fcdc))
* Various fixes for solo chain support ([#2778](https://github.com/polkadot-cloud/polkadot-staking-dashboard/issues/2778)) ([d27fc66](https://github.com/polkadot-cloud/polkadot-staking-dashboard/commit/d27fc66b09ab4d5bd6edd875ec4f1db9fd195ccc))

## [1.2.0](https://github.com/polkadot-cloud/polkadot-staking-dashboard/compare/consts-v1.1.0...consts-v1.2.0) (2025-02-24)


### Features

* Rename dapp to Polkadot Cloud Staking ([#2550](https://github.com/polkadot-cloud/polkadot-staking-dashboard/issues/2550)) ([4e36712](https://github.com/polkadot-cloud/polkadot-staking-dashboard/commit/4e3671232bb0e7ffcbf73348c1a2af883277146f))
* **ux:** Shrink maximised side menu ([#2541](https://github.com/polkadot-cloud/polkadot-staking-dashboard/issues/2541)) ([2708b07](https://github.com/polkadot-cloud/polkadot-staking-dashboard/commit/2708b07a3c1889b20d042d7bceb61c57ec73580e))

## [1.1.0](https://github.com/polkadot-cloud/polkadot-staking-dashboard/compare/consts-v1.0.0...consts-v1.1.0) (2025-01-16)


### Features

* **fix:** Fix prettier organize imports, lint. ([#2340](https://github.com/polkadot-cloud/polkadot-staking-dashboard/issues/2340)) ([441caf7](https://github.com/polkadot-cloud/polkadot-staking-dashboard/commit/441caf7069b7d9a59116c05a88e82748e7b31388))
* init `ui-structure`, `consts`, `styles` packages, migrate Structure kit ([#2330](https://github.com/polkadot-cloud/polkadot-staking-dashboard/issues/2330)) ([6d15f49](https://github.com/polkadot-cloud/polkadot-staking-dashboard/commit/6d15f49460315940ec7a2502a2dca238f72c401f))
* **refactor:** Remove semi ([#2356](https://github.com/polkadot-cloud/polkadot-staking-dashboard/issues/2356)) ([4c10b19](https://github.com/polkadot-cloud/polkadot-staking-dashboard/commit/4c10b192612f557128b3eb23af68a24a993f41e7))
* Support options refresh with Discord and Mail ([#2331](https://github.com/polkadot-cloud/polkadot-staking-dashboard/issues/2331)) ([0700594](https://github.com/polkadot-cloud/polkadot-staking-dashboard/commit/07005940dc45a1921d530e18c5c49efd0f4c4d61))
