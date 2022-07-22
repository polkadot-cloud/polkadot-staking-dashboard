// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PageTitle } from 'library/PageTitle';
import { PageProps } from '../types';
import { Wrapper } from './Wrappers';
import { CommunitySectionsProvider, useCommunitySections } from './context';
import { List } from './List';
import { Entity } from './Entity';

export const CommunityInner = (props: PageProps) => {
  const { page } = props;
  const { title } = page;

  const { activeSection } = useCommunitySections();

  return (
    <Wrapper>
      <PageTitle title={`${title}`} />
      {activeSection === 0 && <List />}
      {activeSection === 1 && <Entity />}
    </Wrapper>
  );
};

export const Community = (props: PageProps) => {
  return (
    <CommunitySectionsProvider>
      <CommunityInner {...props} />
    </CommunitySectionsProvider>
  );
};

export default Community;
