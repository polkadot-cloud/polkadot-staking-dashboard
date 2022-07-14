// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PageTitle } from 'library/PageTitle';
import { PageRowWrapper } from 'Wrappers';
import { VALIDATOR_COMMUNITY } from 'config/validators';
import { PageProps } from '../types';
import { Wrapper, ItemsWrapper } from './Wrappers';
import { Item } from './Item';
import { CommunitySectionsProvider, useCommunitySections } from './context';

export const CommunityInner = (props: PageProps) => {
  const { page } = props;
  const { title } = page;

  const { activeSection } = useCommunitySections();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.05,
      },
    },
  };

  return (
    <Wrapper>
      <PageTitle title={`${title}`} />
      {activeSection === 0 && (
        <PageRowWrapper className="page-padding">
          <ItemsWrapper variants={container} initial="hidden" animate="show">
            {VALIDATOR_COMMUNITY.map((item: any, index: number) => {
              return <Item key={`community_item_${index}`} {...item} />;
            })}
          </ItemsWrapper>
        </PageRowWrapper>
      )}
      {activeSection === 1 && (
        <PageRowWrapper className="page-padding">
          <ItemsWrapper variants={container} initial="hidden" animate="show" />
        </PageRowWrapper>
      )}
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
