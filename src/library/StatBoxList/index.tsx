// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Wrapper, ListWrapper } from './Wrapper';
import Item from './Item';

export const StatBoxList = (props: any) => {

  const { items } = props;

  return (
    <Wrapper>
      <ListWrapper>
        {items.map((item: any, index: number) =>
          <Item {...item} key={index} />
        )}
      </ListWrapper>
    </Wrapper>
  )
}

export default StatBoxList;