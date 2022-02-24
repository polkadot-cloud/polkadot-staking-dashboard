import Overview from './pages/Overview';
import Stake from './pages/Stake';
import Browse from './pages/validators/Browse';
import Payouts from './pages/validators/Payouts';
import Projects from './pages/explore/Projects';
import {
  faUserFriends,
  faBraille,
  faServer,
  faChartLine,
  faStar,
} from '@fortawesome/free-solid-svg-icons';

export const PAGE_CATEGORIES = [
  {
    _id: 1,
    title: 'default'
  }, {
    _id: 2,
    title: 'Validators',
  }, {
    _id: 3,
    title: 'Explore',
  }
];

export const PAGES_CONFIG = [
  {
    category: 1,
    title: 'Overview',
    uri: '/',
    Entry: Overview,
    icon: faBraille,
  }, {
    category: 1,
    title: 'Stake',
    uri: '/stake',
    Entry: Stake,
    icon: faChartLine,
  }, {
    category: 2,
    title: 'Validators',
    uri: '/validators',
    Entry: Browse,
    icon: faServer,
  }, {
    category: 2,
    title: 'Payouts',
    uri: '/payouts',
    Entry: Payouts,
    icon: faStar,
  }, {
    category: 3,
    title: 'Community',
    uri: '/community',
    Entry: Projects,
    icon: faUserFriends,
  },
];


export const ASSISTANT_CONFIG = [
  {
    key: 'overview',
    definitions: [
      {
        title: 'Epoch',
        description: [
          'An epoch is another name for a session in Polkadot. A different set of validators are selected to validate blocks at the beginning of every epoch.',
          '1 epoch is currently 4 hours in Polkadot.'
        ],
      },
      {
        title: 'Era',
        description: [
          'At the end of each era, validators are rewarded DOT based on how many era points they accumulated in that era. This DOT reward is then distributed amongst the nominators of the validator via a payout.',
          '1 era is currently 24 hours in Polkadot.'
        ],
      }
    ],
    external: [
      {
        label: 'Tutorials',
        title: 'What is Polkadot Staking?',
        subtitle: '',
        url: 'https://polkadot.network/'
      },
      {
        label: 'Tutorials',
        title: 'Validators and Nominators',
        subtitle: '',
        url: 'https://polkadot.network/'
      },
      {
        label: 'Tutorials',
        title: 'Choosing Validators: What to Know?',
        subtitle: '',
        url: 'https://polkadot.network/'
      },
      {
        label: 'Tutorials',
        title: 'Bonding and Unbonding',
        subtitle: '',
        url: 'https://polkadot.network/'
      },
    ]
  },
  {
    key: 'stake',
    definitions: [
    ],
    external: [
      {
        label: 'Tutorials',
        title: 'What are Staking Pools?',
        subtitle: 'The new way to stake on Polkadot',
        url: 'https://polkadot.network/'
      },
      {
        label: 'Tutorials',
        title: 'Slashing and Staking',
        subtitle: '',
        url: 'https://polkadot.network/'
      },
    ],
  },
  {
    key: 'validators',
    definitions: [
    ],
    external: [
    ],
  },
  {
    key: 'payouts',
    definitions: [
    ],
    external: [
      {
        label: 'Tutorials',
        title: 'Understanding Payouts',
        subtitle: 'Read about receiving staking rewards and initiating payouts',
        url: 'https://polkadot.network/'
      },
    ],
  },
  {
    key: 'community',
    definitions: [
    ],
    external: [
    ],
  },
];

export const pageTitleFromUri = (pathname: string) => {
  for (let page of PAGES_CONFIG) {
    if (page.uri === pathname)
      return page.title;
  }
  return '';
}

export default PAGES_CONFIG;