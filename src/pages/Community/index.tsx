// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PageTitle } from 'library/PageTitle';
import { PageRowWrapper, GoBackWrapper } from 'Wrappers';
import Button from 'library/Button';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { useValidators } from 'contexts/Validators';
import ValidatorList from 'library/ValidatorList';
import { PageProps } from '../types';
import { Wrapper, ItemsWrapper } from './Wrappers';
import { Item } from './Item';
import { CommunitySectionsProvider, useCommunitySections } from './context';
import { List } from './List';
import { Entity } from './Entity';

export const CommunityInner = (props: PageProps) => {
  const { page } = props;
  const { title } = page;

  const { validators } = useValidators();

  const { activeSection, setActiveSection, activeItem } =
    useCommunitySections();

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
