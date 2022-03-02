// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { HeadingWrapper as Wrapper } from './Wrapper';

export const Heading = (props: any) => {

  const { title } = props;

  return (
    <Wrapper>
      {title}
    </Wrapper>
  )
}

export default Heading;