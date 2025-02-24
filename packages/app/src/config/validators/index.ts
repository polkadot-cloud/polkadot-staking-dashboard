// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export type ValidatorSupportedChains = 'polkadot' | 'kusama' | 'westend'

export interface ValidatorEntry {
  name: string
  icon: string
  bio: string
  email?: string
  x?: string
  website?: string
  // NOTE: must have at least one active validator on at least one network.
  validators: Partial<Record<ValidatorSupportedChains, string[]>>
}

export const ValidatorCommunity: ValidatorEntry[] = [
  {
    name: '🍁 HIGH/STAKE 🥩',
    icon: 'Highstake',
    bio: 'We came for the memes, we stay for the tech. Located in Switzerland with 15+ years of experience in running reliable online services. We are exclusively running our validators on dedicated hardware in datacenters across Europe.',
    email: 'highstake@nexus-informatik.ch',
    website: 'https://highstake.tech/',
    validators: {
      polkadot: [
        '12bget8jJWnyjqYPiCwkXZjDh5tDBkta1WUcDYyndbXVDmQ1',
        '12Dw4SzhsxX3fpDiLUYXm9oGbfxcbg1Peq67gc5jkkEo1TKr',
      ],
      kusama: [
        'DbRgw96nMQcFEFZWTLd6LSPNdh8u3NBuUDfAhDmB6UU8cJC',
        'HQuPha82sRy91zZn73XRGJVV3ernBh5HZKftUcoDT8CSUwK',
      ],
    },
  },
  {
    name: 'Amforc',
    icon: 'Amforc',
    bio: 'We are a independent and experienced staking provider from Switzerland. We run our validators in a hybrid cloud setup across multiple geographical locations. Our validators run significantly above average and close to no blocks are missed as para-validator.',
    email: 'staking@amforc.com',
    x: '@amforcag',
    website: 'https://amforc.com/',
    validators: {
      polkadot: [
        '1y6CPLgccsysCEii3M7jQF834GZsz9A3HMcZz3w7RjGPpBL',
        '1gBKvQ9vbraAfhxEroBnxoGp9687Hu5wR7NYSwgJeAsw4x8',
        '12Ftq9EM1qc3persmD9NFrzFZqF5CALsP7oKDUsGTBe7FBDm',
        '13N2JTpk5hhLczQRqxJRmfuCbxTusvDgXYfzkjVoEbaHtpZV',
        '13avpNYE4rTxhN2EfJv8zcX1U52JLNgiTtgqrpEDoLZwZxd',
        '15xzmgiDUyguYSqZjhi4dGPiUbsW4Z6b3cYALgbUjhE5pKpT',
      ],
      kusama: [
        'DVUNoinHdSNfismcrFaBwdJfysxc7A48QkNvTDnTSPXPw3q',
        'DpLatoXXBiSAPooF17bzUZGo7huNB7USfRqd2SgL6RBy2zr',
        'E8zY6KdAH1vuKKMaPdHYLAziht32v2BLqXk6qBw7WtiV2Dv',
        'Ff3xdNrXA47svhiTJHj9uNhxLo29PYjYcJ9cUseAd9FK6iQ',
        'EyQ1wV8jQdKYEWh7FiN2mnkFzAepfq6LfKbWLy7qQkLynGg',
        'J9KLy6nouPoj5rA2RWX8C9wrmrg84Mv3hpB7mZTN7Jvww7C',
        'Czy1KnZV1DqSPcHd6k1WL6fe4nsyhAuiJ9ALZtVvyomdc8y',
      ],
    },
  },
  {
    name: 'Aperture Mining 🎂',
    icon: 'ApertureMining',
    bio: 'Self-hosted / Decentralized Nodes. Low commission and high reliability. We host our own hardware in our own facility right here in Philadelphia PA, USA. Aperture Mining has been offering cryptocurrency staking and mining solutions since 2018.',
    email: 'validator@aperturemining.com',
    website: 'https://aperturemining.com',
    x: '@ApertureMining',
    validators: {
      polkadot: ['145SvVXoAwR5ufJynYWDeNXzfyxbf5VkCqkHu3Jt7FSdYBE2'],
      kusama: [
        'FJcnsNkMjY8tgJrDVeq5CKoB1b4Au2xGQjaMv8Ax5QAiV6p',
        'Cad3MXUdmKLPyosPJ67ZhkQh7CjKjBFvb4hyjuNwnfaAGG5',
        'Hcbo6hyfVgExCKrjmJic9bg4gLWgYy6HLrjcXUYy2VgLG7a',
      ],
    },
  },
  {
    name: 'bLd Nodes | ChadStakeKing',
    icon: 'bLdNodes',
    bio: 'Independant validator, professionnal Web3 Devops engineer, bLd Nodes is focusing on providing small scale validators and collators with low commission. Proud co-founder of the DOT Validator Alliance',
    email: 'gm@bldnodes.org',
    website: 'https://bldnodes.org',
    validators: {
      polkadot: ['12bLdVAgWiKHgFHtAaQstasMUWVq35oG9iwHCwsKoFFNoNrk'],
      kusama: ['Hf8C626KBAjitMV7w8AhQWDCiPgUU47htEwbomq5mDMKeyL'],
    },
  },
  {
    name: 'Blockseeker.io',
    icon: 'Blockseeker',
    bio: 'Independant validator, software engineer and web3 enthusiast, focusing on providing tools and building for web3 running bare metal/dedicated nodes to help decentralize the network. Only charges a small fee to help maintain nodes and effort in running them.',
    email: 'dev@blockseeker.io',
    x: '@blockseeker_io',
    website: 'https://blockseeker.io',
    validators: {
      polkadot: ['131Qzz7SvHUn7zdDAt2jFZmzVsP2KkoiDWLZa9N7FivGTXpB'],
      kusama: [
        'HPuireorhWdSCQg5dG1zeGk7XCuAfkb21BtDyLqRuN62k67',
        'J6if9c47o81JsMeB75VwkXtx1nVEaMPvQxuMRYhBR8H6ULU',
      ],
    },
  },
  {
    name: 'Coinbase Cloud',
    icon: 'CoinbaseCloud',
    bio: 'Our staking infrastructure powers the leading crypto products and exchanges. We offer the same infrastructure in our public validators and make it available to you.',
    email: 'cloud-support@coinbase.com',
    x: '@CoinbaseCloud',
    website: 'https://www.coinbase.com/cloud',
    validators: {
      polkadot: [
        '1VrKDfXunzstY5uxPpjArUbZekirGXcpMDYvCBJmjV1KdEm',
        '16Dgcx1qJzp8kme1CWsySDf3JWd1oKtbChYVm2yAYqM44woY',
        '12Yz9HPcF66pAGpwEW5cyFZ59TFeXFGVnkuxTphC3Lrap29z',
        '12e1tkDgfF3GYdiTkRq1vunXrvvhpKq3BQZYbJ1haXHApQTn',
        '12eKZbGJKVyHfTPkUs9MrJeGkbFrZRqzhKBBeRJ3G3YoWPun',
        '12q76RYkETZ6UACiiznBicXgcXZ8EMFAuPv8QtfSrc6KSLYo',
        '1A2ATy1FEu5yQ9ZzghPLsRckPQ7XLmq5MJQYcTvGnxGvCho',
        '15V6NjwmKkZihe644Tyr8GVLxjEzBAHktf6ZcJCTx7RPCoYS',
        '124YFXA3XoRs9Epcx3aRUSk3EKYaznocqMWfrMKtGjx8TJ2W',
        '12ECDEb18Wiy4MoLn3NTM5zhJfDfpS4mLNvjHpcEr8ogGrMZ',
        '12HFymxpDmi4XXPHaEMp74CNpRhkqwG5qxnrgikkhon1XMrj',
        '12WmM98h4Ar6y7ZyyMKPXwSyuP5GSZvXTbEkDXm1tirbZFW4',
        '13BN4WksoyexwDWhGsMMUbU5okehD19GzdyqL4DMPR2KkQpP',
        '14XefeqDxiaVQEo7Xv7WBs3Wz8GZPes7DBjQxsNuxu683B9o',
        '1486kNkPxvF7Pmgfr4MskGnn4p4KXCigMejv5Q7szMowioKK',
        '14wFkAiTSxhUUdpkN37QMhZv6dYcURJVgSGwqDRd4TK2qhrL',
      ],
      kusama: [
        'EFjHdypk8xLf3ocDEFPaKFWVcfamH8mpvfUeXHvRWpSBk2M',
        'DXrJrPLLBHuapmYJ6tfuUStKubhykWmpgLckJpgFgjp2JvV',
      ],
    },
  },
  {
    name: '🌐 decentraDOT.com 🌐',
    icon: 'Decentradot',
    bio: 'decentraDOT is a leading provider of high-quality Polkadot validators, located in The Netherlands. Our edge lies in hosting exclusively on our own in-house hardware, ensuring top-notch security and performance.',
    email: 'admin@decentradot.com',
    website: 'https://decentradot.com',
    validators: {
      polkadot: [
        '15wznkm7fMaJLFaw7B8KrJWkNcWsDziyTKVjrpPhRLMyXsr5',
        '12QTG1GrqFtS6AJWw4NwHDXgbhPyjyT6BfJK5qAGedkvnrpQ',
        '12ZKgiVzygpYvvVR3hXMDysNTmX4GLzMqtGrZY3rmwLcCdiT',
        '15XtoWwkanySeWKduwoLGjJPCXTRdCDMfa5UKF2KvG7wmekj',
        '133NkGSCzjzGTb2oepvrsWQLvD3E4sAZj6VR9B1eNiE6V26i',
      ],
      kusama: [
        'GRSWBC1kCuNVp8KTgGyK7Bo3bP7CdLDPwfnx2L5JJLQ41Qj',
        'Em4HYqVrWX3uCvrC8NWoabfKpV9z8stdRKkXYXcZdWGxdXT',
        'HqF6t7B84v2XTbAC4VZmjsyQhvRUJrcCdUPAYVCpYru32SU',
      ],
    },
  },
  {
    name: 'deigenvektor.io',
    icon: 'Deigenvektor',
    bio: 'deigenvektor.io is an independent validator operating its own hardware in the Canton of Zug, Switzerland. We focus on delivering reliable and secure validator services using the highest-performing hardware available.',
    email: 'info@deigenvektor.io',
    website: 'https://deigenvektor.io',
    validators: {
      polkadot: ['1guBaaUmYpYPmsNmooQApqFmpmRHeaipb1CxoncMuiaqXGh'],
      kusama: [
        'Dd93SeZZD6F8z68q7VNi2GdT8u1cgU5f2mTifA1f5v5A5km',
        'F2WyUUFXLYnBg6acv7t2KFzH6D7CyNcvC4mRCwUdsHTUB4t',
      ],
    },
  },
  {
    name: 'Dionysus🍇',
    icon: 'Dionysus',
    bio: 'Independent secure rigorously monitored validation service for Polkadot and Kusama Networks operated by Web3 researchers and engineers with a proven record in running reliable secure infrastructure.',
    email: 'hi@dionysus.network',
    website: 'https://dionysus.network',
    validators: {
      polkadot: ['12CJw9KNkC7FzVVg3dvny4PWHjjkvdyM17mmNfXyfucp8JfM'],
      kusama: [
        'FWz717J6ATaYSNy2tRHAskEC9SP4uKHNJYC9mvfvimkB8GT',
        'DrymfiuRSkpVCqy3tFxAsYEUUiXVNeghCkhcsWor6RA1K7c',
        'DYLJXVDuT3wNfnYZ1nQoTXcpguX4hk2y93q4RnCEMuU9jTr',
        'GjndRb4VKJatuFpxgSVULRGRULFcwxNHubrnoGZzGwfK4YT',
        'FFAatME5P5gMazo9AywhqmeqVLTNMPrDtJsT9saxuy2BYpE',
        'FyL5TJXFEWDHC1yuBGwtngo3LRg4nEQ4ua47p1szMQdh8HR',
      ],
    },
  },
  {
    name: 'Dozenodes',
    icon: 'Dozenodes',
    bio: 'Independent Polkadot and Kusama Validator. We are running secure and reliable nodes based in central europe operated by experienced engineers.',
    email: 'contact@dozenodes.com',
    website: 'https://dozenodes.com',
    validators: {
      polkadot: ['167ShbHu769mP5jbtt7AHayJhzEied6s8M5kN5nBSAQewnRz'],
      kusama: [
        'DDhVgn62SE2riWjS6U4AaYtfLNKuFxqTU32EnqAtAuxqM58',
        'JA9TjkzZzsJnBC8igbnLZ2WYvgsYHd6fu54QJAViqnADoZq',
        'HnGgDUuyT97UcSpHhPaxY1h2MPFAjE1qiS9oKRMx5md6464',
      ],
    },
  },
  {
    name: 'Frog🐸',
    icon: 'Frog',
    bio: 'At Frogstaking.com we provide secure and reliable staking nodes. We are an experienced team of dedicated node operators for the DotSama ecosystem aiming to provide low-fee on-chain services.',
    email: 'info@frogstaking.com',
    website: 'https://frogstaking.com/',
    validators: {
      polkadot: ['16PpE8pMFscQ34aCbFcCqGmmhj9HFyDJJxKqZNQse1kVjyXc'],
      kusama: [
        'EoUT1KcbyPJr5tDQkejjzHsF9p6EGP2c5Q8bYonvhZ7giY7',
        'D3NG36j7JXeP1pi5ZsiJBtHBsbbtrTddJQdAgYKff3eTAX9',
      ],
    },
  },
  {
    name: 'GATOTECH 😸',
    icon: 'Gatotech',
    bio: 'Gatotech Ltd is a Scottish IT company focused on the adoption of decentralised ledger technologies (DLT) for the benefit of humankind.',
    email: 'info@gatotech.uk',
    x: '@gatotech_uk',
    website: 'https://gatotech.uk',
    validators: {
      polkadot: [
        '15iA5hpjUecWBbf38Nfegwmtyux25o3LrGaNodfZDxq5nXXE',
        '14KHzXAZ5admFLXdgbEGpSjCGxiePniHRDM6t5r4o8kbYV7P',
      ],
      kusama: [
        'DrRBkx2Qx4sXRGZDXz6d44QCXqV2eJhn8Rq79V88FpSqAr8',
        'EeFYYF8zrLXRpfFXLn2T5bMmgiFpDpmAhVzoh9hA3188wTc',
      ],
    },
  },
  {
    name: 'GoOpen',
    icon: 'GoOpen',
    bio: 'Independent Polkadot Validator. Polkadot teacher on Moralis academy. With strong knowledge of Linux, making sure that the validator is running on a secure and up-to-date system with optimal hardware.',
    validators: {
      polkadot: ['16VVNbc4m6aUxwaVwgRra6Ue7fMNGcRQHTFo1TqxmnCyuwwn'],
      kusama: ['JJiV1xrj1814BVDDG2pFCsgzdbR7K29VcyXQGXEUhn7LWhK'],
    },
  },
  {
    name: 'GuruStaking👳',
    icon: 'GuruStaking',
    bio: 'We are thrilled to have you join us in this exciting journey of blockchain validation and decentralized governance. As a validator, we play a crucial role in securing the network, verifying transactions, and contributing to the overall stability and reliability of the DotSama ecosystem.',
    email: 'stake@gurustaking.com',
    x: '@GuruStaking',
    website: 'https://gurustaking.com',
    validators: {
      polkadot: [
        '138tCNoHg9QbhjqanRS7R8ZC8547A6CdaSmrCtJCRLpjQk6r',
        '1ja8qGypM5HT9Rqq6AGQ9z58bSi2kfkrqsGuB84zxdp1SZH',
      ],
      kusama: [
        'F5j1j9TJ7xWePJmYh64Bf2b97pmer3mX1BsonCUpx3CJZpu',
        'ESE6ka6wGpXGDJ5ykjAvH1TTuAC9Dg5VFfc1dcfoEwX9qc1',
      ],
    },
  },
  {
    name: 'Helikon',
    icon: 'Helikon',
    bio: 'We are an independent blockchain software, infrastructre and staking services company from Istanbul. We run our validators on state-of-the-art owned hardware in a Tier III colocation data center just outside Istanbul. Please visit our website for more information about our products and services.',
    email: 'info@helikon.io',
    x: '@helikonlabs',
    website: 'https://www.helikon.io',
    validators: {
      polkadot: ['123kFHVth2udmM79sn3RPQ81HukrQWCxA1vmTWkGHSvkR4k1'],
      kusama: [
        'GC8fuEZG4E5epGf5KGXtcDfvrc6HXE7GJ5YnbiqSpqdQYLg',
        'GougF9o6LNGrAMb1ZtH9XWePVCz1PBAvwatjvCtw75M6M3q',
        'Gfwy4tGZvCnKmwQDE1tHjGPNY2LDqezW6bPY4mYMrrjiWnE',
        'D2S7Qa6oPYAaJeX7vciJFUCDqBHBkHBfBCGbpm7bog8bBMZ',
      ],
    },
  },
  {
    name: 'Jimmy Tudeski | Stakenode ʕ •ᴥ•ʔ',
    icon: 'Stakenode',
    bio: 'Stakenode provides validation and staking services for Polkadot and Kusama relay chains and parachain networks. We are independent node operators, experienced Dotsama ambassadors, focused on community, decentralisation and ecosystem development. Come stake and build with us.',
    email: 'jimmytudeski@stakenode.dev',
    x: '@stakenode_dev',
    website: 'https://stakenode.medium.com/',
    validators: {
      kusama: [
        'FvdwMNP57nRWEsNZZsrHWKqnbmduy4jBAC8MeLmgi9Yp8sA',
        'D3Sr3PozgPypkBzKBheGSJbqu8m4idenBPaWtZUXLWPtjJT',
      ],
    },
  },
  {
    name: 'Blockshard',
    icon: 'Blockshard',
    bio: 'Non-custodial staking made in Switzerland. At your service since 2018. Previously known as LetzBake!',
    email: 'hello@blockshard.io',
    x: '@blockshard1',
    website: 'https://blockshard.io',
    validators: {
      kusama: ['Cp4U5UYg2FaVUpyEtQgfBm9aqge6EEPkJxEFVZFYy7L1AZF'],
    },
  },
  {
    name: 'METASPAN',
    icon: 'Metaspan',
    bio: 'End-to-end blockchain solutions, building on Polkadot and Kusama.',
    email: 'hello@metaspan.com',
    x: '@metaspan_io',
    website: 'https://metaspan.com/',
    validators: {
      polkadot: ['16ce9zrmiuAtdi9qv1tuiQ1RC1xR6y6NgnBcRtMoQeAobqpZ'],
      kusama: ['HyLisujX7Cr6D7xzb6qadFdedLt8hmArB6ZVGJ6xsCUHqmx'],
    },
  },
  {
    name: 'G-dot Tech',
    icon: 'Gdot',
    bio: 'G-dot Tech is providing professional staking services on well-maintained bare metal machines with locations across Europe. Our goal is to contribute to the decentralization of Polkadot and Kusama by staying independent with a small share among the active validators. Feel free to reach out any time if you have questions.',
    email: 'g-dot.tech@protonmail.com',
    website: 'https://g-dot.tech/',
    validators: {
      polkadot: ['153Fz22gxQP8HM8RbnvEt9XWsXu9nR8jxZC2MbQFmuKhN62f'],
      kusama: [
        'G9zJwPviHn5qRHCRX4Gm75XtUob9Cagyu4fdrhrzwsbqUwX',
        'HHvov74Rs8S9zGJifq7HKw4Ua14medsxokDyyCwjSSDfSj7',
        'DPdkDRzUV56F5R8fNjZwFx2Uctn173c1UJJXjxQMVMZuCqS',
      ],
    },
  },
  {
    name: 'Generic-Chain',
    icon: 'GenericChain',
    bio: 'Generic-Chain validation servers, by TwoPebbles Ventures, have an outstanding operations team that provides professionally managed infrastructure, maximizing returns with ultra-reliable and secure validation services.',
    email: 'info@generic-chain.io',
    x: '@generic_chain',
    validators: {
      polkadot: ['13pZskDR7Pt67NtcChSr4uFRBf9ZS52nQeyrceSykq8MDrMe'],
      kusama: [
        'EiMA69PZWju1jmisAU3ubN4wJQgBexnFXZpWb7aMtftP5rV',
        'J6HHWeSmt5PjoDCRzVvB5oJnQMMvCM5iNBd5W42S8L3BbVK',
        'EffRLTpaDPBa6G6UUhXCVdn2SNyeMxPJttucrtppEjnHkST',
      ],
    },
  },
  {
    name: 'P2P.ORG Validator',
    icon: 'P2POrg',
    bio: 'P2P.ORG is a leading institutional grade validator in the Dotsama network, renowned for offering the highest APR on the market, an impressive track record with zero slashing events since Genesis, 24/7 personal support, in-depth analytics through a customized dashboard, a strong commitment to uptime with 99% SLA.',
    email: 'letsgo@p2p.org',
    x: '@P2Pvalidator',
    website: 'https://p2p.org',
    validators: {
      polkadot: [
        '121gZtuuG6sq3BZp1UKg8oRLRZvp89SAYSxXypwDJjaSRJR5',
        '12ud6X3HTfWmV6rYZxiFo6f6QEDc1FF74k91vF76AmCDMT4j',
        '14Y626iStBUWcNtnmH97163BBJJ2f7jc1piGMZwEQfK3t8zw',
        '14AkAFBzukRhAFh1wyko1ZoNWnUyq7bY1XbjeTeCHimCzPU1',
        '16DKyH4fggEXeGwCytqM19e9NFGkgR2neZPDJ5ta8BKpPbPK',
        '15oKi7HoBQbwwdQc47k71q4sJJWnu5opn1pqoGx4NAEYZSHs',
        '145Vw57NN3Y4tqFNidLTmkhaMLD4HPoRtU91vioXrKcTcirS',
        '14QBQABMSFBsT3pDTaEQdshq7ZLmhzKiae2weZH45pw5ErYu',
        '13giQQe5CS4AAjkz1roun8NYUmZAQ2KYp32qTnJHLTcw4VxW',
        '1342iFZNrBfCP9VWxqt5p39LiHp2ynyq85Ww9K7R8w6BURps',
        '12YP2b7L7gcHabZqE7vJMyF9eSZA9W68gnvb8BzTYx4MUxRo',
        '134Bw4gHcAaHBYx6JVK91b1CeC9yWseVdZqyttpaN5zBHn43',
        '13uW7auWPX9WAtqwkBx7yagb78PLcv8FAcPZEVCovbXoNJK4',
        '11uMPbeaEDJhUxzU4ZfWW9VQEsryP9XqFcNRfPdYda6aFWJ',
        '15qomv8YFTpHrbiJKicP4oXfxRDyG4XEHZH7jdfJScnw2xnV',
        '1Wo6qcrh7wxc1kQY5nfixFuCAFuzkgiwau64SmrPXBE7vVf',
        '129TM37DNpyJqtRYYimSMp8aQZ8QW7Jg3b4qtSrRqjgAChQf',
        '12GsUt6XbVMHvKt9NZNXBcXFvNCyTUiNhKpVnAjnLBYkZSj1',
      ],
      kusama: [
        'CtsCpqinjxip4wAmmUfCmNjr9DHmzKTek44vDGEqygPzWhq',
        'DSBRekdnq36wCprMDJakBEaVk3xwSHHghJ5ht8jhfJmE5su',
        'CiWDfiBZYZ3CVDGFg7zZjoiJapDainQNMibPKFFxKgukJCX',
        'Di7jPwKdcKU3mou3LURTr26Kknxn3D6f5a7hnMwop1PVEV2',
        'FDKyVTqcnVpmQkBez6mmawzLHeZhbpGmznVZfUxZmjsVQrL',
        'CdvyGjJbfcgcHuTyJKLGUA9u3kypCaHpohCEeUXmbTKryPR',
        'Dkz7kFKA33PKvCAkJUhhWkS6ePi7x7FaxQD3oj8BFSpx6fm',
        'CrzzBoQBZVNR6edHbamfjw6ZhqJkTj86MvbBHR8c6YNh3s8',
        'HCndu2cy9poWZHx1V1PVw73dbkKdZ6FeyHiSTiihw3yeF9s',
        'FSGuZM71oEXHhsGuLUJBqgVGfAqQNgM7qWuui9mwnhsbFp5',
        'EkWPyLL3kUw1iVicwkPe7JiWNFezWX5TmH4ybipDCWss3Uu',
        'DB4BYokEZ3u9JrTtQUcVp1XwtPDjtGpq3Vv8JKBwPmWQ8zD',
        'GtchQYnbrzKeBEuZf7UKgb2mGRzX7cXRT6wav3CDG4eEbb4',
        'Da6FyV3dbfwhbb8tssJqSCzC79pWEZzyXxp5vXySB8rQRJd',
        'DQX3arNph8UXAALhLM6vj4a4B5E68vYaLDh9Up9gsz1h4HE',
        'Cmq74A1w5AmwgPVFofVz5bwYidPGNmZZVf15jYZTDBZdWBJ',
        'HsxGLNhJabLdnCpY2gQzfevq5BiiMn4dvEj6r6Z1xggq3nJ',
        'DahPwrmRmSEjNCqEehzuGddTmvFnk9q7g6wo4saRqBQ18RK',
        'EDEVriQd4TpEHHyWnLbQHDYjY9avxxkWhNmBou4SHKixgt1',
        'HhQCLnKTcsZH75LYR1oj5MVKrs2RJyn8Cvcs8VR8nDGeKkW',
        'F2VckTExmProzJnwNaN3YVqDoBPS1LyNVmyG8HUAygtDV3T',
        'F5YUotdVsSxgF9kuoC6UySCdJBQKUnP8ry5baevkHYqTV7T',
        'DteShXKaQQy2un2VizKwwhViN5e7F47UrkAZDkxgK22LdBv',
        'GXTJJh2kQJoS9amET2WmZ82uFkm7HYCScoP9bEDV5JyKsWE',
        'EcfwqGUs6Dk6ct4rvbjXrDGLte4F1sYsKRCQn2g9xJaJ3Sx',
        'EJ1nsibhbrCbbc458QUTY6udJKnDxAWL5ZNdYHum9RXHqDu',
        'Ehx9cthQ1isdL8mi2dVn4tykuUiStEMwM2Cj2N6ddK53C2B',
        'HPJWoH3To2L8uSvBsVYVuaxAjeNnythQbpxMeoDbZf6tSe2',
        'HZUyowqk6wH6o8B4Asf7P7hLuRXy8hPheNCKevN5QFFRRdd',
        'CaxeCQ3JWSrZiRNyCTnE4vT8aMrX1sJDJWCXSwrEpxWkiL5',
        'GHXKyWqC2Jm69XmVGjbQWBC7XVtbwRHszYKAVa5LFxFSEmG',
        'GM9dSVNSrskXAruSdDGteqGtv8uv4zoLty6FrQLhrgp5enN',
      ],
    },
  },
  {
    name: 'ParaNodes.io',
    icon: 'Paranodes',
    bio: 'ParaNodes offers nominators high returns through low commissions and high reliability.  ParaNodes is a team of three (3) individuals over two timezones to ensure adequate coverage.  We take a knowledge and process based approach to ensuring security and stablility of operations.',
    email: 'support@paranodes.io',
    x: '@paranodes',
    website: 'https://paranodes.io/',
    validators: {
      polkadot: ['14hM4oLJCK6wtS7gNfwTDhthRjy5QJ1t3NAcoPjEepo9AH67'],
      kusama: [
        'H3DL157HL7DkvV2kXocanmKaGXNyQphUDVW33Fnfk8KNhsv',
        'HtYny8Eker9VBEKQrtBd6Y5PTkaHQFSvyMFy2bkd66wGBan',
        'FkWky3r2bryP3aaAwVWykYrKesAwkDyKZWsDyBvck7YawSi',
        'EsNZHmG4bQMGzQNK4Z2CR7Hdhu4or7p2vsLRChUEJcjJAeU',
        'EriYFJuqCeBF6SFkKxyQWwaTvT9tcoF9ZGDQ4LX3a1iBsYr',
        'ESzw1JdRfoBNUKo12qjqu4RMgro3exrit1Tr1GGFjVhyHZf',
        'DtrDM8ZZpBhTSwptMCgYEzJqbPUFArScxikZfbd9tHA47PZ',
        'EWxmJtdmRUtpgLiHzFbtQc3E2jDx9j3VYZPmjWCEaSUnCZG',
        'HyZUEZw5G18KtisetKL274g2Kh6i2XHKtFoheyKJW9vBwXu',
        'Gu6Jt8TJQ3LF7dJgVLCr1JfoxKTcWhMAoaXr8ATczMAE9vm',
        'ECLwZzFusnTr6hdztrkVaTKeQoWxKZBh9e8EzdG92QX7PAy',
        'EjHrXpRHyo1WpWEmFKTYT8wEtTXKnzZDQAth1MErwDmabmq',
        'GpZgakHH3wR1vCvYFgy8Q1iJWYqxyQiRPyeXhGKWxX88uXP',
        'CecU9j1rpC6CDSzFjtrUmNqonzVk5n1BNFiTiN9vadA1rMs',
        'FYiswPLWbZAJSBJ3AcGcXpQYxCJW3eE56QQvnshGUEKJexW',
      ],
    },
  },
  {
    name: 'PDP_Validator',
    icon: 'PDP',
    bio: 'Our service has its own infrastructure and a team of administrators. The beneficiaries of our service are investment professionals. We validate in projects from the top 10. We will help you earn!',
    email: 'pavel.butenko@yahoo.com',
    x: '@PaulBAciD',
    website: 'https://t.me/go300info',
    validators: {
      polkadot: ['16Y3FmTiJ3ZYAUZrf5rZtxrQJzcHsDBdscpu2zgMD2xN6NY7'],
      kusama: [
        'J7MmkYX4dJzUbNnU9ccemPFbxtsyaSgFVwAGMxx8k9Lf5cu',
        'HCogweijHTm85qf9cSUqjNmyZZvu61r4SsTcsAT7S7pgpem',
      ],
    },
  },
  {
    name: 'PIONEER STAKE',
    icon: 'PioneerStake',
    bio: 'We have been active validators since 2019 on the Kusama and Polkadot networks. Service is working on warranty and investment prospects ',
    email: 'pioneer.validator@gmail.com',
    x: '@Ihor07054865',
    validators: {
      polkadot: [
        '129LBt5T1eYtnGHbPYeiiMdmWfokCiiq7z6JBfjnYifiombz',
        '13mjnUDrHwYGATFB1FkFkZ1U3kYFsAQfHYTdcc8p3HP1xzZA',
        '15MUBwP6dyVw5CXF9PjSSv7SdXQuDSwjX86v1kBodCSWVR7c',
      ],
      kusama: [
        'EQF693vsen6WxMdoYgf2cypvH4saFJWFzDupoFUT79MffeW',
        'CaVLqgMmajk7ySYjo4SPqauXwsZu8Y5tP9vVDvJvcecbp3n',
        'G543pxmwKNAbW2WepZW7Ss9Wgx9wuDQWcPyhk4eEzpzcibG',
        'F7c6ocWu397zYewAHBxqTwHgXhXDebgYSVjRX9oQM42hkpn',
        'Cm6QfCvV3vud3X6Zfg3yMBEnG6JFNsn6EzcZv6UyqTefkR1',
      ],
    },
  },
  {
    name: 'polkachu.com',
    icon: 'Polkachu',
    bio: 'Polkachu Validators helps investors compound their crypto investments with low commission and advanced support.',
    email: 'hello@polkachu.com',
    x: '@polka_chu',
    website: 'https://polkachu.com/',
    validators: {
      polkadot: ['15ym3MDSG4WPABNoEtx2rAzBB1EYWJDWbWYpNg1BwuWRAQcY'],
      kusama: [
        'CsKvJ4fdesaRALc5swo5iknFDpop7YUwKPJHdmUvBsUcMGb',
        'GpyTMuLmG3ADWRxhZpHQh5rqMgNpFoNUyxA1DJAXfvsQ2Ly',
        'CeD8Kk3QLzp2HDRSciF6YQAc2xYAPurMsHAQUGwEJgCWAf2',
        'GZmbAW7rRi2qkMrHYzmeG2a3fS7nTaAZpjdum8QZ7CvmM7H',
        'G1qbViqnm6yCZwEbfB4oE38ro8VqJx21zyvW7QN8zAJC2B7',
      ],
    },
  },
  {
    name: 'Polkadotters',
    icon: 'Polkadotters',
    bio: 'We are Polkadot focused node operators and community builders from Czechia.',
    email: 'polkadotters@protonmail.com',
    x: '@Polkadotters1',
    website: 'https://polkadotters.com/',
    validators: {
      polkadot: [
        '16A4n4UQqgxw5ndeehPjUAobDNmuX2bBoPXVKj4xTe16ktRN',
        '12L5m9htNsUP58mBHFXcsABDSCohhX2J4nMuY9TrJHNLCssQ',
      ],
      kusama: ['FVAFUJhJy9tj1X4PaEXX3tDzjaBEVsVunABAdsDMD4ZYmWA'],
    },
  },
  {
    name: 'ProStakers.com 💎',
    icon: 'ProStakers',
    bio: 'ProStakers is a supporter of the Polkadot ecosystem running network validators. We prioritize security by monitoring our systems 24/7. Our team provides competitive services with low comissions.',
    email: 'polkadot@prostakers.com',
    x: '@ProStakersCom',
    website: 'https://prostakers.com/',
    validators: {
      polkadot: [
        '12R2eXcE2QhMa9BkMsWktt9wmoxbgiQBDG9YUM1p94r2F5UD',
        '13sULqZ2NidBvrocYwJYxT6WJkcSY77SiQXtFiJHsurTZgqN',
        '16ccKvsUEj7zuvxadvrpsVpGUNKjycdQcads4u2afwvfLtbp',
      ],
      kusama: ['JLcdsEGtVtR22RuRPDa2tCMwBCox1FnyhJS8UWwSge1q8L6'],
    },
  },
  {
    name: '🍀ARISTOPHANES🍀',
    icon: 'PythagorasCapitalInvestment',
    bio: 'Our motto is responsibility and transparency. We never go offline willfully or negligently, or impose exorbitant commission rates. Our record proves the trust people have placed on us. Being a Tokyo-based node, staking at us strengthens geological resistance of the network to disruptions.',
    email: 'subscr3zp@tutanota.com',
    x: '@PythagorasCI',
    website: 'https://pythagoras-capital.net/',
    validators: {
      polkadot: ['128iAScPNNZcoSXQuFp1VkgW376KqvZs61g9Y36MuUX78ZZ6'],
      kusama: [
        'HU6TSsvA84GKrTiyArBHiFDVBSLHNr5Ki3qPV7T8WKyVJaz',
        'JHbMAHJw6nnQPD3Zth13DGoPxLjYUPWC71AMbErt817nK9y',
      ],
    },
  },
  {
    name: 'Sekoya Labs',
    icon: 'SekoyaLabs',
    bio: 'Focused on improving blockchain decentralization, Sekoya Labs runs world class validators that return the best product for our nominators.',
    email: 'tom@sekoyalabs.com',
    x: '@sekoyalabs',
    website: 'http://sekoyalabs.com',
    validators: {
      polkadot: ['15PeEsbJeU2BZDgoCmo6xdzsuRaZv1PxLaCUyFmfWPwkZPJ4'],
      kusama: ['Dtf5sKpKrQ3mc9SK1WmRTR3oaKyAS3p27LEeWCLPF6gsDuU'],
    },
  },
  {
    name: 'Stakely',
    icon: 'Stakely',
    bio: '🔥 Professional validator highly experienced in PoS 🔥 Slashing protection & Eligible for airdrops | Learn with our staking guides, video tutorials and FAQs | Part of the commission of our nodes will go to our Multicoin Faucet funds and other tools 🌱 Carbon Neutral 🌱',
    email: 'nodes@stakely.io',
    x: '@stakely_io',
    website: 'https://stakely.io',
    validators: {
      polkadot: ['15R1Th3ULXAq81QPGeEDfE1ywbw19AjZiARxH7czm83wS2w2'],
      kusama: ['EfcQCKZJaNu2vcrpnJDCoh1ub4mGWcHVzeU8ghUH7Co9rui'],
    },
  },
  {
    name: 'Stake🧲Magnet',
    icon: 'StakeMagnet',
    bio: 'Our platform is proud to offer comprehensive staking services for both the Polkadot and Kusama networks. Our validators have proven history of 100% availability and zero slashes, stake with us on-chain.',
    email: 'info@stakemagnet.com',
    website: 'https://stakemagnet.com/',
    validators: {
      polkadot: ['13Emjax1tBfQMEKisppTMMe7jMbqpmCH1jRpTXudLocaevND'],
      kusama: [
        'HKk5gnHuuePbKq6UbMn7sV3UxsifyZXyhYQqyrL8RPRBdq8',
        'DaCVzWm7vqbJdRd9U9Cwgqx74DC9m1dasEXNTkftdAwwaRc',
      ],
    },
  },
  {
    name: 'Stakepile.com',
    icon: 'Stakepile',
    bio: 'Reliable, independent staking service with low fees to help you earn better yields. We actively participate in all community on-chain governance. Our nodes are geographically distributed across several regions for better redundancy and decentralization.',
    email: 'stake@stakepile.com',
    x: '@stakepile',
    website: 'https://stakepile.com',
    validators: {
      polkadot: ['124X3VPduasSodAjS6MPd5nEqM8SUdKN5taMUUPtkWqF1fVf'],
      kusama: [
        'J6TTn21p46c1XzXAZPVTGuQwBxFG2JfTwRnAFwgcdE2SWdz',
        'EAChfSL6tQfjy7vD8YgYB8DCn7A9c1aAsERP9Hx8cj1tqxL',
      ],
    },
  },
  {
    name: 'Sik | crifferent.de',
    icon: 'Crifferent',
    bio: 'Crifferent offers reliable and secure staking services made in Germany. Combining professionals from IT, marketing, and finance, they evaluate the best projects and offer services to its full extent.',
    email: 'simon.kraus@crifferent.de',
    x: '@dev0_sik',
    website: 'https://crifferent.de/',
    validators: {
      polkadot: ['15wepZh1jWNqxBjsgErm8HmYiE21n79c5krQJeTsYAjHddeM'],
      kusama: [
        'HWyLYmpW68JGJYoVJcot6JQ1CJbtUQeTdxfY1kUTsvGCB1r',
        'GLSikJaXTVWvWtUhzB3Bj6xb5TcnhTUp6EuAkxaCohT9UBv',
      ],
    },
  },
  {
    name: 'Stake Plus',
    icon: 'Stakeplus',
    bio: 'Providing high quality renewable powered crypto services to blockchain ecosystems.',
    email: 'contact@stake.plus',
    x: '@StakePlusCrypto',
    website: 'https://stake.plus',
    validators: {
      polkadot: ['152QidDC4QrtMCyRGiQmvrNyjntvMg2XouCSdoPSeqUNTvsq'],
      kusama: [
        'FLiadJNdXvLi8TJ62XzrQVxmZaT8z5hAr1YXQg437r8o4G6',
        'CibcGcwnThunMNYrStEWHYdr5WDuy8QnMgT3Vr39JeWCcQs',
        'Hhgs6hgUeAkAd2c3SbphWxAvm9hSoqRxnoarZgrB2pJYPJT',
        'FPVebvd7u2TtyU2magxZVvRqzAHpGZ9aJ9rHXewpHqMGuzr',
        'F8FswEGD1quEyNciuR9KwsragUmqnk7mFLqmAdRdnY9Sdwx',
        'DqsZ7nrch8Ro9HqP1ZX7CbbpZFWy2V4bWjWWjNA2PAehZsW',
      ],
    },
  },
  {
    name: 'Staker Space',
    icon: 'StakerSpace',
    bio: 'Hi! We are an independent and experienced staking provider. Our homebase is the Netherlands, but we have a run across multiple geographical locations dedicated hardware for our validators. We have been running Kusama and Polkadot validators since the start of the network are highly experienced in doing so. If you have any questions, please get in touch with us.',
    email: 'hello@staker.space',
    x: '@stakerspace',
    website: 'https://staker.space',
    validators: {
      polkadot: [
        '16SpacegeUTft9v3ts27CEC3tJaxgvE4uZeCctThFH3Vb24p',
        '14N5nJ4oR4Wj36DsBcPLh1JqjvrM2Uf23No2yc2ojjCvSC24',
        '1NqVmUJCyaj5yZ9jp7ZZa58hbUx2QaBZ4eSCu9bqAdZXgAm',
      ],
      kusama: [
        'FcjmeNzPk3vgdENm1rHeiMCxFK96beUoi2kb59FmCoZtkGF',
        'Eksma7JmWh8DenpNKi2uCavwaKJ9QrJJbtcnmwJr3hbHSmC',
        'Dm64aaAUyy5dvYCSmyzz3njGrWrVaki9F6BvUDSYjDDoqR2',
        'DfHkfoKa6xzNMWTNGL8SH8VyY69gajen4ijgmegeU4cZm1H',
      ],
    },
  },
  {
    name: 'Stakeworld',
    icon: 'StakeWorld',
    bio: 'Stakeworld is based in the Netherlands and provides highly reliable, low commission Polkadot and Kusama validator services with nodes hosted on dedicated (bare metal) hardware.',
    email: 'info@stakeworld.io',
    website: 'https://stakeworld.io',
    validators: {
      polkadot: [
        '14kpNbU4XjEHfYdqp95Gq3NkBWbgFd6J8Yjd2SneWNzvf1Yp',
        '14ebRSbCJepTp2X3YwDsyE3wRRQ1RZYa8nEFnLxLe19qdHna',
        '15MS9CHMMRtM5NQax9rAh2HTbmAehVdpEPMf4UzsBL6Mn6mz',
        '13CKU6wfn1j3SB8ena6Heb3hgo35yCFtvkAotyCPpJRnEkFg',
        '1RsqWYLNuHr9fw961TBABLM4R76mZSZEZv3ohWeiNE6Pixb',
      ],
      kusama: [
        'CtEni6wrP7Kz2KWus9Y6vQWuhLqJpd9mQFTmTvw8T7FLui8',
        'FZ1GFKR6tYx9gNGHV67h5aV6bfhAbh7ZRdU9ypVvXfseyfg',
        'Dh2ZNKbQMdusURjfZZj7Bczb57PGEoCVmDHdq8hjnH5PZ4E',
        'FNPCfXrsrA8775HGuRvK9seULKpcnxNTTKTGUL4h267YHvw',
        'Hqk9zDKr84PF84ScDQJ29FHyGnKyQsXZPmLuAWFBgKZUybi',
        'Et9ptsqCeSoxNrUuMjg7NBy38jvtsWptQ8WB7WipYouwEz4',
        'JK6wyhbU3sX6jt7yHfZ5QvVb41vXbrhDLahwom9rdDzggjQ',
        'HaGoMnbQGSXgN3SP5g25ALxjJ51yQYCNRiwYALzwAbgpSVY',
        'JK6dqUUj8ySSCjAXs4f2tfgS9amdrpz7eU29n4UDDwtLEfp',
      ],
    },
  },
  {
    name: 'Staking4All',
    icon: 'Staking4All',
    bio: 'We want to make staking on blockchain projects clear and transparent so everyone can stake and receive returns on their crypto holdings. Stake with us!',
    email: 'staking4all@gmail.com',
    x: '@staking4all',
    website: 'https://www.staking4all.org/',
    validators: {
      polkadot: [
        '14cxMDpBNLsNEXWyCzked3zghzaYWXwoqGT4h12GqQXdVhmn',
        '16g43B7VPfTmpXQujSz3aKbqY9twSrDreHFWtwp4P7bLkQPp',
      ],
      kusama: ['GTUi6r2LEsf71zEQDnBvBvKskQcWvK66KRqcRbdmcczaadr'],
    },
  },
  {
    name: 'Staking Facilities',
    icon: 'StakingFacilities',
    bio: "Staking Facilities is your trusted staking provider. Our international team operates highly secure, physical infrastructure with guaranteed uptimes in certified data centers based in Germany. We offer you non-custodial staking services, personal support, and tools for a variety of hand-selected public Proof-of-Stake blockchains for which we always put down a substantial self-bond in order to best align everybody's incentives.",
    email: 'info@stakingfacilities.com',
    x: '@StakingFac',
    website: 'https://stakingfacilities.com/',
    validators: {
      polkadot: [
        '15Sf82YbMQjtpgnExXFxzrwTsAXJKHVU9tzQV6WizAPo1dfL',
        '165JpxmCRi28GwbFAjjrD74FTfGdLfHi1LUGMaYLjziDvi4r',
      ],
      kusama: [
        'H1ye1dQ7zVM8obAmb21kfUKA8otRekWXn6fiToKusamaJK9',
        'HedLwr1CHmab4QAyoVtxub6kdZDT2YkPDaXawpwfhuCVFjN',
      ],
    },
  },
  {
    name: 'TurboFlakes',
    icon: 'TurboFlakes',
    bio: 'TurboFlakes provides validators with character running on top of dedicated and high performance servers. Raiden, Coco, Momo, Toto and Dodo are our named validators serving non-stop Polkadot and Kusama. We also provide end-user tooling to help you to interact with substrate blockchain networks. Feel free to reach out.',
    email: 'hey@turboflakes.io',
    x: '@turboflakes',
    website: 'https://turboflakes.io',
    validators: {
      polkadot: ['12gPFmRqnsDhc9C5DuXyXBFA23io5fSGtKTSAimQtAWgueD2'],
      kusama: [
        'FZsMKYHoQG1dAVhXBMyC7aYFYpASoBrrMYsAn1gJJUAueZX',
        'GA7j1FHWXpEU4kavowEte6LWR3NgZ8bkv4spWa9joiQF5R2',
        'GwJweN3Q8VjBMkd2wWLQsgMXrwmFLD6ihfS146GkmiYg5gw',
        'FUu6iSzpfStHnbtbzFy2gsnBLttwNgNSULSCQCgMjPfkYwF',
      ],
    },
  },
  {
    name: 'VF Validierung',
    icon: 'VFValidierung',
    bio: 'We are crypto enthusiasts from Germany and offer independent and reliable validation and staking returns.',
    email: 'contact@validierung.cc',
    x: '@validierungcc',
    website: 'https://www.validierung.cc',
    validators: {
      polkadot: ['15x643ScnbVQM3zGcyRw3qVtaCoddmAfDv5LZVfU8fNxkVaR'],
      kusama: [
        'HhBer1indmu4m1A1fMKRsCEQ8pfWGHUMskWjD2HLpspJTuW',
        'JHamburgTPv9fRKwTPeBEjyVHmbQK2ayRBpBujb4rx2sHzJ',
        'GHd1brgDS29LhSUMYSorgEWFb2n1M3H4EMz6mcpt8TTdHho',
        'FDAugsNraejDeJHt8n4MSc5Gvn9zuAibNQ9qFQdGNVWYvtx',
      ],
    },
  },
  {
    name: 'WOJDOT ʕ •ᴥ•ʔ',
    icon: 'Wojdot',
    bio: 'Independent Polkadot Validator. We run our service on bare metal machines via a cloud service with the ability to spin up validator nodes in different regions within a matter of minutes.',
    email: 'wojdot@wojdot.com',
    x: '@wojdot',
    validators: {
      polkadot: ['13kz33kotYa3M75u5avMS367zJY3Fx2y5ZYASEPunqfEeCjD'],
    },
  },
  {
    name: '🐲 DragonStake 🐲',
    icon: 'DragonStake',
    bio: 'Genesis block and Community focused Validator. We run industrial grade staking infrastructure on main proof of stake networks from their earliest testnets. We offer high yields, low commissions and high reliability',
    email: 'hello@dragonstake.io',
    x: '@DragonStake',
    website: 'https://dragonstake.io',
    validators: {
      polkadot: [
        '1dGsgLgFez7gt5WjX2FYzNCJtaCjGG6W9dA42d9cHngDYGg',
        '12dGS1zjyiUqj7GuxDDwv9i72RMye1mT7tSWNaSx7QVeJ32H',
      ],
      kusama: [
        'DSpbbk6HKKyS78c4KDLSxCetqbwnsemv2iocVXwNe2FAvWC',
        'DSA55HQ9uGHE5MyMouE8Geasi2tsDcu3oHR4aFkJ3VBjZG5',
        'J4XkgJjMP6c1pqneV5KogJvJLM1qReXP9SAMJt33prnDdwB',
      ],
    },
  },
  {
    name: 'Stakin',
    icon: 'Stakin',
    bio: 'Institutional-grade web3 infrastructure provider and staking service. We provide secure and reliable validators for the Kusama, Polkadot and Substrate ecosystem, with both community validators and dedicated enterprise nodes.',
    email: 'hello@stakin.com',
    x: '@StakinOfficial',
    website: 'https://stakin.com',
    validators: {
      kusama: [
        'DDdwYhRXzGWBvvaqMEQ7acJs21FiB96L7nnJZfq6HxseFxW',
        'J7GBXrco7J5varAbb5TEUhYbjCZLzKXcTgUTpkFbUoa9GVm',
      ],
    },
  },
  {
    name: '🍯 HoneyStake.xyz 🍯',
    icon: 'HoneyStake',
    bio: '🍯 HoneyStake.xyz 🍯 is an independent validator operator with bare-metal nodes on dedicated hardware in Zaragoza, Spain. We provide low-commission, secure services for Polkadot and Kusama, with high uptime and a 💰 Bonus Rewards Program 💰 to maximize staking returns.',
    email: 'honeystake@honeystake.xyz',
    website: 'https://honeystake.xyz',
    validators: {
      polkadot: [
        '1KikY9PK1kYwawnGcERnzLbSi39cJyxMRW5iLNsg2nfjWiN',
        '156dG94Rcq61HVrn6Ndx33NysDimutzAq7j5Mz7yo2Hxf6wh',
      ],
      kusama: [
        'Cu3GXEC5bW1Fhki5fzUYnsSjgKjigEzjJcLwhfUbjyeJPC6',
        'Gfwn89EPQqTbcfhuSPznquqAC1N2GFDCzqLbMQaijUwDspf',
        'FVkxBDehfaTfRiGtE2m2zLnMXQXji66KVpd7xviufZpGYYC',
        'HPrV3G2PR2AtyMf2uoDBE4GyvRGdz9UhUASEvSGEENmobBB',
        'Gj4dYBs4PPvQjf7Exkrpfe65EoitvdecNYhtBPa3ymWZF3S',
        'HqFz6V9aV4dLXaGp6TY5tLdK85vkiiea96GVUJQ7hgXUqh5',
        'EfWJofhHXhL6RkaoSxrXbq3wWkta1bmXxqTbDtBcF5wnR6N',
      ],
    },
  },
  {
    name: 'helixstreet',
    icon: 'Helixstreet',
    bio: 'helixstreet: a Polkadot project revolutionising life sciences with blockchain. Our validators? Independent, bare metal, and crucial to our success. Nominate them, champion innovation.',
    email: 't@helixstreet.io',
    website: 'https://helixstreet.io',
    validators: {
      polkadot: ['1HMQVknF2rGz2vBegqA9jU4NhZKQtW7nZTDQykgeSm8FgPa'],
      kusama: [
        'J6K1vA6ynGo2GrotGpP5ocHKr82JFTv7NUnzJcoRfTcCn8T',
        'F3EJS4BsGsxjvigBcgte4ZfYUhpcizMQizQ5TxkR5ts378r',
        'DGvPFG7dHMWryfHQD2XBQ4WX1nM5KnyHmsLSj2k7DaBRhUD',
        'CrfvUqb1cbjJ9j7TkbCuXzuffquXFmAASZUeM3Ha9x6pXjX',
      ],
    },
  },
]
