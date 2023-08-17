// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { PageTitle } from '@polkadot-cloud/react';
import { useTranslation } from 'react-i18next';
import type { PageProps } from 'types';
import { Entity } from './Entity';
import { List } from './List';
import { Wrapper } from './Wrappers';
import { CommunitySectionsProvider, useCommunitySections } from './context';

export const CommunityInner = ({ page }: PageProps) => {
  const { t } = useTranslation('base');
  const { activeSection } = useCommunitySections();

  const { key } = page;

  return (
    <Wrapper>
      <PageTitle title={t(key)} />
      {activeSection === 0 && <List />}
      {activeSection === 1 && <Entity />}
    </Wrapper>
  );
};

export const Community = (props: PageProps) => (
  <CommunitySectionsProvider>
    <CommunityInner {...props} />
  </CommunitySectionsProvider>
);
