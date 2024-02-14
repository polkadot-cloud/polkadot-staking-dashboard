# Changelog

## [1.1.5](https://github.com/paritytech/polkadot-staking-dashboard/compare/v1.1.4...v1.1.5) (2024-02-14)


### Features

* **refactor:** Active pools and syncing state redesign ([#1929](https://github.com/paritytech/polkadot-staking-dashboard/issues/1929)) ([d2446e1](https://github.com/paritytech/polkadot-staking-dashboard/commit/d2446e1140fff47424984ec37e6233388b9f542b))
* **refactor:** create pool accounts to hooks ([#1913](https://github.com/paritytech/polkadot-staking-dashboard/issues/1913)) ([42c0638](https://github.com/paritytech/polkadot-staking-dashboard/commit/42c0638f464662e741085966a886bb2fdf00c4b2))
* **refactor:** Hooks to own folder ([#1914](https://github.com/paritytech/polkadot-staking-dashboard/issues/1914)) ([4e46904](https://github.com/paritytech/polkadot-staking-dashboard/commit/4e469041aeafcddd51e2abbc36d2a453529a4bff))
* **refactor:** Menu refresh with mouse-based position ([#1945](https://github.com/paritytech/polkadot-staking-dashboard/issues/1945)) ([bf856d0](https://github.com/paritytech/polkadot-staking-dashboard/commit/bf856d0610a7dc2df844440ea895496e39666148))
* **refactor:** Misc project tidy ups ([#1933](https://github.com/paritytech/polkadot-staking-dashboard/issues/1933)) ([c905258](https://github.com/paritytech/polkadot-staking-dashboard/commit/c905258ddc5587b41febfa4266fd388bf00ee75e))
* **refactor:** nominatons to BalancesController ([78c8300](https://github.com/paritytech/polkadot-staking-dashboard/commit/78c8300dd1046a261dfda888f9d5ac4d0c916e20))
* **refactor:** persist Subscan results to class ([#1942](https://github.com/paritytech/polkadot-staking-dashboard/issues/1942)) ([b6312e6](https://github.com/paritytech/polkadot-staking-dashboard/commit/b6312e60c62daef57f4fe14aaa0cc04db03eeaba))
* **refactor:** Pool memberships to active balances ([#1915](https://github.com/paritytech/polkadot-staking-dashboard/issues/1915)) ([764a880](https://github.com/paritytech/polkadot-staking-dashboard/commit/764a880e0640416a5ad88b69d2e84887624b8f11))
* **refactor:** Syncing improvements ([#1935](https://github.com/paritytech/polkadot-staking-dashboard/issues/1935)) ([61645b1](https://github.com/paritytech/polkadot-staking-dashboard/commit/61645b17cb8efb0a1a72532930583ab2c671c1af))
* **refactor:** Use identities hook ([#1916](https://github.com/paritytech/polkadot-staking-dashboard/issues/1916)) ([f55f70f](https://github.com/paritytech/polkadot-staking-dashboard/commit/f55f70f165a26615ad3046f30ad4ca50ca62ba96))
* **ux:** View & copy pool addresses ([#1941](https://github.com/paritytech/polkadot-staking-dashboard/issues/1941)) ([850c0d9](https://github.com/paritytech/polkadot-staking-dashboard/commit/850c0d9d6c8d8f481a4a5ca59616b7b0ce34b14f))


### Bug Fixes

* stricter member count fetching ([#1911](https://github.com/paritytech/polkadot-staking-dashboard/issues/1911)) ([c453dd1](https://github.com/paritytech/polkadot-staking-dashboard/commit/c453dd1e07016b46425938a26615138d361819de))



## [1.1.4](https://github.com/paritytech/polkadot-staking-dashboard/compare/v1.1.3...v1.1.4) (2024-01-28)


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


## [1.1.3](https://github.com/paritytech/polkadot-staking-dashboard/compare/v1.1.2...v1.1.3) (2024-01-15)


### Features

* add block verification interval ([#1837](https://github.com/paritytech/polkadot-staking-dashboard/issues/1837)) ([0b9d6f2](https://github.com/paritytech/polkadot-staking-dashboard/commit/0b9d6f2d0737b0713410143bfb134bcfe5bb485d))
* add docs folder ([#1753](https://github.com/paritytech/polkadot-staking-dashboard/issues/1753)) ([78c506e](https://github.com/paritytech/polkadot-staking-dashboard/commit/78c506e5c97440ed5ee9b8f7f2bc4119b23f6635))
* Introduce Average Reward Rate  ([#1849](https://github.com/paritytech/polkadot-staking-dashboard/issues/1849)) ([e547a18](https://github.com/paritytech/polkadot-staking-dashboard/commit/e547a1862ec27de233434f181322b7bd984bc665))
* offline recovery ([#1836](https://github.com/paritytech/polkadot-staking-dashboard/issues/1836)) ([798163f](https://github.com/paritytech/polkadot-staking-dashboard/commit/798163f95f1ea96ce612e9d43d1ec7cf38c71b2e))
* Pool commission provider, compartmentalise forms of commission properties ([#1755](https://github.com/paritytech/polkadot-staking-dashboard/issues/1755)) ([8cc0517](https://github.com/paritytech/polkadot-staking-dashboard/commit/8cc0517e1e85099f51f43f17cf8fe227e8a68a5b))
* **refactor:** add stylistic eslint rules ([#1793](https://github.com/paritytech/polkadot-staking-dashboard/issues/1793)) ([461a438](https://github.com/paritytech/polkadot-staking-dashboard/commit/461a438cbf05b7a104efea52857356733773121a))
* **refactor:** API to static class ([#1826](https://github.com/paritytech/polkadot-staking-dashboard/issues/1826)) ([252547b](https://github.com/paritytech/polkadot-staking-dashboard/commit/252547ba299c3d5ecff773da4da47a458bd27cae))
* **refactor:** enforce curly, braces as needed ([#1795](https://github.com/paritytech/polkadot-staking-dashboard/issues/1795)) ([4199fa1](https://github.com/paritytech/polkadot-staking-dashboard/commit/4199fa1a16b39df8c47210ce4fdf9bafdb98997e))
* **refactor:** Notifications as `CustomEvent` emission ([#1775](https://github.com/paritytech/polkadot-staking-dashboard/issues/1775)) ([dbb3e06](https://github.com/paritytech/polkadot-staking-dashboard/commit/dbb3e06859f19f878b4afbd0d372c9b12a9ffc97))
* **refactor:** Pool members list to canvas ([#1796](https://github.com/paritytech/polkadot-staking-dashboard/issues/1796)) ([eb617f2](https://github.com/paritytech/polkadot-staking-dashboard/commit/eb617f274d6df26450502cfdef4bfcda5d657de4))
* **refactor:** Remove explicit `any` types project-wide ([#1773](https://github.com/paritytech/polkadot-staking-dashboard/issues/1773)) ([fd5a59e](https://github.com/paritytech/polkadot-staking-dashboard/commit/fd5a59eb5933f3ab11fd48eba8015889a7cc5325))
* **refactor:** remove ref from `OtherAccounts` ([#1825](https://github.com/paritytech/polkadot-staking-dashboard/issues/1825)) ([8fc49e1](https://github.com/paritytech/polkadot-staking-dashboard/commit/8fc49e180b0fcd836d8fabe6ac92cc84b6a67a0c))
* **refactor:** Remove remaining explicit `any` types, turn on `no-explicit-any` ([#1792](https://github.com/paritytech/polkadot-staking-dashboard/issues/1792)) ([5daa698](https://github.com/paritytech/polkadot-staking-dashboard/commit/5daa69827081a485d323cd51d24ab3d558954ec2))
* **refactor:** simplify average reward rate label ([#1850](https://github.com/paritytech/polkadot-staking-dashboard/issues/1850)) ([c568f3c](https://github.com/paritytech/polkadot-staking-dashboard/commit/c568f3c32f98fc0924cf60a3f41445a3cfd0d77e))
* **refactor:** Split pool types, replace explicit any types ([#1774](https://github.com/paritytech/polkadot-staking-dashboard/issues/1774)) ([f921baf](https://github.com/paritytech/polkadot-staking-dashboard/commit/f921baf5a08b3199cd6eff19ea3fb2d2a9897fc3))
* **refactor:** types to all `useState` hooks ([#1844](https://github.com/paritytech/polkadot-staking-dashboard/issues/1844)) ([69413b5](https://github.com/paritytech/polkadot-staking-dashboard/commit/69413b5cffb9202de918bbd763d9b8cc049509ef))
* **refactor:** use `html5-qrcode`, remove `react-qr-reader` ([#1802](https://github.com/paritytech/polkadot-staking-dashboard/issues/1802)) ([759a41e](https://github.com/paritytech/polkadot-staking-dashboard/commit/759a41ed0dda7814fbf72eaf5c625a93fc95af4b))
* **refactor:** Use Cloud `LedgerAccounts` context ([#1782](https://github.com/paritytech/polkadot-staking-dashboard/issues/1782)) ([9c59ebe](https://github.com/paritytech/polkadot-staking-dashboard/commit/9c59ebeaa7d83dfe45bd21ed7c0df552fab9f13a))
* **refactor:** useless fragments, linting tidy up ([#1768](https://github.com/paritytech/polkadot-staking-dashboard/issues/1768)) ([d9ecec5](https://github.com/paritytech/polkadot-staking-dashboard/commit/d9ecec52807cbc62b071f2abc2e6c4f1b6b2d177))
* timeout multiplier ([#1838](https://github.com/paritytech/polkadot-staking-dashboard/issues/1838)) ([620ed02](https://github.com/paritytech/polkadot-staking-dashboard/commit/620ed027f88874afd0246cba6425f971a522b4ba))
* upgrade from yarn classic to yarn modern (berry) ([#1752](https://github.com/paritytech/polkadot-staking-dashboard/issues/1752)) ([6f306cb](https://github.com/paritytech/polkadot-staking-dashboard/commit/6f306cbd645ded670090fa16cd804a8cf069ea8b))
* use `navigator.onLine` to handle api connection ([#1827](https://github.com/paritytech/polkadot-staking-dashboard/issues/1827)) ([bfef735](https://github.com/paritytech/polkadot-staking-dashboard/commit/bfef73520220d69841f33a4a001106b23490a103))
* **ux:** block number in network bar ([#1835](https://github.com/paritytech/polkadot-staking-dashboard/issues/1835)) ([0350b31](https://github.com/paritytech/polkadot-staking-dashboard/commit/0350b31234534c3c0a5d05ecd7d8db91dd218081))


### Bug Fixes

* Bond fixes ([#1816](https://github.com/paritytech/polkadot-staking-dashboard/issues/1816)) ([791ece3](https://github.com/paritytech/polkadot-staking-dashboard/commit/791ece366b7319a054f78a1d9b10f9891214c853))
* incorrect use of ?? operand ([d9e2418](https://github.com/paritytech/polkadot-staking-dashboard/commit/d9e2418e0c6ba28a80caea19b02ecadbcb38c61b))
* make odometer values copy-able ([#1834](https://github.com/paritytech/polkadot-staking-dashboard/issues/1834)) ([3cbb9d0](https://github.com/paritytech/polkadot-staking-dashboard/commit/3cbb9d00992848a7eee7c7c118548336bee2cd47))
* max bond fixes ([b49fe42](https://github.com/paritytech/polkadot-staking-dashboard/commit/b49fe423074e8032984bb0fc53476d3e43838eda))
* proxies: state and network change fixes ([268a1dd](https://github.com/paritytech/polkadot-staking-dashboard/commit/268a1dd8d45e0ea5b751547b405e10c2cda15731))
* read only account import, local account import ([#1833](https://github.com/paritytech/polkadot-staking-dashboard/issues/1833)) ([af843f5](https://github.com/paritytech/polkadot-staking-dashboard/commit/af843f5d706f5123ea54a54b811b56d2f7cf8d24))
* ready after consts ([a7f0bc9](https://github.com/paritytech/polkadot-staking-dashboard/commit/a7f0bc9dfd434bbcd653912a5897f7b6e2acd097))
* replace MAX_EXPOSURE_PAGE_SIZE ([8f44db1](https://github.com/paritytech/polkadot-staking-dashboard/commit/8f44db1d69c91277b446ed1c9ccdbc231495ba85))
* **worker:** add worker format ([f45d6ed](https://github.com/paritytech/polkadot-staking-dashboard/commit/f45d6ed08fbf339b3e27ecc0a53a6246e2f55f8d))


## [1.1.2](https://github.com/paritytech/polkadot-staking-dashboard/compare/v1.1.1...v1.1.2) (2023-11-15)


### Features

* add MethodNotSupported error to ledger ([#1627](https://github.com/paritytech/polkadot-staking-dashboard/issues/1627)) ([c756f5d](https://github.com/paritytech/polkadot-staking-dashboard/commit/c756f5da167279fc1fb3adbf9907bc7034a0904b))
* more info for inconsistent ledger versions ([#1640](https://github.com/paritytech/polkadot-staking-dashboard/issues/1640)) ([cb17371](https://github.com/paritytech/polkadot-staking-dashboard/commit/cb17371b5713b52fd1c34ec0bb647f2171ae21b4))
* Nova first if in wallet ([f74f276](https://github.com/paritytech/polkadot-staking-dashboard/commit/f74f27626ea890796bbba1714ec92c7b08964948))
* Nova icon ([814977c](https://github.com/paritytech/polkadot-staking-dashboard/commit/814977ce01da31716ed3a95140e9b42b71f2a233))
* nova standlone if in wallet ([1192b8a](https://github.com/paritytech/polkadot-staking-dashboard/commit/1192b8aa73af505c7e308a6f66833cc3f4de6453))
* pool context optimisations ([#1628](https://github.com/paritytech/polkadot-staking-dashboard/issues/1628)) ([ad4db96](https://github.com/paritytech/polkadot-staking-dashboard/commit/ad4db969875daf7994d57df1b4c572b92ae76b26))
* **refactor:** don't persist `system` external accounts, remove proxy `delegates` state ([#1639](https://github.com/paritytech/polkadot-staking-dashboard/issues/1639)) ([56314ae](https://github.com/paritytech/polkadot-staking-dashboard/commit/56314ae8584f42a40067c7c91abba94d7570afaf))


### Bug Fixes

* add balanceTxFees ([05056fa](https://github.com/paritytech/polkadot-staking-dashboard/commit/05056fafe870c5a0bb7e4426f002c392563ddce7))
* missing payout day ([#1618](https://github.com/paritytech/polkadot-staking-dashboard/issues/1618)) ([ffdac9c](https://github.com/paritytech/polkadot-staking-dashboard/commit/ffdac9c517672acdbdf911635d41b135b43ef85e))
* modal scroll fixes ([#1607](https://github.com/paritytech/polkadot-staking-dashboard/issues/1607)) ([4d03b33](https://github.com/paritytech/polkadot-staking-dashboard/commit/4d03b33bcd1ce0edc962b61cb3415efdcebf7a29))
* system read only accounts fix ([29b8052](https://github.com/paritytech/polkadot-staking-dashboard/commit/29b8052ee2e7605b967e2f684fbb316f824eabd5))
* use ledger square logo ([#1593](https://github.com/paritytech/polkadot-staking-dashboard/issues/1593)) ([badcac5](https://github.com/paritytech/polkadot-staking-dashboard/commit/badcac5c639855519d99f72f63d2efa1465e05eb))
* **ux:** NaN on whole value with format ([021f90b](https://github.com/paritytech/polkadot-staking-dashboard/commit/021f90b138cf109bfa69a8bcef9ac8bcf173f496))

## [1.1.1](https://github.com/paritytech/polkadot-staking-dashboard/compare/v1.1.0...v1.1.1) (2023-10-31)

### Bug Fixes

* Fixes an issue where extensions would not be discovered due to a hanging asynchronous function when Enkrypt, which injects its own window.ethereum object, was enabled.
* Misc theming fix.


## [1.1.0](https://github.com/paritytech/polkadot-staking-dashboard/compare/v1.0.9...v1.1.0) (2023-10-30)


### Features

* Add newly supported proxy calls ([#1554](https://github.com/paritytech/polkadot-staking-dashboard/issues/1554)) ([4ff9717](https://github.com/paritytech/polkadot-staking-dashboard/commit/4ff9717c3dce4068f31ec0dcc34c128df7eb4f06))
* add sync state for eraRewardPoints fetch ([aae111c](https://github.com/paritytech/polkadot-staking-dashboard/commit/aae111c538f2091a1694a13e21b14d1bcef47e8f))
* add validator performance ranks & quartiles, quartiles in generation methods ([#1546](https://github.com/paritytech/polkadot-staking-dashboard/issues/1546)) ([2955e70](https://github.com/paritytech/polkadot-staking-dashboard/commit/2955e706927eaf4da8952790ac7a3d2ed63d79f4))
* Add validator pulse graph to list items ([#1530](https://github.com/paritytech/polkadot-staking-dashboard/issues/1530)) ([e41168b](https://github.com/paritytech/polkadot-staking-dashboard/commit/e41168b93378f03a13c760af19a51af4d5a583e3))
* allow selection of RPC providers ([#1557](https://github.com/paritytech/polkadot-staking-dashboard/issues/1557)) ([c0553c2](https://github.com/paritytech/polkadot-staking-dashboard/commit/c0553c2c9b466a37b9d55811dbce1b8fbb6dafd3))
* **ci:** Add Release Please CI, update `CONTRIBUTING` ([#1470](https://github.com/paritytech/polkadot-staking-dashboard/issues/1470)) ([6b7dc60](https://github.com/paritytech/polkadot-staking-dashboard/commit/6b7dc60cece70cfeb4190ac4dacc205112578288))
* **cleanup:** remove deprecated `Nominate` and `NominatePools` modals ([#1540](https://github.com/paritytech/polkadot-staking-dashboard/issues/1540)) ([56ed4c0](https://github.com/paritytech/polkadot-staking-dashboard/commit/56ed4c0056278f706010a0eabee7978c2bebd03c))
* **context:** `ExtensionAccounts` provider ([#1494](https://github.com/paritytech/polkadot-staking-dashboard/issues/1494)) ([e8f11e9](https://github.com/paritytech/polkadot-staking-dashboard/commit/e8f11e92730dbb4b624b2ad6fa9fb5cf37732a1f))
* **help:** remove controller help items ([#1527](https://github.com/paritytech/polkadot-staking-dashboard/issues/1527)) ([743510f](https://github.com/paritytech/polkadot-staking-dashboard/commit/743510f30d87dc7d60d01bc5f530e856d416c6e2))
* Order nominations by nomination status. ([#1543](https://github.com/paritytech/polkadot-staking-dashboard/issues/1543)) ([0ab87f4](https://github.com/paritytech/polkadot-staking-dashboard/commit/0ab87f46db16576cd9ee9a795dfb28f82b6391c9))
* Refactor for reusable `ExtensionAccountsProvider` context  ([#1466](https://github.com/paritytech/polkadot-staking-dashboard/issues/1466)) ([13380bb](https://github.com/paritytech/polkadot-staking-dashboard/commit/13380bb5049fe8b55695d58e24a3928432b730d3))
* **refactor:** remove `NominateFromFavorites` modal ([#1528](https://github.com/paritytech/polkadot-staking-dashboard/issues/1528)) ([4bc62a3](https://github.com/paritytech/polkadot-staking-dashboard/commit/4bc62a373e3c4129adb5b717b56333356efc6b26))
* **refactor:** Separate titles from lists, reformat filters, fixes ([#1539](https://github.com/paritytech/polkadot-staking-dashboard/issues/1539)) ([ae5f95e](https://github.com/paritytech/polkadot-staking-dashboard/commit/ae5f95ed1036e7383ae59e2e6ff89833e5d6a179))
* **refactor:** use simple cloud react imports ([#1493](https://github.com/paritytech/polkadot-staking-dashboard/issues/1493)) ([839cc06](https://github.com/paritytech/polkadot-staking-dashboard/commit/839cc06c0dc4655f5ce383ed4c72d95cb0a32f39))
* Replace icons to cloud, remove dead wallet connect option ([#1506](https://github.com/paritytech/polkadot-staking-dashboard/issues/1506)) ([7e3efd2](https://github.com/paritytech/polkadot-staking-dashboard/commit/7e3efd2c8ec9864ca40ccc165c7ab5f76b581f94))
* store `eraRewardPoints` from recent eras ([#1529](https://github.com/paritytech/polkadot-staking-dashboard/issues/1529)) ([690ba51](https://github.com/paritytech/polkadot-staking-dashboard/commit/690ba51e7b8cfc7285fbdb90748362d85e848460))
* **ux:** min non-zero bar segment width ([#1555](https://github.com/paritytech/polkadot-staking-dashboard/issues/1555)) ([9377776](https://github.com/paritytech/polkadot-staking-dashboard/commit/9377776369fb6c63629c8622fd3ab9087ab70502))
* **ux:** Polkadot JS to developer tools category ([#1576](https://github.com/paritytech/polkadot-staking-dashboard/issues/1576)) ([5684c0a](https://github.com/paritytech/polkadot-staking-dashboard/commit/5684c0aaf45426ca9839abbb9b845bb5fee175ec))
* **ux:** Pool rewards worker & pool performance graphs ([#1547](https://github.com/paritytech/polkadot-staking-dashboard/issues/1547)) ([be4a556](https://github.com/paritytech/polkadot-staking-dashboard/commit/be4a5568fa7e46b33295f48ded3b7a2c81eec14c))


### Bug Fixes

* avoid negative free balance ([8fd61dd](https://github.com/paritytech/polkadot-staking-dashboard/commit/8fd61dd4bc68c8a4fa5982839761066accba20aa))
* **ci:** fix earliest release commit ([d873517](https://github.com/paritytech/polkadot-staking-dashboard/commit/d8735175cdb2a3ff2baf45df388634973eb6ee33))
* **ci:** last-release-sha ([7c9cea5](https://github.com/paritytech/polkadot-staking-dashboard/commit/7c9cea5dc4d04f05b59e46a6b2e5544e8a6b3ab3))
* fix bug on favorite pools visit ([#1526](https://github.com/paritytech/polkadot-staking-dashboard/issues/1526)) ([2f8ea85](https://github.com/paritytech/polkadot-staking-dashboard/commit/2f8ea85f6c639cf18d8154e6b908ef483122781a))
* fix new era reward points processing ([214da8d](https://github.com/paritytech/polkadot-staking-dashboard/commit/214da8d5c05f723c42c739f700d2180318bcf60f))
* fixed lag in timeleft refreh in last hour ([7b703cf](https://github.com/paritytech/polkadot-staking-dashboard/commit/7b703cfff83acd89a20b5075d0de6827cdfc22d8))
* miscellaneous fixes. ([#1538](https://github.com/paritytech/polkadot-staking-dashboard/issues/1538)) ([24d0ca6](https://github.com/paritytech/polkadot-staking-dashboard/commit/24d0ca6ed4b5c0d081db941c3cae898468fecdcc))
* payee toggle fix on setup ([3fe3031](https://github.com/paritytech/polkadot-staking-dashboard/commit/3fe30315d18691be6e7be846b945eb84cf89b8cf))
