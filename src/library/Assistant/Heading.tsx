// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { HeadingWrapper } from './Wrappers';

export const Heading = (props: any) => {

  const { title } = props;

  return (
    <HeadingWrapper>
      <h4>{title}</h4>
    </HeadingWrapper>
  )
}

export default Heading;