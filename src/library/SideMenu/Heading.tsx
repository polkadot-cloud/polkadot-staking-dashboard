// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { HeadingWrapper as Wrapper } from './Wrapper';
import { HeadingProps } from './types';

export const Heading = (props: HeadingProps) => {
  const { title, minimised } = props;

  return (
    <Wrapper minimised={minimised}>
      {minimised ? <h5>&bull;</h5> : <h5>{title}</h5>}
    </Wrapper>
  );
};

export default Heading;
