// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { HeadingProps } from './types';
import { HeadingWrapper } from './Wrappers';

export const Heading = (props: HeadingProps) => {
  const { title } = props;

  return (
    <HeadingWrapper>
      <h4>{title}</h4>
    </HeadingWrapper>
  );
};

export default Heading;
