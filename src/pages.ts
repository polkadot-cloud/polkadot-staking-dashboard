export const PAGE_CATEGORIES = [
  {
    _id: 1,
    title: 'default'
  },
  {
    _id: 2,
    title: 'Staking'
  },
  {
    _id: 3,
    title: 'Explore'
  }
];

export const PAGES_CONFIG = [
  {
    category: 1,
    title: 'Home',
    uri: '/'
  },
  {
    category: 2,
    title: 'Overview',
    uri: '/staking-overview'
  },
  {
    category: 2,
    title: 'Payouts',
    uri: '/staking-payouts'
  },
  {
    category: 3,
    title: 'Community',
    uri: '/community-projects'
  }
];

export const pageTitleFromUri = (pathname: string) => {
  for (let page of PAGES_CONFIG) {
    if (page.uri === pathname)
      return page.title;
  }
  return '';
}

export default PAGES_CONFIG;