# Polkadot Staking Dashboard

> This project is a work in progress, and should only be used for testing and development purposes. Do not use this app for Polkadot staking until its initial release.

## Demo
[https://rossbulat.github.io/polkadot-staking-dashboard/](https://rossbulat.github.io/polkadot-staking-dashboard/)

<img width="1569" alt="dashboard" src="https://user-images.githubusercontent.com/13929023/163815633-df567f72-f285-4d31-b266-0a9836ea042b.png">

## Milestones

Features are being implemented in an incremental fashion. We are considering the app MVP once the following tasks are completed:

- [x] Initial app layout and navigation
- [x] Assistant initialisation
- [x] Live charts
- [x] Network metrics, staking metrics 
- [x] Polkadot JS accounts import
- [x] Stash / controller account abstraction
- [x] Performant validator list fetching and meta data syncing
- [x] Validator filtering initialisation and favourite validators
- [x] Theming support
- [ ] Integrate Intention / Active Bond Thresholds
- [ ] Initial Nomination management tooling
- [ ] Extrinsics
- [ ] Recent Payouts as list
- [ ] Node only / External API toggles
- [ ] Screen size support 

Features coming soon:
- [ ] Nomination Pools
- [ ] Talisman support

Additional features that are being considered:
- [ ] Validator Lists
- [ ] Validator selection algorithm
- [ ] Validator ranking algorithm
- [ ] Wallet Connect support

## Project Updates
- 08/04/2022: [[Video] Polkadot Staking Dashboard April 2022 Update](https://www.youtube.com/watch?v=y6AJ6RhKMH0)
- 09/03/2022: [Representing the Stash and Controller Account](https://medium.com/@rossbulat/polkadot-staking-experience-representing-the-stack-and-controller-account-2ea76bb54b47)
- 28/02/2022: [Defining the Polkadot Staking Experience: Phase 0](https://rossbulat.medium.com/defining-the-polkadot-staking-experience-phase-0-211cb2bc113c)

## About
A React app aiming to create a consistant UX experience for Polkadot staking. 

It introduces an interface consisting of a range of components specifically designed to handle staking requirements around event-driven interfaces, with an emphasis on transitions as events are received from external data sources.
