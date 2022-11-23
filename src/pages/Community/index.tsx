// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PageTitle } from 'library/PageTitle';
import { useTranslation } from 'react-i18next';
import { PageProps } from '../types';
import { CommunitySectionsProvider, useCommunitySections } from './context';
import { Entity } from './Entity';
import { List } from './List';
import { Wrapper } from './Wrappers';

export const CommunityInner = (props: PageProps) => {
  const { page } = props;
  const { key } = page;

  const { activeSection } = useCommunitySections();
  const { t } = useTranslation('base');

  return (
    <Wrapper>
      <PageTitle title={`${t(key)}`} />
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
