# Changelog

## [1.2.0](https://github.com/paritytech/polkadot-staking-dashboard/compare/v1.1.3...v1.2.0) (2024-01-28)


### Features

* **ci:** add markdown-link-check ([#1865](https://github.com/paritytech/polkadot-staking-dashboard/issues/1865)) ([7e7134e](https://github.com/paritytech/polkadot-staking-dashboard/commit/7e7134ea2a42ec56d095e0809a4eaa05f94ad793))
* **fix:** account for staking rate in average reward rate ([#1886](https://github.com/paritytech/polkadot-staking-dashboard/issues/1886)) ([9938620](https://github.com/paritytech/polkadot-staking-dashboard/commit/9938620ee417bd42761a6e63828e3dd3ab8e7ee2))
* **refacor:** Pool config to bootstrap app state ([#1900](https://github.com/paritytech/polkadot-staking-dashboard/issues/1900)) ([8f51a86](https://github.com/paritytech/polkadot-staking-dashboard/commit/8f51a8672b843b7cd7172144e2157148d03325ca))
* **refactor:** Move balance syncing to static class, `activeBalances` in UI only. ([#1858](https://github.com/paritytech/polkadot-staking-dashboard/issues/1858)) ([a372487](https://github.com/paritytech/polkadot-staking-dashboard/commit/a3724879f377c38baf0e9b04e03749e0e2f65ee0))
* **refactor:** Move Polkawatch to inline instantiation ([#1890](https://github.com/paritytech/polkadot-staking-dashboard/issues/1890)) ([d7b88bd](https://github.com/paritytech/polkadot-staking-dashboard/commit/d7b88bd57701c16ad143a6e2b70897b5086f82f6))
* **refactor:** Move staking metrics `payee` to active balances ([#1904](https://github.com/paritytech/polkadot-staking-dashboard/issues/1904)) ([7b692e0](https://github.com/paritytech/polkadot-staking-dashboard/commit/7b692e06006448604929ec23fe510a7c7492141b))
* **refactor:** network metrics to static, bootstrap all state before subscribe ([#1896](https://github.com/paritytech/polkadot-staking-dashboard/issues/1896)) ([08a813c](https://github.com/paritytech/polkadot-staking-dashboard/commit/08a813c7d47d2055984f7d32c1d8b34bec9791f4))
* **refactor:** remove unneeded bonded getters ([7108e55](https://github.com/paritytech/polkadot-staking-dashboard/commit/7108e55d3f1aeeb07cdaa7cdb5608425b0d6641a))
* **refactor:** rm `ExtrinsicsProvider`, nonces to `TxMeta` ([4194150](https://github.com/paritytech/polkadot-staking-dashboard/commit/41941509cb0d930d53f3fc98a12736b0356c6846))
* **refactor:** Staking metrics to bootstrap and API ([#1905](https://github.com/paritytech/polkadot-staking-dashboard/issues/1905)) ([f6c0b93](https://github.com/paritytech/polkadot-staking-dashboard/commit/f6c0b93fc5fcaf2961c91cdeae770d5503766fe8))
* **refactor:** Subscan refactor, remove fetching from Providers ([#1878](https://github.com/paritytech/polkadot-staking-dashboard/issues/1878)) ([57e2a1b](https://github.com/paritytech/polkadot-staking-dashboard/commit/57e2a1bed952b41441635dc9eba02b79d63d3fc0))


### Bug Fixes

* balances no accounts sync ([#1889](https://github.com/paritytech/polkadot-staking-dashboard/issues/1889)) ([5316283](https://github.com/paritytech/polkadot-staking-dashboard/commit/5316283029f9a28003bb25814623f768f3294fb8))
* Render safe guards, pool useEffect fixes  ([#1906](https://github.com/paritytech/polkadot-staking-dashboard/issues/1906)) ([7c0212f](https://github.com/paritytech/polkadot-staking-dashboard/commit/7c0212f428e56b2eba9c735a6299c3661dd47b25))
* roll back Substrate Connect ([#1899](https://github.com/paritytech/polkadot-staking-dashboard/issues/1899)) ([33b5671](https://github.com/paritytech/polkadot-staking-dashboard/commit/33b5671caf5ec09240e164e82618efb15deebe81))
* unlock Chunk unit type ([afe9b1c](https://github.com/paritytech/polkadot-staking-dashboard/commit/afe9b1c0256eb9840a375f1d7574895a07ba0f4a))
