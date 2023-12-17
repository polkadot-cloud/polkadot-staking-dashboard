# Changelog

## [1.2.0](https://github.com/paritytech/polkadot-staking-dashboard/compare/v1.1.1...v1.2.0) (2023-11-15)


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
