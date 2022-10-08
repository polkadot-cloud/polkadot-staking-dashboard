// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { HelpContentRaw } from 'contexts/Help/types';

export const HELP_CONFIG: HelpContentRaw = [
  {
    key: 'overview',
    definitions: [
      {
        title: 'Supply Staked',
        description: [
          'The current cumulative supply of {NETWORK_UNIT} being staked globally.',
          'The percentage of staked {NETWORK_UNIT} is relative to the total supply of {NETWORK_UNIT}.',
        ],
      },
      {
        title: 'Total Nominators',
        description: [
          'Accounts who are staking in the network, regardless of whether they are active or inactive in the current session.',
          'In order to stake {NETWORK_UNIT}, you must be a nominator.',
        ],
      },
      {
        title: 'Active Nominators',
        description: [
          'Nominators who are active in the current session.',
          'Being an active nominator does not guarantee rewards, as your nominees may be oversubscribed.',
        ],
      },
      {
        title: 'Your Balance',
        description: [
          'Your balance represents the total {NETWORK_UNIT} you have available in addition to your total staked amount, that includes the amount you have bonded in a Pool.',
          'Unlike your staked balance, your bonded pool balance is held and locked in the pool itself.',
        ],
      },
      {
        title: 'Reserve Balance',
        description: [
          'In {NETWORK_NAME}, you must have a balance above a certain amount for your account to exist on-chain. This amount is called your "existential deposit".',
          'Staking dashboard ensures that this amount of {NETWORK_UNIT} is never touched.',
        ],
      },
      {
        title: 'Network Stats',
        description: [
          'Real time network statistics that may affect your staking positions.',
          'Keep up to date on the state of the network from your Overview.',
        ],
      },
      {
        title: 'Inflation',
        description: [
          'DOT is inflationary; there is no maximum number of DOT.',
          'Inflation is designed to be approximately 10% annually, with validator rewards being a function of the amount staked and the remainder going to treasury.',
        ],
      },
      {
        title: 'Historical Rewards Rate',
        description: [
          'An estimated annual yield based on the {NETWORK_NAME} reward distribution model.',
        ],
      },
      {
        title: 'Ideal Staked',
        description: [
          'The percentage of staked total supply in ideal network conditions.',
        ],
      },
    ],
    external: [
      {
        title: 'How to Connect Your Accounts',
        url: 'https://support.polkadot.network/support/solutions/articles/65000182121-how-to-use-the-staking-dashboard-connecting-your-account',
        website: 'polkadot.network',
      },
      {
        title: 'How to Use the Staking Dashboard: Overview',
        url: 'https://support.polkadot.network/support/solutions/articles/65000182104-how-to-use-the-staking-dashboard-overview',
        website: 'polkadot.network',
      },
      {
        title: 'Staking your DOT',
        url: 'https://support.polkadot.network/support/solutions/articles/65000182104-how-to-use-the-staking-dashboard-overview',
        website: 'polkadot.network',
      },
    ],
  },
  {
    key: 'nominate',
    definitions: [
      {
        title: 'Nomination Status',
        description: [
          'The status of your nominations at a glance.',
          'A set of nominations will be inactive when none of those nominees are participating in the current validator set - the set of validators currently elected to validate the network.',
          'When at least one of your nominees are active, this nomination status will display as actively nominating - but this still does not guarantee rewards.',
          'The top {MAX_NOMINATOR_REWARDED_PER_VALIDATOR} nominators of each active validator receive rewards on {NETWORK_NAME}. So if a nominee is active and over-subscribed, you must be a part of the  {MAX_NOMINATOR_REWARDED_PER_VALIDATOR} highest bonded nominators to receive rewards.',
          'If an active nominee is not over-subscribed, you will receive rewards.',
        ],
      },
      {
        title: 'Stash and Controller Accounts',
        description: [
          'The Stash and Controller are simply {NETWORK_NAME} accounts that manage your staking activity.',
          "Your Stash account is the account used to hold your staked funds, whereas the Controller account is used to carry out Staking actions on the Stash account's behalf.",
          'When you switch accounts in this app, you are actually switching your Stash account. Your Controller account is then automatically fetched for you.',
          'This app assumes you have both Stash and Controller accounts imported. If you do not, you will not be able to use all app functions.',
          'You can assign a different Controller account on the Stake page.',
        ],
      },
      {
        title: 'Bonding',
        description: [
          'Bonding funds is the process of "locking" (or staking) {NETWORK_UNIT}. Bonded {NETWORK_UNIT} will then be automatically allocated to one or more of your nominated validators.',
          'The minimum active bond statistic is the minimum {NETWORK_UNIT} being bonded by a nominator for the current era.',
        ],
      },
      {
        title: 'Active Bond Threshold',
        description: [
          'The amount of {NETWORK_UNIT} needed to be actively nominating in an era. ',
          'Being above this metric simply guarantees that you will be present in the active nominator set for the era. This amount still does not guarantee rewards, as your active nominations may still be over-subscribed.',
          'Only the top {MAX_NOMINATOR_REWARDED_PER_VALIDATOR} nominators are rewarded per validator in {NETWORK_NAME}. Ensuring your active bond is above this threshold will increase your chances of rewards.',
          'You can keep track of these metrics from the dashboard and amend your staking position if necessary, whether increasing your bonded {NETWORK_UNIT} or changing your nominations.',
        ],
      },
      {
        title: 'Reward Destination',
        description: [
          'Your reward destination is where your rewards are sent to.',
          'Rewards can be automatically bonded on top of your current bond, or they can be sent to your stash, controller, or an external account of your choosing.',
        ],
      },
      {
        title: 'Nominating',
        description: [
          'Nominating is the process of selecting validators you wish to stake your {NETWORK_UNIT} to. You can choose to nominate up to 16 validators for each of your accounts.',
          'Once you have nominated your selected validators, they become your nominations.',
        ],
      },
      {
        title: 'Nominations',
        description: [
          'Nominations are the validators a staker chooses to nominate. You can nominate up to {MAX_NOMINATIONS} validators on {NETWORK_NAME}.',
          "Once nominations have been submitted, the staker's bonded funds are automatically distributed to nominees that are active in the curernt era.",
          'As long as at least one of your nominations is actively validating in a session, your funds will be backing that validator.',
        ],
      },
      {
        title: 'Inactive Nominations',
        description: [
          'Nominations that are in the active validator set for the current era, but your bonded funds have not been assigned to these nominations.',
        ],
      },
    ],
    external: [
      {
        title: 'Changing Your Reward Destination',
        url: 'https://support.polkadot.network/support/solutions/articles/65000182220-how-to-use-the-staking-dashboard-changing-reward-destination',
        website: 'polkadot.network',
      },
      {
        title: 'Bond More Tokens to Your Existing Stake',
        url: 'https://support.polkadot.network/support/solutions/articles/65000182207-how-to-use-the-staking-dashboard-bond-more-tokens-to-your-existing-stake',
        website: 'polkadot.network',
      },
      {
        title: 'Unbonding Your Tokens',
        url: 'https://support.polkadot.network/support/solutions/articles/65000182201-how-to-use-the-staking-dashboard-unbonding-your-tokens',
        website: 'polkadot.network',
      },
      {
        title: 'Rebonding',
        url: 'https://support.polkadot.network/support/solutions/articles/65000182221-how-to-use-the-staking-dashboard-rebonding',
        website: 'polkadot.network',
      },
      {
        title: 'Changing your Controller Account',
        url: 'https://support.polkadot.network/support/solutions/articles/65000182218-how-to-use-the-staking-dashboard-changing-your-controller-account',
        website: 'polkadot.network',
      },
      {
        title: 'Changing Your Nominations',
        url: 'https://support.polkadot.network/support/solutions/articles/65000182518-how-to-use-the-staking-dashboard-changing-your-nominations',
        website: 'polkadot.network',
      },
    ],
  },
  {
    key: 'pools',
    definitions: [
      {
        title: 'Nomination Pools',
        description: [
          'Nomination pools allow users to contribute {NETWORK_UNIT} and earn staking rewards.',
          'Unlike nominating, staking using pools requires a small amount of {NETWORK_UNIT}, and the pool manages nominees on your behalf.',
        ],
      },
      {
        title: 'Active Pools',
        description: [
          'The current amount of active nomination pools on {NETWORK_NAME}.',
        ],
      },
      {
        title: 'Minimum Join Bond',
        description: [
          'The minimum amount of {NETWORK_UNIT} needed to bond in order to join a pool.',
          'This amount is different from the bond needed to create a pool.',
        ],
      },
      {
        title: 'Minimum Create Bond',
        description: [
          'The minimum amount of {NETWORK_UNIT} needed to bond in order to create a pool.',
          'Creating a pool requires a larger deposit than that of joining a pool.',
        ],
      },
      {
        title: 'Pool Membership',
        description: [
          'Your pool membership status reflects whether you are a member of a pool.',
          'Pool memberships can either be that of a pool member or a pool owner.',
          'Currently on {NETWORK_NAME}, accounts can only join one pool at a time. If you wish to join another pool, you must leave your current pool first.',
          'To leave a pool, you simply need to unbond and withdraw all your bonded {NETWORK_UNIT}. Staking dashboard provides a dedicated Leave button to unbond from a pool.',
        ],
      },
      {
        title: 'Bonded in Pool',
        description: [
          'The amount of {NETWORK_UNIT} currently bonded in a pool.',
          "Unlike solo staking, where your bonded funds remain in your account but become locked, the {NETWORK_UNIT} you bond to a pool is transferred to the pool's stash account. Nonetheless, pool members still have access to unbond their funds at any time.",
        ],
      },
      {
        title: 'Pool Rewards',
        description: [
          'The amount of {NETWORK_UNIT} generated by being an active participant in a pool.',
          'Pool members are required to claim their rewards in order to have them transferred to their balance.',
          'Users have 2 choices for claiming rewards. They can be bonded back into the pool, that will increase your share of the pool and accumulate further rewards. Rewards can also be withdrawn from the pool to your account as free {NETWORK_UNIT}.',
        ],
      },
      {
        title: 'Pool Roles',
        description: [
          'A pool consists of 4 roles, each of which having different responsibilities in managing the running of the pool.',
          'Root: Can change the nominator, state-toggler, or itself. Further, it can perform any of the actions the nominator or state-toggler can.',
          'Depositor: Creates the pool and is the initial member. The depositor can only leave the pool once all other members have left. Once they leave by withdrawing, the pool is fully removed from the system.',
          'Nominator: Can select the validators the pool nominates.',
          "State-Toggler: Can change the pool's state and kick (permissionlessly unbond/withdraw) members if the pool is blocked.",
        ],
      },
    ],
    external: [
      {
        title: 'Creating Nomination Pools',
        url: 'https://support.polkadot.network/support/solutions/articles/65000182388-how-to-use-the-staking-dashboard-creating-nomination-pools',
        website: 'polkadot.network',
      },
      {
        title: 'Claiming Nomination Pool Rewards',
        url: 'https://support.polkadot.network/support/solutions/articles/65000182399-how-to-use-staking-dashboard-claiming-nomination-pool-rewards',
        website: 'polkadot.network',
      },
    ],
  },
  {
    key: 'validators',
    definitions: [
      {
        title: 'Validator',
        description: [
          'An entity that validates blocks for the {NETWORK_NAME} Relay Chain. Validators play a key role in {NETWORK_NAME} to secure the network and produce blocks.',
          'As a nominator, you choose which validators you wish to back, and receive rewards for doing so.',
        ],
      },
      {
        title: 'Active Validator',
        description: [
          "A validator that is actively validating blocks. Rewards are accumulated based on the validator's activity.",
          'A new set of validators are chosen for each era, so there is no guarantee the same validator will be active in subsequent eras.',
          '{NETWORK_NAME} allows a nominator to nominate up to 16 validators, maximising your chances of nominating an active validator in each era.',
        ],
      },
      {
        title: 'Average Commission',
        description: [
          'The average validator commission rate on {NETWORK_NAME}.',
          'This metric excludes validators who host a 100% commission, as these nodes usually block nominations are are run for the purposes of staking on central exchange platforms.',
        ],
      },
      {
        title: 'Era',
        description: [
          'At the end of each era, validators are rewarded {NETWORK_UNIT} based on how many era points they accumulated in that era. This {NETWORK_UNIT} reward is then distributed amongst the nominators of the validator via a payout.',
          '1 era is currently 24 hours in Polkadot.',
        ],
      },
      {
        title: 'Epoch',
        description: [
          'An epoch is another name for a session in {NETWORK_NAME}. A different set of validators are selected to validate blocks at the beginning of every epoch.',
          '1 epoch is currently 4 hours in Polkadot.',
        ],
      },
      {
        title: 'Era Points',
        description: [
          "Era Points are accumulated by validators during each era, and depend on a validator's performance.",
          'As a staker, you do not need to worry about Era Points. In general, better performing validators produce more Era Points, which in-turn lead to higher staking rewards.',
        ],
      },
      {
        title: 'Self Stake',
        description: [
          'The amount of {NETWORK_UNIT} the validator has bonded themself.',
          'This value is added to the amount of {NETWORK_UNIT} bonded by nominators to form the total stake of the validator.',
        ],
      },
      {
        title: 'Nominator Stake',
        description: [
          'The amount of {NETWORK_UNIT} backing the validator from its nominators.',
          "This value is added to the validator's self stake to form the total stake of the validator.",
          'Note that this value changes every era as the bonded funds of nominators are re-distributed to the active validators of that session.',
        ],
      },
      {
        title: 'Minimum Nomination Bond',
        description: [
          'The minimum amount you need bonded in order to nominate.',
        ],
      },
      {
        title: 'Commission',
        description: [
          'Validators can take a percentage of the rewards they earn. This chunk is called their commission.',
          'Nominating validators with low commissions mean you will receive a larger share of the rewards they generate.',
          'Many validators will have a commission rate of 100%, meaning you will receive no rewards by nominating these validators.',
          'Examples of such validators include those operating on behalf of exchanges, where nominating and reward distribution is done centrally on the exchange in question.',
          'A validator can update their commission rates as and when they please, and such changes will have an impact on your profitability. Be sure to monitor your nominations on this dashboard to keep updated on their commission rates.',
        ],
      },
      {
        title: 'Over Subscribed',
        description: [
          'Only the top {MAX_NOMINATOR_REWARDED_PER_VALIDATOR} nominators for each validator are rewarded in {NETWORK_NAME}. When this number is surpassed, this validator is considered over subscribed.',
        ],
      },
      {
        title: 'Blocked Nominations',
        description: [
          'When a validator has blocked nominations, nominators are unable to nominate them.',
        ],
      },
    ],
    external: [
      {
        title: 'How do I Know Which Validators to Choose?',
        url: 'https://support.polkadot.network/support/solutions/articles/65000150130-how-do-i-know-which-validators-to-choose-',
        website: 'polkadot.network',
      },
    ],
  },
  {
    key: 'payouts',
    definitions: [
      {
        title: 'Payout',
        description: [
          'Payouts are staking rewards on {NETWORK_NAME}. They depend on how many "Era Points" your nominated validators accrue over time. Rewards are determined at the end of every Era (24 hour periods).',
          'To receive staking rewards, a Payout needs to be requested. Any nominator backing the validator in question can request a Payout.',
          'One payout request triggers the reward payout for every nominator.',
        ],
      },
      {
        title: 'Last Era Payout',
        description: [
          'The total amount of {NETWORK_UNIT} paid out for the last active era.',
          'Payouts are distributed evenly amongst the active validators for that era, and are then further distributed to the active nominators that took part in that era.',
          'The payout amounts received depend on how much {NETWORK_UNIT} the nominators, and validators themselves, had bonded for that era.',
        ],
      },
      {
        title: 'Payout History',
        description: [
          'Historical records of payouts made for being an active nominator.',
          'Requesting payouts is a manual process, so you may receive payouts for multiple eras in quick succession or in a sporadic fashion. Your payout graphs may therefore have multiple payouts occur on the same day, or have days where there were no payouts.',
          'This does not mean that you were not nominating or generating rewards in that period - only that the payout for that period was not yet made.',
        ],
      },
    ],
    external: [],
  },
  {
    key: 'community',
    definitions: [],
    external: [],
  },
];

export const C_HELP_CONFIG: HelpContentRaw = [
  {
    key: 'overview',
    definitions: [
      {
        title: '抵押比例',
        description: [
          '目前全球{NETWORK_UNIT}的累计发行量',
          '抵押的百分比与{NETWORK_UNIT}总发行量相关',
        ],
      },
      {
        title: '总提名人数',
        description: [
          '在网络中参与抵押的账户,无论他们在当前session中是否活跃',
          '抵押{NETWORK_UNIT}的前提是成为提名人',
        ],
      },
      {
        title: '活跃提名人',
        description: [
          '当前session中活跃的提名人.',
          '因为您的验证人也可能己超额认选,所以活跃的提名人并不能保证能获得奖励.',
        ],
      },
      {
        title: '余额',
        description: [
          '除了抵押的总金额外，还包括在提名池中抵押了的{NETWORK_UNIT}总金额.',
          '和抵押的金额不同，质押的池金额是被持有并锁定在池中.',
        ],
      },
      {
        title: '储备金额',
        description: [
          '在{{NETWORK_NAME}}中，帐户必须有高于一定金额的余额才能在链上存在。这一数额称为“最低存款”.',
          '该应用确保账户永远不会低于这个数额.',
        ],
      },
      {
        title: '网络数据',
        description: [
          '实时网络信息可为您的抵押提供参考.',
          '可从总览中得到最新的网络数据.',
        ],
      },
      {
        title: '通货膨胀',
        description: [
          'DOT具有通货膨胀性. 所以无封顶数量.',
          '在验证人的奖励是基于抵押金额, 其余归国库所有的情况下, 每年通货膨胀率约为10%.',
        ],
      },
      {
        title: '历史年收益',
        description: ['根据{NETWORK_NAME}奖励分配数据估算的年收益.'],
      },
      {
        title: '最优比例',
        description: ['理想网络条件下的抵押占发行量的百分比.'],
      },
    ],
    external: [
      {
        title: '如何连接您的帐户',
        url: 'https://support.polkadot.network/support/solutions/articles/65000182121-how-to-use-the-staking-dashboard-connecting-your-account',
        website: 'polkadot.network',
      },
      {
        title: '如何使用Staking Dashboard:概述',
        url: 'https://support.polkadot.network/support/solutions/articles/65000182104-how-to-use-the-staking-dashboard-overview',
        website: 'polkadot.network',
      },
      {
        title: '抵押您的DOT',
        url: 'https://support.polkadot.network/support/solutions/articles/65000182104-how-to-use-the-staking-dashboard-overview',
        website: 'polkadot.network',
      },
    ],
  },
  {
    key: 'nominate',
    definitions: [
      {
        title: '提名状态',
        description: [
          '当前的抵押状态',
          '是否获得奖励取决于在当前Era是否有对活跃验证人的提名.',
          '以及是否超过了他们的认选.',
        ],
      },
      {
        title: 'Stash和Controller帐户',
        description: [
          'Stash和Controller只是用于管理抵押操作的{NETWORK_NAME}账户.',
          'Stash账户是用于存放抵押资金的账户,而Controlle账户则用于代表Stash账户执行抵押操作.',
          '切换帐户实际上是在切换Stash帐户到Controller帐户.',
          '请提前导入Stash和Controller帐户。否则将无法使用该应用程序的所有功能.',
          '可在抵押页面上导入不同的Controller帐户.',
        ],
      },
      {
        title: '质押',
        description: [
          '质押金额是“锁定”（或抵押）{NETWORK_UNIT}的过程。质押的{NETWORK_UNIT}将自动分配给一个或多个指定验证人.',
          '最低可活跃质押统计数是指在当前Era提名人中质押最少的{NETWORK_UNIT}.',
        ],
      },
      {
        title: '保持活跃度的质押阈值',
        description: [
          '在一个Era中为保持活跃提名的所需的{NETWORK_UNIT}数量. ',
          '高于这个标准能保证可以一直在这个Era的活跃提名人名单中。但这数额不保证能得到奖励,因为您的活跃提名人有超额认选的可能.',
          '在{NETWORK_NAME},只有前{MAX_NOMINATOR_REWARDED_PER_VALIDATOR}名提名人才能获得每个验证人的奖励。确保您的活跃度质押金额高于此阈值将增加获得奖励的机会.',
          '可以从页面中追踪这些指标, 并在必要时执行抵押操作如增加{NETWORK_UNIT}或更改提名.',
        ],
      },
      {
        title: '奖励地址',
        description: [
          '奖励地址是奖励被发送到的地方.',
          '奖励可以自动绑定到当前的绑定金额上,也可以发送到Stash、Controller或外部帐户上.',
        ],
      },
      {
        title: '提名中',
        description: [
          '提名是将{NETWORK_UNIT}作为抵押的验证人的过程。每个帐户最多提名16个验证者.',
          '一旦提名了选定的验证人,他们就会成为您的提名.',
        ],
      },
      {
        title: '提名',
        description: [
          '提名指选择验证人。最高提名数为16.',
          '质押金额会自动分配给当前Era活跃的提名人.',
          '只要本人提名中至少有一个提名在当前session中活跃执行验证,您的资金就会与该验证人绑定从而获得奖励.',
        ],
      },
      {
        title: '非活跃提名',
        description: ['指您的质押资金未分配到当前Era的活跃验证人群中的提名.'],
      },
    ],
    external: [
      {
        title: '更改奖励钱包地址',
        url: 'https://support.polkadot.network/support/solutions/articles/65000182220-how-to-use-the-staking-dashboard-changing-reward-destination',
        website: 'polkadot.network',
      },
      {
        title: '质押更多代币到现有的抵押',
        url: 'https://support.polkadot.network/support/solutions/articles/65000182207-how-to-use-the-staking-dashboard-bond-more-tokens-to-your-existing-stake',
        website: 'polkadot.network',
      },
      {
        title: '解除您的质押',
        url: 'https://support.polkadot.network/support/solutions/articles/65000182201-how-to-use-the-staking-dashboard-unbonding-your-tokens',
        website: 'polkadot.network',
      },
      {
        title: '解除质押中',
        url: 'https://support.polkadot.network/support/solutions/articles/65000182221-how-to-use-the-staking-dashboard-rebonding',
        website: 'polkadot.network',
      },
      {
        title: '更改您的Controller账号',
        url: 'https://support.polkadot.network/support/solutions/articles/65000182218-how-to-use-the-staking-dashboard-changing-your-controller-account',
        website: 'polkadot.network',
      },
      {
        title: '更改您的提名',
        url: 'https://support.polkadot.network/support/solutions/articles/65000182518-how-to-use-the-staking-dashboard-changing-your-nominations',
        website: 'polkadot.network',
      },
    ],
  },
  {
    key: 'pools',
    definitions: [
      {
        title: '提名池',
        description: [
          '提名池允许用户通过抵押{NETWORK_UNIT}获得奖励.',
          '与提名不同，使用提名池只需要少量{NETWORK_UNIT},池就会代表您管理提名人选.',
        ],
      },
      {
        title: '活跃提名池',
        description: ['网络上当前活跃的提名池数量.'],
      },
      {
        title: '最低入池质押金',
        description: ['加入池所需的最低{NETWORK_UNIT}金额.'],
      },
      {
        title: '最低建池质押金',
        description: ['建池所需的最低{NETWORK_UNIT}金额.'],
      },
      {
        title: '池成员资格',
        description: [
          'Your pool membership status reflects whether you are a member of a pool.',
          'Pool memberships can either be that of a pool member or a pool owner.',
          'Currently on {NETWORK_NAME}, accounts can only join one pool at a time. If you wish to join another pool, you must leave your current pool first.',
          'To leave a pool, you simply need to unbond and withdraw all your bonded {NETWORK_UNIT}. Staking dashboard provides a dedicated Leave button to unbond from a pool.',
        ],
      },
      {
        title: '质押在池中的金额',
        description: ['池中当前质押的{NETWORK_UNIT}金额.'],
      },
      {
        title: '提名池的奖励',
        description: [
          '作为提名池的活跃参与者所产生的{NETWORK_UNIT}奖励金额.',
          '用户需要申请提名池奖励才能获得奖励。奖励可以绑定回池,或作为免费{NETWORK_UNIT}发送到您的帐户.',
        ],
      },
      {
        title: '提名池里的角色',
        description: [
          '一个提名池里有4种角色,每个角色在管理池的运行方面具有不同的职责.',
          '主理人 ：可以更改提名人、状态切换人或其本身。此外，它可以执行提名人或状态切换人可以执行的任何操作.',
          '存款人：创建提名池并作为初始成员。只有在所有其他成员离开后能离开提名池。一旦他们退出，提名池将从系统中完全移除.',
          '提名人：可以选择提名池验证人.',
          '状态切换人：如果提名池被冻结，可以更改池的状态和踢出（无权限解除绑定/撤回）成员.',
        ],
      },
    ],
    external: [
      {
        title: '创建提名池',
        url: 'https://support.polkadot.network/support/solutions/articles/65000182388-how-to-use-the-staking-dashboard-creating-nomination-pools',
        website: 'polkadot.network',
      },
      {
        title: '申领提名池奖励',
        url: 'https://support.polkadot.network/support/solutions/articles/65000182399-how-to-use-staking-dashboard-claiming-nomination-pool-rewards',
        website: 'polkadot.network',
      },
    ],
  },
  {
    key: 'validators',
    definitions: [
      {
        title: '验证人',
        description: [
          '验证在{NETWORK_NAME}中继链中的区块的实体。验证人通过确保网络安全并生成区块在{NETWORK_NAME}起着关键作用.',
          '作为提名人，您可以选择支持哪个验证人并获得奖励.',
        ],
      },
      {
        title: '活跃验证人',
        description: [
          '正在验证区块的验证人。奖励根据验证人的活动表现累积.',
          '每个Era都会选择一组新的验证人,因此不能保证同一验证人在随后的Era 中会处于活跃状态.',
          '{NETWORK_NAME}允许提名者最多提名16名验证人,最大限度地提高您在每个Era 提名活跃验证人的机会.',
        ],
      },
      {
        title: '平均佣金',
        description: [
          'The average validator commission rate on {NETWORK_NAME}.',
          'This metric excludes validators who host a 100% commission, as these nodes usually block nominations are are run for the purposes of staking on central exchange platforms.',
        ],
      },
      {
        title: 'Era',
        description: [
          '在每个Era结束时,根据验证人在当前Era累积的Era点数奖励{NETWORK_UNIT}。该奖励随后会分配给该验证人下的提名人.',
          '1 Era目前在波卡是24小时.',
        ],
      },
      {
        title: 'Epoch',
        description: [
          'Epoch”是{NETWORK_NAME} session的另一个名称。在每个Epoch开始时选择一组不同的验证人验证区块.',
          '1个Epoch在波卡为4小时.',
        ],
      },
      {
        title: 'Era 点数',
        description: [
          'Era 点由验证人在每个Era累积,取决于验证人的性能.',
          '作为抵押者,您不需要在意Era 点数。一般来说,性能更好的验证人会产生更多的Era 点数，这反过来会得到更高的奖励.',
        ],
      },
      {
        title: '自我抵押',
        description: [
          'The amount of {NETWORK_UNIT} the validator has bonded themself.',
          'This value is added to the amount of {NETWORK_UNIT} bonded by nominators to form the total stake of the validator.',
        ],
      },
      {
        title: '提名人抵押',
        description: [
          'The amount of {NETWORK_UNIT} backing the validator from its nominators.',
          "This value is added to the validator's self stake to form the total stake of the validator.",
          'Note that this value changes every era as the bonded funds of nominators are re-distributed to the active validators of that session.',
        ],
      },
      {
        title: '最低提名质押金',
        description: ['提名所需的最低质押金额.'],
      },
      {
        title: '佣金',
        description: [
          '验证人可以获得一定比例的奖励。这部分被称为他们的佣金.',
          '提名佣金率较低的验证人意味着您将获得他们产生的更大份额的奖励.',
          '许多验证者的佣金率为100%，这意味着提名这些验证人将不会获得任何奖励.',
          '这类验证人的代表有交易所运营的验证人，其中提名和奖励分配是在相关交易所集中进行的.',
          '验证人可以随时更新他们的佣金率，这些变化将对您的盈利能力产生影响。请务必在页面上监控您的提名，以留意其佣金率更新.',
        ],
      },
      {
        title: '超额认选',
        description: [
          '只有每个验证人的前{MAX_NOMINATOR_REWARDED_PER_VALIDATOR}名提名人才能在{NETWORK_NAME}获得奖励。当超过该数时,该验证人将被视为超额认选.',
        ],
      },
      {
        title: '停止提名',
        description: ['当验证人停止提名时，提名人无法提名他们.'],
      },
    ],
    external: [
      {
        title: '如何选择验证人?',
        url: 'https://support.polkadot.network/support/solutions/articles/65000150130-how-do-i-know-which-validators-to-choose-',
        website: 'polkadot.network',
      },
    ],
  },
  {
    key: 'payouts',
    definitions: [
      {
        title: '收益',
        description: [
          '在{NETWORK_NAME}里抵押的收益。取决于您验证人随时间累积的“Era点数”。奖励金额会在每个Era结束时确定(24小时).',
          '要获得抵押奖励,需要手动申领。任何支持该验证人的提名人都可以申领.',
          '一个申请可触发每所有个提名人的奖励申领.',
        ],
      },
      {
        title: '上一Era收益',
        description: [
          '上一Era活跃的总{NETWORK_UNIT}奖励金额.',
          '收益在该Era的活跃验证人之间平均分配,然后进一步分配给参与该Era的活跃提名人.',
          '得到的收益金额取决于提名人和验证人自己在那个Era绑定了多少{NETWORK_UNIT}.',
        ],
      },
      {
        title: '收益记录',
        description: [
          '一名活跃提名人的收益历史记录.',
          '申领奖励是一个手动的过程，可能会快速连续或以零星方式收到多次收益。因此，您的收益图可能会在同一天发生多个收益，或者几天没有收益.',
          '这并不意味着您在该期间没有提名或产生奖励，只是该期间的收益尚未被申领.',
        ],
      },
    ],
    external: [],
  },
  {
    key: 'community',
    definitions: [],
    external: [],
  },
];
