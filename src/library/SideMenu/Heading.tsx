// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useUi } from '../../contexts/UI';
import { HeadingWrapper as Wrapper } from './Wrapper';

export const Heading = (props: any) => {

  const { title, minimised } = props;

  return (
    <Wrapper minimised={minimised}>
      {minimised
        ? <h5>&bull;</h5>
        : <h5>{title}</h5>
      }
    </Wrapper>
  )
}

export default Heading;