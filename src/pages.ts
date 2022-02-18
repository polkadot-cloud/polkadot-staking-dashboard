import Overview from './pages/Overview';
import Stake from './pages/nominate/Stake';
import Browse from './pages/validators/Browse';
import Payouts from './pages/validators/Payouts';
import Projects from './pages/explore/Projects';
import {
  faUserFriends,
  faBraille,
  faServer,
  faWallet,
  faChartLine
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
    icon: faWallet,
  }, {
    category: 3,
    title: 'Community',
    uri: '/community-projects',
    Entry: Projects,
    icon: faUserFriends,
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