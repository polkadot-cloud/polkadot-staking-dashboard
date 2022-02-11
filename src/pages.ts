import Overview from './pages/Overview';
import Nominations from './pages/nominate/Nominations';
import Browse from './pages/validators/Browse';
import Payouts from './pages/validators/Payouts';
import Projects from './pages/explore/Projects';

export const PAGE_CATEGORIES = [
  {
    _id: 1,
    title: 'default'
  },
  {
    _id: 2,
    title: 'Nominate',
  },
  {
    _id: 3,
    title: 'Validators',
  },
  {
    _id: 4,
    title: 'Explore',
  }
];

export const PAGES_CONFIG = [
  {
    category: 1,
    title: 'Overview',
    uri: '/',
    Entry: Overview,
  },
  {
    category: 2,
    title: 'Nominations',
    uri: '/nominations',
    Entry: Nominations,
  },
  {
    category: 3,
    title: 'Browse',
    uri: '/validators',
    Entry: Browse,
  },
  {
    category: 3,
    title: 'Payouts',
    uri: '/payouts',
    Entry: Payouts,
  },
  {
    category: 4,
    title: 'Community',
    uri: '/community-projects',
    Entry: Projects,
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