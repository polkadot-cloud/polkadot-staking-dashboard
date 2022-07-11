// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PageTitle } from 'library/PageTitle';
import { PageRowWrapper } from 'Wrappers';
import { PageProps } from '../types';
import { Wrapper, ItemsWrapper, Item } from './Wrappers';

export const Projects = (props: PageProps) => {
  const { page } = props;
  const { title } = page;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        duration: 1,
        staggerChildren: 0.25,
      },
    },
  };

  const listItem = {
    hidden: {
      opacity: 0,
      y: 50,
      transition: {
        duration: 0.5,
      },
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <Wrapper>
      <PageTitle title={`${title} Validators`} />

      <PageRowWrapper className="page-padding">
        <div>
          <h2>Validator Programs</h2>
          <ItemsWrapper variants={container} initial="hidden" animate="show">
            <Item
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              variants={listItem}
            >
              coming soon
            </Item>
          </ItemsWrapper>

          <h2>Staking in the Polkadot Ecosystem</h2>
          <ItemsWrapper variants={container} initial="hidden" animate="show">
            <Item
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              variants={listItem}
            >
              coming soon
            </Item>
            <Item
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              variants={listItem}
            >
              coming soon
            </Item>
          </ItemsWrapper>
        </div>
      </PageRowWrapper>
    </Wrapper>
  );
};

export default Projects;
